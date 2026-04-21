import React, { useState } from 'react';
import { motion } from 'framer-motion';

import questionsData from '../../JSON/question.json';

const Survei = () => {
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleOptionChange = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(answers).length < questionsData.length) {
       setErrorMsg(`Harap jawab semua pertanyaan (${Object.keys(answers).length}/${questionsData.length})`);
       return;
    }
    
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/survei/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answers)
      });

      if (!response.ok) throw new Error("Gagal terhubung ke server");

      const data = await response.json();
      setResult(data);
      window.scrollTo(0, 0); // Scroll to top to see results
    } catch (error) {
      console.error(error);
      setErrorMsg("Terjadi kesalahan saat memproses data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSurvey = () => {
    setAnswers({});
    setResult(null);
    window.scrollTo(0, 0);
  };


  return (
    <main className="w-full bg-[#f8f9fa] min-h-screen pt-[120px] pb-24 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#01ae5a]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[#004825]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Survei <span className="text-[#01ae5a]">Minat</span>
          </h1>
          <p className="text-gray-500 text-lg">Pilih jawaban yang paling sesuai dengan diri Anda.</p>
        </motion.div>

        {result ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-[24px] p-8 md:p-12 shadow-xl border border-gray-100"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Hasil Analisis Minat & Bakat</h2>
              <p className="text-gray-500">Berdasarkan jawaban survei Anda.</p>
            </div>
            
            <div className="bg-[#f0f9f4] border border-[#01ae5a]/20 rounded-2xl p-8 mb-10 text-center">
              <h3 className="text-xl font-medium text-gray-600 mb-2">Bidang Paling Mendominasi:</h3>
              <div className="text-4xl font-black text-[#01ae5a]">{result.dominan}</div>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Distribusi Nilai:</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(result.skor || {}).map(([cat, score]) => (
                  <div key={cat} className={`p-4 rounded-xl text-center border ${cat === result.dominan_id ? 'border-[#01ae5a] bg-green-50 shadow-md' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="text-sm text-gray-500 font-medium mb-1">{cat}</div>
                    <div className={`text-2xl font-bold ${cat === result.dominan_id ? 'text-[#01ae5a]' : 'text-gray-800'}`}>{score} Points</div>
                  </div>
                ))}
              </div>
            </div>

            {result.rekomendasi_kampus && result.rekomendasi_kampus.length > 0 && (
              <div>
                 <h3 className="text-2xl font-bold text-gray-900 mb-6">Rekomendasi Kampus:</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {result.rekomendasi_kampus.map((campus, idx) => (
                       <motion.div 
                         key={campus.id_kampus || idx}
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: idx * 0.1 }}
                         className="flex flex-col border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
                       >
                          <div className="h-40 overflow-hidden relative bg-gray-200">
                             <img src={"https://www.figma.com/api/mcp/asset/94abba19-fb26-4353-9543-4c7768aaca20"} className="w-full h-full object-cover" alt="Campus"/>
                          </div>
                          <div className="p-5 flex flex-col gap-2 bg-white flex-1">
                             <h4 className="font-bold text-lg text-gray-900 line-clamp-1">{campus.nama_kampus}</h4>
                             <p className="text-sm text-gray-500 line-clamp-2">{campus.keterangan}</p>
                             <a 
                               href={campus.website_kampus || "#"} 
                               target="_blank" rel="noreferrer"
                               className="mt-auto inline-block text-center w-full py-2 bg-[#004825] hover:bg-[#01ae5a] text-white rounded-lg font-medium text-sm transition-colors"
                             >
                               Lihat Website
                             </a>
                          </div>
                       </motion.div>
                    ))}
                 </div>
              </div>
            )}

            <div className="mt-10 flex justify-center">
               <button onClick={resetSurvey} className="px-6 py-3 border-2 border-[#004825] text-[#004825] hover:bg-[#004825] hover:text-white rounded-xl font-bold transition-all">
                 Isi Ulang Survei
               </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {questionsData.map((q, qIndex) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (qIndex % 5) * 0.1 }}
                  className="bg-[#e4e4e4] rounded-[24px] p-8 md:p-10 shadow-sm"
                >
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6 font-['Poppins']">
                    {qIndex + 1}. {q.pertanyaan}
                  </h3>
                  
                  <div className="space-y-4">
                    {Object.entries(q.opsi).map(([optionKey, optionData]) => {
                      const isSelected = answers[q.id] === optionKey;
                      return (
                        <label 
                          key={optionKey}
                          className={`flex items-center gap-4 cursor-pointer transition-all duration-300 group`}
                          onClick={() => handleOptionChange(q.id, optionKey)}
                        >
                          <div className={`w-[22px] h-[22px] rounded-full border-[2px] flex items-center justify-center transition-colors flex-shrink-0 ${
                            isSelected ? 'border-[#01ae5a] bg-white' : 'border-gray-500 bg-transparent group-hover:border-gray-700'
                          }`}>
                            {isSelected && (
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-[10px] h-[10px] rounded-full bg-[#01ae5a]"
                              />
                            )}
                          </div>
                          <span className={`text-[15px] transition-colors font-medium font-['Poppins'] leading-relaxed ${
                            isSelected ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'
                          }`}>
                            {optionData.teks}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
        

            {errorMsg && (
              <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-xl font-medium text-center animate-pulse">
                {errorMsg}
              </div>
            )}

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-12 flex justify-end"
            >
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#004825] hover:bg-[#01ae5a] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-[0_10px_30px_rgba(1,174,90,0.3)] hover:-translate-y-1 flex items-center gap-3"
              >
                {isSubmitting ? 'Memproses...' : 'Selesai & Kirim'}
              </button>
            </motion.div>
          </form>
        )}
      </div>
    </main>
  );
};

export default Survei;