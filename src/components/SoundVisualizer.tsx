
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SoundVisualizerProps {
  isPlaying: boolean;
  size?: "sm" | "md" | "lg";
  color?: string;
}

export function SoundVisualizer({ 
  isPlaying, 
  size = "md", 
  color = "#2196F3" 
}: SoundVisualizerProps) {
  const [bars, setBars] = useState<number[]>([]);
  
  // Size mappings
  const sizeMap = {
    sm: { barWidth: 2, gap: 1, height: 12 },
    md: { barWidth: 3, gap: 2, height: 20 },
    lg: { barWidth: 4, gap: 2, height: 30 }
  };
  
  const { barWidth, gap, height } = sizeMap[size];
  const totalBars = 5;
  const totalWidth = totalBars * barWidth + (totalBars - 1) * gap;
  
  // Generate random heights for the bars
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const newBars = Array.from({ length: totalBars }, () => 
          Math.random() * 0.8 + 0.2
        );
        setBars(newBars);
      }, 150);
      
      return () => clearInterval(interval);
    } else {
      setBars(Array.from({ length: totalBars }, () => 0.2));
    }
  }, [isPlaying, totalBars]);
  
  return (
    <AnimatePresence>
      <div 
        className="inline-flex items-end" 
        style={{ width: totalWidth, height }}
      >
        {bars.map((value, index) => (
          <motion.div
            key={index}
            initial={{ height: `${20}%` }}
            animate={{ height: `${value * 100}%` }}
            transition={{ duration: 0.15 }}
            style={{
              width: barWidth,
              marginRight: index < totalBars - 1 ? gap : 0,
              backgroundColor: color,
              borderRadius: barWidth / 2
            }}
          />
        ))}
      </div>
    </AnimatePresence>
  );
}
