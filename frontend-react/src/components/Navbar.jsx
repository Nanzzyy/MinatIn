import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/check-auth", {
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
      await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsLoggedIn(false);
      setIsDropdownOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = [
    { name: "Home", id: "home", path: "/" },
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
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        scrolled || !isHome ? "nav-scrolled bg-white shadow-md py-4" : "pt-6 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-0 group">
          <span className={`text-3xl md:text-[36px] font-bold transition-colors ${scrolled || !isHome ? "text-black" : "text-black"}`}>
            Minat
          </span>
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
                  activeSection === link.id || (location.pathname === link.path && link.path !== "/")
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
                {(activeSection === link.id || (location.pathname === link.path && link.path !== "/")) && (
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

        <div className="hidden md:flex items-center gap-4">
          {/* <button
            className={`p-2 rounded-full transition-all duration-500 hover:scale-110 ${
              scrolled || !isHome ? "bg-black/5" : "bg-white/20"
            }`}
          >
            <img
              src="https://www.figma.com/api/mcp/asset/5c9ee8f5-a258-4cd3-9da2-722f38a30247"
              className="w-8 h-8"
              style={{ filter: scrolled || !isHome ? "brightness(0)" : "brightness(0) invert(1)", transition: "filter 0.5s ease" }}
              alt="Settings"
            />
          </button> */}

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
                    viewBox="0 0 24 24" 
                    className="w-6 h-6"
                    style={{ fill: scrolled || !isHome ? "#000" : "#fff", transition: "fill 0.5s ease" }}
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
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
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="black" class="bi bi-person" viewBox="0 0 16 16">
                   <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
