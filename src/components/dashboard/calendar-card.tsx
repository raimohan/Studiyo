import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function CalendarCard() {
  const [selectedDate, setSelectedDate] = useState(15);
  
  const getDaysInMonth = () => {
    const days = [];
    for (let i = 1; i <= 28; i++) {
      days.push(i);
    }
    return days;
  };

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.3 }}>
      <Card className="neumorphic hover:shadow-soft-hover transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800" data-testid="text-calendar-title">
              Calendar
            </h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft className="text-gray-400 h-4 w-4" />
              </Button>
              <span className="text-sm font-medium" data-testid="text-calendar-month">
                December 2024
              </span>
              <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100 rounded">
                <ChevronRight className="text-gray-400 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {weekDays.map((day, index) => (
              <div key={index} className="p-2 text-gray-500 font-medium">
                {day}
              </div>
            ))}
            
            {/* Empty cells for month start */}
            <div className="p-2 text-gray-400">1</div>
            <div className="p-2 text-gray-400">2</div>
            <div className="p-2 text-gray-400">3</div>
            <div className="p-2 text-gray-400">4</div>
            <div className="p-2 text-gray-400">5</div>
            <div className="p-2 text-gray-400">6</div>
            <div className="p-2 text-gray-400">7</div>
            
            {getDaysInMonth().map((day) => (
              <motion.button
                key={day}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedDate(day)}
                className={`p-2 rounded cursor-pointer transition-all duration-200 ${
                  selectedDate === day
                    ? "bg-sage-green text-white"
                    : "hover:bg-sage-green hover:text-white"
                }`}
                data-testid={`button-calendar-day-${day}`}
              >
                {day}
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
