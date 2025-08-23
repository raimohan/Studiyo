import { Card, CardContent } from "@/components/ui/card";
import { Video } from "lucide-react";
import { motion } from "framer-motion";

export default function WebinarsCard() {
  const webinars = [
    {
      title: "Machine Learning Basics",
      description: "Introduction to AI concepts",
      time: "Tomorrow 2PM",
      color: "sage-green",
    },
    {
      title: "Web Development",
      description: "Advanced CSS Techniques",
      time: "Friday 4PM",
      color: "soft-orange",
    },
  ];

  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.3 }}>
      <Card className="neumorphic hover:shadow-soft-hover transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800" data-testid="text-webinars-title">
              Upcoming Webinars
            </h3>
            <Video className="text-sage-green" />
          </div>
          <div className="space-y-4 overflow-x-auto">
            <div className="flex space-x-4">
              {webinars.map((webinar, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`flex-shrink-0 w-64 bg-${webinar.color}/10 rounded-2xl p-4 cursor-pointer`}
                  data-testid={`card-webinar-${index}`}
                >
                  <h4 className="font-semibold text-gray-800 mb-2">{webinar.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{webinar.description}</p>
                  <span 
                    className={`text-xs bg-${webinar.color} text-white px-2 py-1 rounded-full`}
                    data-testid={`text-webinar-time-${index}`}
                  >
                    {webinar.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
