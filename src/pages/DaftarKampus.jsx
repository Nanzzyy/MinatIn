import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { motion } from 'framer-motion';

const DaftarKampus = () => {
  const [campuses, setCampuses] = useState([]);
  const [filteredCampuses, setFilteredCampuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Initialize AOS
    if (window.AOS) {
      window.AOS.init({ duration: 800, once: true, offset: 100 });
      window.AOS.refresh();
    }

    const fetchAllCampuses = async () => {
      try {
        const { data, error } = await supabase.from('kampus').select('*').order('nama_kampus', { ascending: true });
        if (error) throw error;
        setCampuses(data || []);
        setFilteredCampuses(data || []);
      } catch (e) {
        console.error("Error fetching campuses:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCampuses();
    
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  // Real-time filtering logic
  useEffect(() => {
    const results = campuses.filter(campus =>
      campus.nama_kampus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (campus.lokasi && campus.lokasi.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCampuses(results);
  }, [searchTerm, campuses]);

  return (
    <main className="w-full bg-[#0a0a0a] min-h-screen pt-[120px] pb-24 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#01ae5a]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#004825]/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-[1200px] relative z-10">
        
        {/* Title Area */}
        <div className="flex flex-col mb-16 text-center" data-aos="fade-up">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            Daftar Kampus <span className="text-[#01ae5a]">Pilihan Terbaik</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto">
            Temukan berbagai kampus terbaik yang telah kami kurasi khusus untuk membantu menentukan masa depan Anda.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-16 w-full max-w-4xl mx-auto bg-[#1a1a1a] p-3 rounded-2xl shadow-2xl border border-white/10 gap-4" data-aos="fade-up" data-aos-delay="50">
           <div className="flex flex-1 items-center px-4">
              <svg className="w-6 h-6 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Cari nama kampus atau lokasi..." 
                className="w-full bg-transparent border-none text-white px-4 py-2 focus:outline-none placeholder-gray-500 font-light text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="px-6 py-2 bg-[#004825] text-[#b7ffdc] rounded-xl font-semibold text-sm">
             {filteredCampuses.length} Kampus Ditemukan
           </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 border-4 border-[#01ae5a] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white text-xl font-medium animate-pulse">Memuat data kampus...</p>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {filteredCampuses.map((campus, index) => (
                <div 
                  key={campus.id_kampus}
                  className="campus-card bg-[#1e1e2a] w-full rounded-[24px] border border-white/[0.06] shadow-xl transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_20px_60px_rgba(1,174,90,0.2)] hover:border-[#01ae5a]/30 group overflow-hidden" 
                  data-aos="fade-up" 
                  data-aos-delay={100 + (index % 3) * 50}
                >
                    <div className="w-full h-[220px] overflow-hidden relative">
                        <img 
                          src="https://www.figma.com/api/mcp/asset/94abba19-fb26-4353-9543-4c7768aaca20" 
                          alt={campus.nama_kampus} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e2a] via-transparent to-transparent opacity-80" />
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                        <h3 className="font-bold text-xl md:text-2xl text-white leading-tight group-hover:text-[#01ae5a] transition-colors line-clamp-2">
                          {campus.nama_kampus}
                        </h3>
                        
                        {campus.lokasi && (
                          <div className="flex items-center gap-2">
                              <svg className="w-5 h-5 text-[#01ae5a] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                              </svg>
                              <span className="text-sm text-gray-400 font-medium truncate">{campus.lokasi}</span>
                          </div>
                        )}
                        
                        {campus.keterangan && (
                          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                            {campus.keterangan}
                          </p>
                        )}
                        
                        <a 
                          href={campus.website_kampus || "#"} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-2 flex items-center justify-center gap-2 bg-[#004825] hover:bg-[#01ae5a] text-white py-3 rounded-xl font-bold text-base transition-all duration-300 group/btn shadow-lg"
                        >
                            <span>Kunjungi Website</span>
                            <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                            </svg>
                        </a>
                    </div>
                </div>
              ))}
            </div>

            {filteredCampuses.length === 0 && (
              <div className="text-center py-24" data-aos="fade-up">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">Kampus tidak ditemukan</h3>
                <p className="text-gray-500">Coba gunakan kata kunci pencarian yang lain.</p>
              </div>
            )}
          </>
        )}
        
      </div>
    </main>
  );
};

export default DaftarKampus;
