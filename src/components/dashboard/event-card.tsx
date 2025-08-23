import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function EventCard() {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.3 }}>
      <Card className="gradient-pastel text-white neumorphic hover:shadow-soft-hover transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" data-testid="text-event-title">
              Featured Event
            </h3>
            <Star />
          </div>
          <h4 className="text-xl font-bold mb-2" data-testid="text-event-name">
            CS Workshop
          </h4>
          <p className="text-sm opacity-90 mb-3" data-testid="text-event-description">
            Advanced React Patterns
          </p>
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4" />
            <span data-testid="text-event-time">Today, 3:00 PM</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
