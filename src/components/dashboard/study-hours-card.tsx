import { Card, CardContent } from "@/components/ui/card";
import { BarChart } from "lucide-react";
import { motion } from "framer-motion";

export default function StudyHoursCard() {
  const studyData = [
    { day: "Mon", hours: 8, percentage: 80 },
    { day: "Tue", hours: 6, percentage: 60 },
    { day: "Wed", hours: 9, percentage: 90 },
    { day: "Thu", hours: 7, percentage: 70 },
  ];

  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.3 }}>
      <Card className="neumorphic hover:shadow-soft-hover transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800" data-testid="text-study-hours-title">
              Study Hours
            </h3>
            <BarChart className="text-soft-orange" />
          </div>
          <div className="space-y-2">
            {studyData.map((item, index) => (
              <motion.div
                key={item.day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600">{item.day}</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-soft-orange h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4" data-testid="text-total-hours">
            32 hours this week
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
