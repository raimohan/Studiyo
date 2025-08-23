import Sidebar from "@/components/dashboard/sidebar";
import AttendanceCard from "@/components/dashboard/attendance-card";
import EventCard from "@/components/dashboard/event-card";
import StudyHoursCard from "@/components/dashboard/study-hours-card";
import WebinarsCard from "@/components/dashboard/webinars-card";
import CalendarCard from "@/components/dashboard/calendar-card";
import AssignmentsCard from "@/components/dashboard/assignments-card";
import FeeStatusCard from "@/components/dashboard/fee-status-card";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { userData } = useAuth();
  
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
    <div className="pt-20 flex min-h-screen">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2" data-testid="text-welcome">
            Welcome back, {userData?.displayName || 'Student'}! 👋
          </h1>
          <p className="text-gray-600">Here's what's happening with your studies today.</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Top Row Cards */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6">
            <AttendanceCard />
            <EventCard />
            <StudyHoursCard />
          </motion.div>

          {/* Middle Row */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
            <WebinarsCard />
            <CalendarCard />
          </motion.div>

          {/* Bottom Row */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
            <AssignmentsCard />
            <FeeStatusCard />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
