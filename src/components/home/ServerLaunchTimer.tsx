import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Rocket, Clock, CheckCircle, Loader2 } from "lucide-react";
import { useServerSettings } from "@/hooks/useServerSettings";
import { useServerStatus } from "@/hooks/useServerStatus";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
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

function calculateUptime(launchDate: Date): TimeLeft {
  const difference = new Date().getTime() - launchDate.getTime();
  
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

export function ServerLaunchTimer() {
  const { data: settings, isLoading: settingsLoading } = useServerSettings();
  const { data: serverStatus } = useServerStatus();
  
  const launchDate = useMemo(() => {
    if (settings?.launch?.date) {
      return new Date(settings.launch.date);
    }
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }, [settings?.launch?.date]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(launchDate));
  const [uptime, setUptime] = useState<TimeLeft>(calculateUptime(launchDate));

  const isLaunched = useMemo(() => {
    return new Date() >= launchDate;
  }, [launchDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isLaunched) {
        setUptime(calculateUptime(launchDate));
      } else {
        setTimeLeft(calculateTimeLeft(launchDate));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [launchDate, isLaunched]);

  // Initial calculation
  useEffect(() => {
    if (isLaunched) {
      setUptime(calculateUptime(launchDate));
    } else {
      setTimeLeft(calculateTimeLeft(launchDate));
    }
  }, [launchDate, isLaunched]);

  const displayTime = isLaunched ? uptime : timeLeft;

  const timeBlocks = isLaunched
    ? [
        { label: "Days", value: displayTime.days },
        { label: "Hours", value: displayTime.hours },
        { label: "Minutes", value: displayTime.minutes },
        { label: "Seconds", value: displayTime.seconds },
      ]
    : [
        { label: "Days", value: displayTime.days },
        { label: "Hours", value: displayTime.hours },
        { label: "Minutes", value: displayTime.minutes },
        { label: "Seconds", value: displayTime.seconds },
      ];

  if (settingsLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="gaming-card rounded-xl p-6 flex items-center justify-center min-h-[200px] border-yellow-500/50 shadow-[0_0_30px_hsl(38_90%_50%/0.15)]"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="gaming-card rounded-xl p-6 border-yellow-500/50 shadow-[0_0_30px_hsl(38_90%_50%/0.15)] relative overflow-hidden"
    >
      {/* Gold corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-500/60 rounded-tl-xl" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-500/60 rounded-tr-xl" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-500/60 rounded-bl-xl" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-500/60 rounded-br-xl" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          isLaunched ? "bg-green-500/20" : "bg-primary/20"
        }`}>
          {isLaunched ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <Rocket className="w-6 h-6 text-primary" />
          )}
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">
            {isLaunched ? "Server Online" : "Server Launch"}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {isLaunched ? "Uptime" : "Countdown"}
          </p>
        </div>
      </div>

      {/* Countdown / Uptime */}
      <div className="grid grid-cols-4 gap-2">
        {timeBlocks.map((block) => (
          <div key={block.label} className="text-center">
            <div className={`rounded-lg p-3 mb-2 ${
              isLaunched ? "bg-green-500/10" : "bg-muted/50"
            }`}>
              <span className={`text-2xl md:text-3xl font-bold ${
                isLaunched ? "text-green-400" : "text-gradient-gold"
              }`}>
                {block.value.toString().padStart(2, "0")}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{block.label}</span>
          </div>
        ))}
      </div>

      {/* Status Info */}
      {!isLaunched && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-yellow-400">Coming Soon</span>
            </div>
            <span className="text-muted-foreground">
              {launchDate.toLocaleDateString("el-GR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
