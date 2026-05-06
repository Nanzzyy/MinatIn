import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (isHome) {
        const sections = ["home", "survei", "kampus", "tentang"];
        const currentSection = sections.find((section) => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 150 && rect.bottom >= 150;
          }
          return false;
        });
        if (currentSection) setActiveSection(currentSection);
      } else {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/check-auth`, {
          credentials: "include",
        });
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, [location]);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/logout`, {
        method: "POST",
        credentials: "include",
      });
      setIsLoggedIn(false);
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = [
    { name: "Home", id: "home", path: "/#home" },
    { name: "Survei", id: "survei", path: "/#survei" },
    { name: "Daftar Kampus", id: "kampus", path: "/daftar-kampus" },
    { name: "Tentang Kami", id: "tentang", path: "/#tentang" },
  ];

  const handleNavClick = (e, path, id) => {
    if (isHome && path.startsWith("/#")) {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const isLinkActive = (link) =>
    activeSection === link.id || (location.pathname === link.path && link.path !== "/");

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          scrolled || !isHome ? "nav-scrolled bg-white shadow-md py-3" : "pt-6 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-0 group">
            <img src="/Img/Logo MinatIn.svg" alt="MinatIn Logo" className="h-[52px] sm:h-[70px]" />
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-[40px]">
            {navLinks.map((link) => (
              <li key={link.id} className="relative flex flex-col items-center">
                <Link
                  to={link.path}
                  onClick={(e) => handleNavClick(e, link.path, link.id)}
                  className={`text-[22px] font-medium transition-all duration-300 hover:text-green-500 ${
                    isLinkActive(link)
                      ? scrolled || !isHome
                        ? "text-[#01ae5a] font-bold"
                        : "text-white font-bold"
                      : scrolled || !isHome
                      ? "text-[#004825]"
                      : "text-white"
                  }`}
                >
                  {link.name}
                </Link>
                <AnimatePresence>
                  {isLinkActive(link) && (
                    <motion.div
                      layoutId="nav-underline"
                      className={`h-[4px] rounded-full mt-1 ${scrolled || !isHome ? "bg-[#01ae5a]" : "bg-white"}`}
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      exit={{ width: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>

          {/* Desktop Auth Button */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-500 hover:scale-110 shadow-sm ${
                      scrolled || !isHome ? "bg-black/5" : "bg-white/20"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="black" viewBox="0 0 16 16"
                      style={{ fill: scrolled || !isHome ? "#000" : "#fff", transition: "fill 0.5s ease" }}
                    >
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                    </svg>
                  </button>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 overflow-hidden z-[110]"
                      >
                        <div className="px-6 py-3 border-b border-gray-50 mb-1">
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Account</p>
                        </div>
                        <Link
                          to="/dashboard"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-6 py-3 text-gray-700 hover:bg-[#f0faf5] hover:text-[#01ae5a] font-medium transition-colors"
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-6 py-3 text-red-500 hover:bg-red-50 font-medium transition-colors"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  to="/login"
                  className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-500 hover:scale-110 ${
                    scrolled || !isHome ? "bg-black/5" : "bg-white/30"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="black" viewBox="0 0 16 16"
                    style={{ fill: scrolled || !isHome ? "#000" : "#fff", transition: "fill 0.5s ease" }}
                  >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Right: Auth Icon + Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Mobile Auth Icon */}
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${
                  scrolled || !isHome ? "bg-black/5" : "bg-white/20"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"
                  style={{ fill: scrolled || !isHome ? "#000" : "#fff" }}
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                </svg>
              </Link>
            ) : (
              <Link
                to="/login"
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${
                  scrolled || !isHome ? "bg-black/5" : "bg-white/20"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"
                  style={{ fill: scrolled || !isHome ? "#000" : "#fff" }}
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                </svg>
              </Link>
            )}

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-xl transition-all ${
                scrolled || !isHome ? "bg-black/5" : "bg-white/20"
              }`}
              aria-label="Toggle menu"
            >
              <motion.span
                animate={isMobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`block w-5 h-0.5 rounded-full hamburger-line ${scrolled || !isHome ? "bg-[#004825]" : "bg-white"}`}
              />
              <motion.span
                animate={isMobileMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className={`block w-5 h-0.5 rounded-full hamburger-line ${scrolled || !isHome ? "bg-[#004825]" : "bg-white"}`}
              />
              <motion.span
                animate={isMobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`block w-5 h-0.5 rounded-full hamburger-line ${scrolled || !isHome ? "bg-[#004825]" : "bg-white"}`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[98] bg-black/50 backdrop-blur-sm lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-[75vw] max-w-[320px] z-[99] bg-white shadow-2xl flex flex-col lg:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <img src="/Img/Logo MinatIn.svg" alt="MinatIn Logo" className="h-[44px]" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex flex-col px-4 py-6 gap-1 flex-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.25 }}
                  >
                    <Link
                      to={link.path}
                      onClick={(e) => handleNavClick(e, link.path, link.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-base transition-all ${
                        isLinkActive(link)
                          ? "bg-[#f0faf5] text-[#01ae5a]"
                          : "text-[#004825] hover:bg-gray-50"
                      }`}
                    >
                      {isLinkActive(link) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#01ae5a] flex-shrink-0" />
                      )}
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Drawer Footer Auth */}
              <div className="px-6 py-6 border-t border-gray-100">
                {isLoggedIn ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-center py-3 bg-[#004825] hover:bg-[#01ae5a] text-white rounded-xl font-bold transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-center py-3 border-2 border-red-400 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center py-3 bg-[#004825] hover:bg-[#01ae5a] text-white rounded-xl font-bold transition-colors"
                  >
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
