import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, FileText, Calendar, Bot, ArrowRight, Twitter, Instagram, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Landing() {
  const features = [
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Connect instantly with classmates and study groups through our seamless messaging platform.",
      color: "sage-green",
    },
    {
      icon: FileText,
      title: "Notes Sharing",
      description: "Organize, share, and collaborate on study notes with intelligent categorization.",
      color: "soft-orange",
    },
    {
      icon: Calendar,
      title: "Study Planner",
      description: "Plan your study schedule with smart reminders and progress tracking.",
      color: "sage-green",
    },
    {
      icon: Bot,
      title: "AI Assistant",
      description: "Get instant help with assignments and study questions from our intelligent AI tutor.",
      color: "soft-orange",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6">
              Your All-in-One{" "}
              <span className="text-sage-green">Student Hub</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Streamline your academic journey with our comprehensive platform featuring real-time chat, smart notes sharing, study planning, and AI assistance.
            </p>
            <Link href="/dashboard">
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Button 
                  className="gradient-pastel text-white px-8 py-4 rounded-full text-lg font-semibold shadow-soft hover:shadow-soft-hover transition-all duration-300"
                  data-testid="button-get-started"
                >
                  Get Started Free <ArrowRight className="ml-2" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Students collaborating in study group" 
              className="rounded-3xl shadow-soft w-full"
            />
          </motion.div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Everything You Need to Succeed</h2>
          <p className="text-xl text-gray-600">Powerful features designed specifically for modern students</p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="neumorphic hover:shadow-soft-hover transition-all duration-300 h-full">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-${feature.color}/20 rounded-2xl flex items-center justify-center mb-6`}>
                    <feature.icon className={`text-${feature.color} text-2xl`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src="https://i.postimg.cc/R0QnkJ4S/Picsart-25-08-22-17-53-23-740.png" 
                  alt="StudentHub Logo" 
                  className="h-8 object-contain"
                />
              </div>
              <p className="text-gray-600">Empowering students with the tools they need to succeed in their academic journey.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-sage-green transition-colors" data-testid="link-features">Features</a></li>
                <li><a href="#" className="hover:text-sage-green transition-colors" data-testid="link-pricing">Pricing</a></li>
                <li><a href="#" className="hover:text-sage-green transition-colors" data-testid="link-support">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-sage-green transition-colors" data-testid="link-about">About</a></li>
                <li><a href="#" className="hover:text-sage-green transition-colors" data-testid="link-careers">Careers</a></li>
                <li><a href="#" className="hover:text-sage-green transition-colors" data-testid="link-contact">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <motion.a 
                  href="#" 
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-sage-green hover:text-white transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  data-testid="link-twitter"
                >
                  <Twitter />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-sage-green hover:text-white transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  data-testid="link-instagram"
                >
                  <Instagram />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-sage-green hover:text-white transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  data-testid="link-linkedin"
                >
                  <Linkedin />
                </motion.a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 StudentHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
