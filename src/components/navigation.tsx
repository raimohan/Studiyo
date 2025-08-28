import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userData, logout } = useAuth();

  const isActive = (path: string) => location === path;

  const navItems = user ? [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Chat", path: "/chat" },
    { label: "Notes", path: "/notes" },
    ...(userData?.role === 'admin' ? [{ label: "Admin", path: "/admin" }] : []),
  ] : [
    { label: "Home", path: "/" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="glassmorphic fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" data-testid="link-home">
          <motion.div 
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img 
              src="https://i.postimg.cc/YqsVFhcC/Picsart-25-08-22-17-54-08-879.png" 
              alt="StudentHub Logo" 
              className="h-10 object-contain"
            />
          </motion.div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} data-testid={`link-${item.label.toLowerCase()}`}>
              <motion.button
                className={`text-gray-700 hover:text-sage-green transition-colors duration-200 ${
                  isActive(item.path) ? "text-sage-green font-semibold" : ""
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                {item.label}
              </motion.button>
            </Link>
          ))}
          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                    {userData?.profilePicture ? (
                      <img 
                        src={userData.profilePicture} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span className="text-xs text-gray-500">
                        {userData?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-700">Welcome, {userData?.displayName}</span>
                </div>
              </Link>
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="px-6 py-2 rounded-full shadow-soft hover:shadow-soft-hover transition-all duration-300"
                  data-testid="button-logout"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </motion.div>
            </div>
          ) : (
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link href="/auth">
                <Button 
                  className="gradient-pastel text-white px-6 py-2 rounded-full shadow-soft hover:shadow-soft-hover transition-all duration-300"
                  data-testid="button-login"
                >
                  Login
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-gray-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {isMobileMenuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
        </Button>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 overflow-hidden"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path} data-testid={`link-mobile-${item.label.toLowerCase()}`}>
                  <button 
                    className={`text-left text-gray-700 hover:text-sage-green transition-colors duration-200 ${
                      isActive(item.path) ? "text-sage-green font-semibold" : ""
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </button>
                </Link>
              ))}
              {user ? (
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="px-6 py-2 rounded-full text-left w-fit"
                  data-testid="button-mobile-logout"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <Link href="/auth">
                  <Button 
                    className="gradient-pastel text-white px-6 py-2 rounded-full text-left w-fit"
                    data-testid="button-mobile-login"
                  >
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
