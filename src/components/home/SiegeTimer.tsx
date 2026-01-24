import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Castle, Clock, Swords, Loader2 } from "lucide-react";
import { useCastleData } from "@/hooks/useCastleData";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Calculate next Saturday 20:00 GMT
function getNextSiegeDate(): Date {
  const now = new Date();
  const dayOfWeek = now.getUTCDay();
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
  
  const nextSaturday = new Date(now);
  nextSaturday.setUTCDate(now.getUTCDate() + daysUntilSaturday);
  nextSaturday.setUTCHours(20, 0, 0, 0);
  
  if (now >= nextSaturday) {
    nextSaturday.setUTCDate(nextSaturday.getUTCDate() + 7);
  }
  
  return nextSaturday;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const difference = targetDate.getTime() - new Date().getTime();
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function SiegeTimer() {
  const [targetDate] = useState(getNextSiegeDate);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));
  const { data: castles, isLoading } = useCastleData();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Find Aden castle (id 5) or first castle with owner
  const adenCastle = castles?.find(c => c.id === 5);
  const featuredCastle = adenCastle || castles?.find(c => c.owner) || castles?.[0];

  const timeBlocks = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="gaming-card rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
          <Castle className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">Next Castle Siege</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Saturday 20:00 GMT
          </p>
        </div>
      </div>

      {/* Countdown */}
      <div className="grid grid-cols-4 gap-2">
        {timeBlocks.map((block) => (
          <div key={block.label} className="text-center">
            <div className="bg-muted/50 rounded-lg p-3 mb-2">
              <span className="text-2xl md:text-3xl font-bold text-gradient-gold">
                {block.value.toString().padStart(2, "0")}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{block.label}</span>
          </div>
        ))}
      </div>

      {/* Castle Info */}
      <div className="mt-6 pt-4 border-t border-border">
        {isLoading ? (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        ) : featuredCastle ? (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Swords className="w-4 h-4 text-primary" />
              <span>{featuredCastle.name} Castle</span>
            </div>
            <span className="text-muted-foreground">
              Owner: {featuredCastle.owner || "None"}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Swords className="w-4 h-4 text-primary" />
              <span>Aden Castle</span>
            </div>
            <span className="text-muted-foreground">Owner: None</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
