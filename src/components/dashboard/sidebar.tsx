import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { BarChart3, MessageCircle, FileText, Calendar, Users, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar() {
  const [location] = useLocation();

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
    { icon: MessageCircle, label: "Chat", path: "/chat" },
    { icon: FileText, label: "Notes", path: "/notes" },
    { icon: Calendar, label: "Planner", path: "/planner" },
    { icon: Users, label: "Forum", path: "/forum" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <div className="hidden lg:block w-64 bg-white shadow-soft">
      <div className="p-6">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <motion.div
                whileHover={{ x: 4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="ghost"
                  className={`w-full justify-start px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-sage-green/10 text-sage-green"
                      : "hover:bg-sage-green/10 hover:text-sage-green"
                  }`}
                  data-testid={`button-sidebar-${item.label.toLowerCase()}`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
