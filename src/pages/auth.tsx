import { useState } from "react";
import { motion } from "framer-motion";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-pastel-beige flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <img 
            src="https://i.postimg.cc/R0QnkJ4S/Picsart-25-08-22-17-53-23-740.png" 
            alt="StudentHub Logo" 
            className="h-16 mx-auto mb-4 object-contain"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">StudentHub</h1>
          <p className="text-gray-600">Your comprehensive learning platform</p>
        </motion.div>

        {/* Auth Forms */}
        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}