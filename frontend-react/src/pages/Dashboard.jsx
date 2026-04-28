import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../utils/supabaseClient';

// ----------- Mapping jurusan → kategori yang "cocok" -----------
const MATCH_MAP = {
  'RPL':    ['Teknologi & Teknik'],
  'TKJ':    ['Teknologi & Teknik'],
  'MM':     ['Seni & Desain Kreatif', 'Teknologi & Teknik'],
  'AKL':    ['Bisnis & Manajemen'],
  'OTKP':   ['Bisnis & Manajemen'],
  'BDP':    ['Bisnis & Manajemen'],
  'Lainnya': null, // tidak dihitung
  'IPA/IPS': null, // tidak dihitung
};

const CATEGORY_COLORS = {
  'Tek': '#01ae5a',
  'Sen': '#f59e0b',
  'Sos': '#3b82f6',
  'Bis': '#8b5cf6',
  'Jas': '#ef4444',
};

const CATEGORY_NAMES = {
  'Tek': 'Teknologi & Teknik',
  'Sen': 'Seni & Desain Kreatif',
  'Sos': 'Sosial & Komunikasi',
  'Bis': 'Bisnis & Manajemen',
  'Jas': 'Jasa, Pariwisata & Kesehatan',
};

const JURUSAN_ORDER = ['RPL', 'TKJ', 'MM', 'AKL', 'OTKP', 'BDP', 'IPA/IPS', 'Lainnya'];

// Custom tooltip for pie chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-xl">
        <p className="font-bold text-gray-800 text-sm">{payload[0].name}</p>
        <p className="text-sm text-gray-500">{payload[0].value} <span className="text-xs">pts</span></p>
      </div>
    );
  }
  return null;
};

