import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function FeeStatusCard() {
  const feeData = [
    { label: "Semester Fee", amount: "$2,500", color: "gray" },
    { label: "Amount Paid", amount: "$2,500", color: "green" },
    { label: "Outstanding", amount: "$0", color: "gray" },
  ];

  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.3 }}>
      <Card className="neumorphic hover:shadow-soft-hover transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800" data-testid="text-fee-status-title">
              Fee Status
            </h3>
            <DollarSign className="text-soft-orange" />
          </div>
          <div className="space-y-4">
            {feeData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between"
                data-testid={`row-fee-${index}`}
              >
                <span className="text-gray-600">{item.label}</span>
                <span 
                  className={`font-semibold text-${item.color}-600`}
                  data-testid={`text-fee-amount-${index}`}
                >
                  {item.amount}
                </span>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4"
              data-testid="card-fee-status"
            >
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-3" />
                <span className="text-green-800 font-medium">All fees paid for this semester</span>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
