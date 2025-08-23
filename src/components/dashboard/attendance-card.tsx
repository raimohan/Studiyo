import { Card, CardContent } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import { motion } from "framer-motion";

export default function AttendanceCard() {
  const percentage = 85;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.3 }}>
      <Card className="neumorphic hover:shadow-soft-hover transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800" data-testid="text-attendance-title">
              Attendance
            </h3>
            <PieChart className="text-sage-green" />
          </div>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="var(--sage-green)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800" data-testid="text-attendance-percentage">
                  {percentage}%
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center">Great attendance this semester!</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
