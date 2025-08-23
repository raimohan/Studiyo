import { Card, CardContent } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function AssignmentsCard() {
  const assignments = [
    {
      title: "React Component Design",
      dueDate: "Dec 18, 2024",
      status: "Submitted",
      statusColor: "green",
    },
    {
      title: "Database Design Project",
      dueDate: "Dec 20, 2024",
      status: "In Progress",
      statusColor: "yellow",
    },
    {
      title: "Algorithm Analysis",
      dueDate: "Dec 22, 2024",
      status: "Not Started",
      statusColor: "red",
    },
  ];

  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.3 }}>
      <Card className="neumorphic hover:shadow-soft-hover transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800" data-testid="text-assignments-title">
              Recent Assignments
            </h3>
            <CheckSquare className="text-sage-green" />
          </div>
          <div className="space-y-4">
            {assignments.map((assignment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer"
                data-testid={`card-assignment-${index}`}
              >
                <div>
                  <h4 className="font-medium text-gray-800" data-testid={`text-assignment-title-${index}`}>
                    {assignment.title}
                  </h4>
                  <p className="text-sm text-gray-600" data-testid={`text-assignment-due-${index}`}>
                    Due: {assignment.dueDate}
                  </p>
                </div>
                <span 
                  className={`bg-${assignment.statusColor}-100 text-${assignment.statusColor}-800 px-2 py-1 rounded-full text-xs`}
                  data-testid={`text-assignment-status-${index}`}
                >
                  {assignment.status}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