// Custom label for pie chart
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.04) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      style={{ fontSize: 12, fontWeight: 700, textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

// ------------- Main Component -------------
const Dashboard = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMajor, setExpandedMajor] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/check-auth", {
          credentials: "include",
        });
        if (!response.ok) {
          navigate("/login");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        navigate("/login");
      }
    };

    const fetchData = async () => {
      const { data, error } = await supabase
        .from('hasil_survei')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setAllData(data || []);
      setLoading(false);
    };

    checkAuth().then(() => fetchData());
  }, [navigate]);

  // Group by jurusan
  const grouped = {};
  allData.forEach((row) => {
    const key = row.jurusan_siswa || 'Lainnya';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(row);
  });

  // Sort by defined order, unknown at end
  const sortedMajors = [
    ...JURUSAN_ORDER.filter((j) => grouped[j]),
    ...Object.keys(grouped).filter((j) => !JURUSAN_ORDER.includes(j)),
  ];

  const getMatchPercent = (majorKey, students) => {
    const matchCategories = MATCH_MAP[majorKey];
    if (!matchCategories) return null; // SMA IPA/IPS & Lainnya
    const matched = students.filter((s) => matchCategories.includes(s.hasil_jurusan)).length;
    return students.length > 0 ? Math.round((matched / students.length) * 100) : 0;
  };

  // Pie data from skor_detail
  const getPieData = (skorDetail) => {
    if (!skorDetail) return [];
    return Object.entries(skorDetail).map(([key, val]) => ({
      name: CATEGORY_NAMES[key] || key,
      value: val,
      id: key,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0faf5] via-white to-[#e8f5e9] pt-[100px] pb-24 font-['Poppins']">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
            Dashboard <span className="text-[#01ae5a]">Survei</span>
          </h1>
          <p className="text-gray-500 text-lg">
            Data hasil survei minat siswa
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-2xl font-bold text-[#01ae5a] animate-pulse">Memuat data…</p>
          </div>
        ) : sortedMajors.length === 0 ? (
          <div className="text-center text-gray-400 text-xl mt-24">Belum ada data survei.</div>
        ) : (
          <div className="space-y-4">
            {sortedMajors.map((major) => {
              const students = grouped[major];
              const matchPct = getMatchPercent(major, students);
              const isExpanded = expandedMajor === major;

              return (
                <div key={major} className="rounded-2xl overflow-hidden shadow-md border border-gray-100">
                  {/* Major Header Row */}
                  <button
                    className={`w-full flex items-center justify-between px-6 py-5 text-left transition-all duration-300
                      ${isExpanded ? 'bg-[#004825] text-white' : 'bg-white hover:bg-[#f0faf5] text-gray-800'}`}
                    onClick={() => setExpandedMajor(isExpanded ? null : major)}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-xl md:text-2xl font-black ${isExpanded ? 'text-white' : 'text-[#004825]'}`}>
                        {major}
                      </span>
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${isExpanded ? 'bg-white/20 text-white' : 'bg-[#e6f5ed] text-[#01ae5a]'}`}>
                        {students.length} siswa
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Match percentage badge */}
                      {matchPct !== null && (
                        <div className={`text-right ${isExpanded ? 'text-white' : 'text-gray-700'}`}>
                          <div className="text-xs font-medium opacity-70">Siswa Cocok</div>
                          <div className="text-2xl font-black leading-tight">
                            {matchPct}%
                          </div>
                          {/* Progress bar */}
                          <div className={`w-28 h-1.5 rounded-full mt-1 ${isExpanded ? 'bg-white/30' : 'bg-gray-200'}`}>
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${isExpanded ? 'bg-[#b7ffdc]' : 'bg-[#01ae5a]'}`}
                              style={{ width: `${matchPct}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <svg
                        className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-white' : 'text-gray-400'}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Student List */}
                  {isExpanded && (
                    <div className="border-t border-[#004825]/20 bg-white">
                      {students.length === 0 ? (
                        <p className="px-6 py-4 text-gray-400">Tidak ada data siswa.</p>
                      ) : (
                        students.map((student, idx) => {
                          const displayName = student.nama_siswa && student.nama_siswa.trim() !== ''
                            ? student.nama_siswa
                            : 'Anonim';
                          return (
                            <button
                              key={student.id || idx}
                              onClick={() => setSelectedStudent(student)}
                              className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#f0faf5] transition-colors border-b border-gray-100 last:border-b-0 group text-left"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#01ae5a] to-[#004825] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                  {displayName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800 group-hover:text-[#004825] transition-colors">
                                    {displayName}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {student.kelas_siswa && student.kelas_siswa !== '-' ? student.kelas_siswa : 'Kelas tidak diisi'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#e6f5ed] text-[#01ae5a]">
                                  {student.hasil_jurusan || '-'}
                                </span>
                                <svg className="w-4 h-4 text-gray-300 group-hover:text-[#01ae5a] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* STUDENT DETAIL MODAL */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedStudent(null); }}
        >
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] animate-pop-up">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#004825] to-[#01ae5a] px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-white font-black text-2xl">
                  {selectedStudent.nama_siswa?.trim() || 'Anonim'}
                </h2>
                <p className="text-white/70 text-sm mt-0.5">
                  {selectedStudent.kelas_siswa && selectedStudent.kelas_siswa !== '-'
                    ? selectedStudent.kelas_siswa
                    : 'Kelas tidak diisi'} · {selectedStudent.jurusan_siswa || '-'}
                </p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-8 py-7">
              {/* Result prominent badge */}
              <div className="mb-6 text-center">
                <p className="text-sm text-gray-400 font-medium mb-1">Hasil Dominan</p>
                <span className="inline-block bg-[#e6f5ed] text-[#004825] font-black text-xl px-6 py-2 rounded-full border-2 border-[#01ae5a]/30">
                  {selectedStudent.hasil_jurusan || '-'}
                </span>
              </div>

              {/* Pie Chart */}
              {selectedStudent.skor_detail && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">Distribusi Skor Minat</h3>
                  <ResponsiveContainer width="100%" height={380}>
                    <PieChart>
                      <Pie
                        data={getPieData(selectedStudent.skor_detail)}
                        cx="50%"
                        cy="40%"
                        outerRadius={100}
                        dataKey="value"
                        labelLine={false}
                        label={renderCustomLabel}
                      >
                        {getPieData(selectedStudent.skor_detail).map((entry) => (
                          <Cell key={entry.id} fill={CATEGORY_COLORS[entry.id] || '#aaa'} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        content={({ payload }) => (
                          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-1 px-2">
                            {payload.map((entry, index) => (
                              <div key={`item-${index}`} className="flex items-center gap-1.5">
                                <div 
                                  className="w-3 h-3 rounded-[3px] flex-shrink-0" 
                                  style={{ backgroundColor: entry.color }} 
                                />
                                <span className="text-[11px] sm:text-xs text-gray-600 font-medium whitespace-nowrap">
                                  {entry.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Score Cards */}
              {selectedStudent.skor_detail && (
                <div>
                  <h3 className="text-lg font-bold text-gray-700 mb-4">Rincian Skor</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(selectedStudent.skor_detail)
                      .sort(([, a], [, b]) => b - a)
                      .map(([key, val]) => {
                        const isDominant = selectedStudent.hasil_jurusan === CATEGORY_NAMES[key];
                        return (
                          <div
                            key={key}
                            className={`rounded-2xl p-4 border-2 transition-all ${
                              isDominant
                                ? 'border-[#01ae5a] bg-[#f0faf5] shadow-md'
                                : 'border-gray-100 bg-gray-50'
                            }`}
                          >
                            <div
                              className="w-3 h-3 rounded-full mb-2"
                              style={{ backgroundColor: CATEGORY_COLORS[key] || '#aaa' }}
                            />
                            <p className="text-xs text-gray-500 font-medium leading-snug mb-1">
                              {CATEGORY_NAMES[key] || key}
                            </p>
                            <p className={`text-2xl font-black ${isDominant ? 'text-[#01ae5a]' : 'text-gray-700'}`}>
                              {val}
                              <span className="text-xs font-normal text-gray-400 ml-1">pts</span>
                            </p>
                            {isDominant && (
                              <span className="text-[10px] font-bold text-[#01ae5a] uppercase tracking-wide">Dominan</span>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
