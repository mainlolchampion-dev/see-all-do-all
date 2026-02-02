import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Castle, Clock, Swords, Loader2 } from "lucide-react";
import { useCastleData } from "@/hooks/useCastleData";
import { useServerSettings } from "@/hooks/useServerSettings";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const dayMap: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

function parseSchedule(schedule: string) {
  const regex = /every\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s+(\d{1,2}):(\d{2})(?:\s*gmt([+-]\d{1,2}))?/i;
  const match = schedule.match(regex);
  if (!match) return null;

  const day = dayMap[match[1].toLowerCase()];
  const hour = parseInt(match[2], 10);
  const minute = parseInt(match[3], 10);
  const offset = match[4] ? parseInt(match[4], 10) : 0;

  if (Number.isNaN(day) || Number.isNaN(hour) || Number.isNaN(minute) || Number.isNaN(offset)) {
    return null;
  }

  return { day, hour, minute, offset };
}

// Calculate next siege date based on schedule string
function getNextSiegeDate(schedule: string): Date {
  const parsed = parseSchedule(schedule);
  if (!parsed) {
    // Fallback: Saturday 20:00 GMT
    return getNextSiegeDate("Every Saturday 20:00 GMT");
  }

  const now = new Date();
  const nowUtc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  const target = new Date(nowUtc);
  const dayOfWeek = nowUtc.getUTCDay();
  const daysUntil = (parsed.day - dayOfWeek + 7) % 7 || 7;

  target.setUTCDate(nowUtc.getUTCDate() + daysUntil);
  // Convert local schedule (GMT+offset) to UTC time
  const utcHour = parsed.hour - parsed.offset;
  target.setUTCHours(utcHour, parsed.minute, 0, 0);

  if (nowUtc >= target) {
    target.setUTCDate(target.getUTCDate() + 7);
  }

  return target;
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
  const { data: castles, isLoading } = useCastleData();
  const { data: settings } = useServerSettings();
  const schedule = settings?.siege?.schedule || "Every Saturday 20:00 GMT";

  const targetDate = useMemo(() => getNextSiegeDate(schedule), [schedule]);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));

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
            {schedule}
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
