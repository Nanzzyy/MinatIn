import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const Home = () => {
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gradients
  const heroGradient = "linear-gradient(63.98deg, rgb(1, 174, 90) 53.17%, rgb(1, 172, 89) 72.56%, rgb(0, 72, 37) 102.3%)";
  const kampusGradient = "linear-gradient(-41.18deg, rgb(14, 184, 102) 54.54%, rgb(0, 105, 54) 100%)";

  useEffect(() => {
    // Initialize AOS
    if (window.AOS) {
      window.AOS.init({ duration: 1000, once: true, offset: 100 });
      window.AOS.refresh();
    }

    // Fetch Campus Data
    const fetchCampuses = async () => {
      try {
        const { data, error } = await supabase.from('kampus').select('*').limit(8);
        if (error) throw error;
        setCampuses(data || []);
      } catch (e) {
        console.error("Error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCampuses();
  }, []);

  return (
    <div>
      {/* HERO SECTION */}
      <header id="home" className="relative h-screen max-h-[800px] w-full flex flex-col overflow-hidden bg-gradient-hero" style={{ backgroundImage: heroGradient }}>
        <div className="absolute left-0 bottom-0 w-full sm:w-[60%] lg:w-[45%] pointer-events-none z-0 overflow-hidden" style={{ height: '400px' }}>
          <svg viewBox="0 0 500 400" fill="none" className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="xMinYMax slice">
            <path d="M0 400L0 150C80 150 150 250 250 300C350 350 450 380 500 380L500 400Z" fill="#01ae5a" />
            <path d="M0 400L0 250C100 250 150 300 250 350C320 380 400 400 500 400Z" fill="#b7ffdc" fillOpacity="0.7"/>
          </svg>
        </div>

        <div className="px-6 lg:px-24 flex-grow flex items-center relative z-10 pt-[100px]">
          <div className="w-full lg:pr-[35%]" data-aos="fade-right">
            <h1 className="font-black text-white leading-tight mb-8 text-[40px] md:text-[64px]">
              Bingung mau kuliah dimana ?<br />
              Yuk coba ikuti survei<br />
              <span className="flex items-center gap-4 mt-2">
                bersama
                <img src="/Img/Logo MinatIn Hero.svg" alt="MinatIn" className="h-[60px] md:h-[90px] animate-pulse" />
              </span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="bg-[#00793e] text-white px-10 py-4 rounded-full font-bold text-2xl border-2 border-[#00793e] hover:bg-[#004825] transition-all shadow-xl hover:scale-105">
                Ikut Survei &rarr;
              </button>
              <Link to="/daftar-kampus" className="inline-block bg-transparent text-white px-10 py-4 rounded-full font-bold text-2xl border-2 border-white hover:bg-white/10 transition-all text-center shadow-xl hover:scale-105">
                Jelajahi Kampus &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex absolute bottom-0 right-0 w-[45%] max-w-[650px] justify-end items-end z-10 pointer-events-none" data-aos="fade-left">
          <img src="/Img/Hero-Girl.svg" alt="Hero Girl" className="w-full h-full object-right-bottom object-contain scale-x-[-1] animate-float" />
        </div>
      </header>

      {/* SURVEI SECTION */}
      <section id="survei" className="py-24 bg-white relative overflow-hidden shadow-[0_-15px_30px_rgba(0,0,0,0.1)]">
        <div className="absolute left-0 top-0 w-full lg:w-[60%] h-full pointer-events-none z-0">
          <svg viewBox="0 0 600 800" fill="none" className="absolute top-0 left-[-100px] w-full h-full" preserveAspectRatio="none">
            <path d="M-100 0C50 0 150 200 200 400C250 600 350 700 600 800L-100 800Z" fill="#b7ffdc" fillOpacity="0.2"/>
            <path d="M-100 0C100 -50 250 150 300 350C350 550 450 750 600 800L-100 800Z" fill="#01ae5a" fillOpacity="0.05"/>
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10 flex justify-end">
          <div className="w-full lg:w-[55%] flex flex-col md:pl-10" data-aos="fade-left">
            <h2 className="text-4xl md:text-5xl font-black mb-12">
              Tata Cara <span className="text-main-green">Mengisi Survei !</span>
            </h2>

            <div className="relative mb-12">
              <div className="absolute left-[30px] top-[30px] bottom-[30px] w-0 border-l-4 border-dashed border-gray-300" />
              <div className="flex flex-col gap-10">
                {[
                  { id: 1, text: <>Klik Tombol "<span className="font-semibold text-dark-green">Masuk Survei</span>"</> },
                  { id: 2, text: "Masukkan Jurusan SMK" },
                  { id: 3, text: <>Masukkan nama <span className="font-bold text-dark-green">(opsional)</span></> },
                  { id: 4, text: "Jawab pertanyaan dengan jujur" },
                ].map((step) => (
                  <div key={step.id} className="flex items-center gap-6 relative z-10" data-aos="fade-up">
                    <div className="w-[60px] h-[60px] bg-dark-green rounded-full flex items-center justify-center shadow-xl">
                      <span className="text-white text-3xl font-black">{step.id}</span>
                    </div>
                    <p className="text-2xl font-light text-black">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/survei" className="bg-dark-green hover:bg-main-green text-white px-8 py-3 rounded-2xl font-bold text-xl transition-all shadow-xl hover:-translate-y-1">
                Masuk Survei &rarr;
              </Link>
              <Link to="/daftar-kampus" className="border-[5px] border-light-green text-light-green hover:bg-light-green hover:text-white px-8 py-3 rounded-2xl font-bold text-xl transition-all shadow-xl text-center hover:-translate-y-1">
                Jelajahi Kampus &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex absolute bottom-0 left-0 w-[45%] max-w-[550px] justify-start items-end z-0" data-aos="fade-right">
          <div className="absolute top-[-80px] right-[25%] animate-bounce">
            <img src="https://www.figma.com/api/mcp/asset/769fc295-0534-479e-8ba3-b5068e221333" className="w-[120px] -rotate-12" alt="Light" />
          </div>
          <img src="https://www.figma.com/api/mcp/asset/74745e95-c41a-446b-b936-7f81074d9b20" className="w-full scale-x-[-1] drop-shadow-2xl" alt="Idea" />
        </div>
      </section>

      {/* CAMPUS CAROUSEL */}
      <section id="kampus" className="py-24 relative overflow-hidden" style={{ backgroundImage: kampusGradient }}>
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg viewBox="0 0 1440 600" fill="none" className="absolute w-full h-full top-0 left-0" preserveAspectRatio="none">
            <path d="M1440 100C1000 300 800 -100 0 300L0 600L1440 600Z" fill="white" fillOpacity="0.05"/>
            <path d="M1440 250C1200 400 900 100 0 500L0 0L1440 0Z" fill="black" fillOpacity="0.05"/>
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg" data-aos="fade-right">
              Rekomendasi <br /> Kampus Favorit
            </h2>
            <Link to="/daftar-kampus" className="text-2xl text-white hover:text-[#b7ffdc] transition-all flex items-center group" data-aos="fade-left">
              Eksplorasi Lagi <span className="ml-2 group-hover:translate-x-2 transition-transform">&rarr;</span>
            </Link>
          </div>

          <div className="w-full" data-aos="zoom-in">
            {loading ? (
              <div className="h-[400px] flex items-center justify-center"><p className="text-white text-3xl font-bold animate-pulse">Loading...</p></div>
            ) : (
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={'auto'}
                autoplay={{ delay: 3000 }}
                pagination={{ clickable: true }}
                className="kampus-swiper !pb-16"
              >
                {campuses.map((campus) => (
                  <SwiperSlide key={campus.id_kampus} className="!w-auto">
                    <div className="bg-white w-[300px] md:w-[340px] rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] group overflow-hidden">
                      <div className="h-[200px] md:h-[220px] overflow-hidden relative">
                        <img 
                          src="https://www.figma.com/api/mcp/asset/94abba19-fb26-4353-9543-4c7768aaca20" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          alt={campus.nama_kampus} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>

                      <div className="p-5 flex flex-col gap-3">
                        <h3 className="font-bold text-[18px] md:text-[20px] text-[#004825] leading-tight line-clamp-2">
                          {campus.nama_kampus}
                        </h3>

                        {campus.lokasi && (
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-[#01ae5a] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-gray-500 font-medium truncate">{campus.lokasi}</span>
                          </div>
                        )}

                        {campus.keterangan && (
                          <p className="text-[13px] text-gray-400 leading-relaxed line-clamp-2">{campus.keterangan}</p>
                        )}

                        <a 
                          href={campus.website_kampus || "#"} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="mt-1 flex items-center justify-center gap-2 bg-[#004825] hover:bg-[#01ae5a] text-white py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 group/btn"
                        >
                          <span>Kunjungi Website</span>
                          <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </section>

      {/* TENTANG KAMI SECTION */}
      <section id="tentang" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute left-0 top-0 w-full lg:w-[60%] h-full pointer-events-none z-0 opacity-10">
          <svg viewBox="0 0 800 600" fill="none" className="absolute top-0 left-[-150px] w-full h-[120%]" preserveAspectRatio="none">
            <path d="M0 600C200 600 350 400 450 100C550 0 700 0 800 0L0 0Z" fill="#01ae5a" />
            <path d="M0 600C150 450 250 200 300 0L0 0Z" fill="#b7ffdc" />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-[60%] bg-white border-2 border-black rounded-[30px] p-10 md:p-16 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]" data-aos="zoom-in">
            <h2 className="text-4xl md:text-5xl font-black text-dark-green mb-8">Tentang Kami</h2>
            <p className="text-xl md:text-2xl font-light text-dark-green leading-relaxed text-justify">
              <span className="font-bold text-3xl">MinatIn </span>
              adalah platform digital inovatif yang dibangun oleh <span className="font-bold italic text-[#01ae5a]">6xKu</span> pada tahun 2026. 
              Misi kami adalah membantu siswa SMK/SMA menemukan jalan masa depan mereka dengan mencocokkan minat, bakat, dan karakter melalui survei psikologis yang akurat. 
              <br /><br />
              Hanya dengan beberapa menit pengisian, kamu akan mendapatkan rekomendasi perguruan tinggi dan jurusan yang paling pas dengan potensi unikmu.
            </p>
          </div>
          
          <div className="hidden lg:block w-[400px] h-[450px] bg-gradient-to-br from-light-mint to-white rounded-[40px] shadow-2xl relative overflow-hidden" data-aos="fade-left">
            <img src="https://www.figma.com/api/mcp/asset/ef61d72d-b3e8-4101-a67d-de828007a597" className="w-full h-full object-cover" alt="MinatIn Team" />
            <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-all" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
