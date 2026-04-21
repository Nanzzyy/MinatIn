import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const navLinks = [
    { name: 'Home', id: 'home', path: '/' },
    { name: 'Survei', id: 'survei', path: '/#survei' },
    { name: 'Daftar Kampus', id: 'kampus', path: '/daftar-kampus' },
    { name: 'Tentang Kami', id: 'tentang', path: '/#tentang' },
  ];

  return (
    <footer className="bg-[#1d1d1d] py-20 text-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <span className="text-4xl font-bold">Minat</span>
              <span className="bg-[#00793e] px-3 py-1 rounded-lg font-bold text-3xl">in</span>
            </div>
            <p className="text-xl font-light opacity-70 max-w-xl">
              Platform digital yang didedikasikan untuk membantu masa depan pendidikan generasi muda Indonesia. Dibangun dengan cinta oleh 6xKu.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-2xl mb-8">Navigasi</h4>
            <ul className="flex flex-col gap-4 text-xl font-light">
              {navLinks.map(link => (
                <li key={link.id}>
                  <Link to={link.path} className="hover:text-[#01ae5a] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-white/10 text-center opacity-40">
          <p>@2026 MinatIn Platform. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
