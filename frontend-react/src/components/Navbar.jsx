import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (isHome) {
        const sections = ['home', 'survei', 'kampus', 'tentang'];
        const currentSection = sections.find(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            // Offset for activation
            return rect.top <= 150 && rect.bottom >= 150;
          }
          return false;
        });
        if (currentSection) setActiveSection(currentSection);
      } else {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const navLinks = [
    { name: 'Home', id: 'home', path: '/' },
    { name: 'Survei', id: 'survei', path: '/#survei' },
    { name: 'Daftar Kampus', id: 'kampus', path: '/daftar-kampus' },
    { name: 'Tentang Kami', id: 'tentang', path: '/#tentang' },
  ];

  const handleNavClick = (e, path, id) => {
    if (isHome && path.startsWith('/#')) {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled || !isHome ? 'nav-scrolled bg-white shadow-md py-4' : 'pt-6 bg-transparent'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-0 group">
          <span className={`text-3xl md:text-[36px] font-bold transition-colors ${scrolled || !isHome ? 'text-black' : 'text-black'}`}>Minat</span>
          <span className="bg-[#00793e] flex items-center justify-center rounded-[6px] px-2 py-1 ml-1 shadow-lg group-hover:scale-110 transition-transform">
            <span className="font-bold text-[24px] md:text-[30px] text-white leading-none">in</span>
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-[40px]">
          {navLinks.map((link) => (
            <li key={link.id} className="relative flex flex-col items-center">
              <Link 
                to={link.path}
                onClick={(e) => handleNavClick(e, link.path, link.id)}
                className={`text-[22px] font-medium transition-all duration-300 hover:text-green-500 ${
                  (activeSection === link.id || (location.pathname === link.path && link.path !== '/'))
                    ? (scrolled || !isHome ? 'text-[#01ae5a] font-bold' : 'text-white font-bold') 
                    : (scrolled || !isHome ? 'text-[#004825]' : 'text-white')
                }`}
              >
                {link.name}
              </Link>
              <AnimatePresence>
                {(activeSection === link.id || (location.pathname === link.path && link.path !== '/')) && (
                  <motion.div 
                    layoutId="nav-underline"
                    className={`h-[4px] rounded-full mt-1 ${scrolled || !isHome ? 'bg-[#01ae5a]' : 'bg-white'}`}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <button className={`p-2 rounded-full transition-all duration-500 hover:scale-110 ${scrolled || !isHome ? 'bg-black/5' : 'bg-white/20'}`}>
            <img 
              src="https://www.figma.com/api/mcp/asset/5c9ee8f5-a258-4cd3-9da2-722f38a30247" 
              className="w-8 h-8"
              style={{ filter: scrolled || !isHome ? 'brightness(0)' : 'brightness(0) invert(1)', transition: 'filter 0.5s ease' }}
              alt="Settings" 
            />
          </button>
          <a href="/dashboard" className={`p-2 rounded-full transition-all duration-500 hover:scale-110 ${scrolled || !isHome ? 'bg-black/5' : 'bg-white/20'}`}>
            <img 
              src="https://www.figma.com/api/mcp/asset/371e68d0-a9f6-4623-b1ce-e2dbdac54a13" 
              className="w-8 h-8"
              style={{ filter: scrolled || !isHome ? 'brightness(0)' : 'brightness(0) invert(1)', transition: 'filter 0.5s ease' }}
              alt="User" 
            />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
