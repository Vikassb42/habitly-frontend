import { useEffect, useState } from "react";
import { useHabits } from "@/context/HabitContext";
import { useAuth } from "@/context/AuthContext";
import { Bell, Sun, CloudSun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import "./Reminders.css";
import { reminderApi } from "@/services/api";

const DEFAULT_REMINDERS = {
  morning: { enabled: true, time: "07:00" },
  afternoon: { enabled: false, time: "13:00" },
  evening: { enabled: true, time: "20:00" },
};

function ReminderRow({
  icon: Icon,
  title,
  description,
  reminder,
  onChange,
}) {
  return (
    <div className="reminder-row">
      <div className="reminder-info">
        <div className="reminder-icon">
          <Icon size={18} />
        </div>

        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>

      <div className="reminder-controls">
        <input
          type="time"
          value={reminder.time}
          onChange={(e) =>
            onChange({
              ...reminder,
              time: e.target.value,
            })
          }
          disabled={!reminder.enabled}
        />

        <Switch
          checked={reminder.enabled}
          onCheckedChange={(checked) =>
            onChange({
              ...reminder,
              enabled: checked,
            })
          }
        />
      </div>
    </div>
  );
}

export default function Reminders() {
  const { toast } = useToast();
  const { habits } = useHabits();
  const { isAuthenticated } = useAuth();

  const [reminders, setReminders] = useState(DEFAULT_REMINDERS);
const [loadingReminders, setLoadingReminders] = useState(true);

  const updateReminder = (type, value) => {
    setReminders((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  useEffect(() => {
  const loadReminders = async () => {
    if (!isAuthenticated) {
      setLoadingReminders(false);
      return;
    }

    try {
      const savedReminders = await reminderApi.get();

      if (savedReminders) {
        setReminders({
          morning: savedReminders.morning || DEFAULT_REMINDERS.morning,
          afternoon:
            savedReminders.afternoon || DEFAULT_REMINDERS.afternoon,
          evening:
            savedReminders.evening || DEFAULT_REMINDERS.evening,
        });
      }
    } catch (error) {
      console.error("Failed to load reminders:", error);

      toast({
        title: "Could not load reminders",
        description: error.message,
      });
    } finally {
      setLoadingReminders(false);
    }
  };

  loadReminders();
}, [isAuthenticated]);

  // Ask for notification permission
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Notifications not supported",
        description:
          "Your browser does not support notifications.",
      });

      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission === "denied") {
      toast({
        title: "Notifications blocked",
        description:
          "Please allow notifications in your browser settings.",
      });

      return false;
    }

    const permission = await Notification.requestPermission();

    return permission === "granted";
  };

  // Play reminder sound
  const playReminderSound = () => {
    try {
      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(
        880,
        audioContext.currentTime
      );

      gainNode.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
      );

      gainNode.gain.exponentialRampToValueAtTime(
        0.25,
        audioContext.currentTime + 0.02
      );

      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.8
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();

      oscillator.stop(audioContext.currentTime + 0.8);
    } catch (error) {
      console.error("Unable to play reminder sound:", error);
    }
  };

  // Send notification
const sendReminderNotification = (type) => {
  const reminderDetails = {
    morning: {
      title: "Morning Reminder",
      message: "Start your day with your habits.",
    },

    afternoon: {
      title: "Afternoon Reminder",
      message: "Keep your progress going.",
    },

    evening: {
      title: "Evening Reminder",
      message: "Finish your habits before the day ends.",
    },
  };

  const reminder = reminderDetails[type];

  if (!reminder) return;

  // Get today's date
  const now = new Date();

  const today = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // Count completed habits
  const completedCount = habits.filter((habit) => {
    if (!habit.completedDates) return false;

    if (Array.isArray(habit.completedDates)) {
      return habit.completedDates.includes(today);
    }

    return Boolean(habit.completedDates[today]);
  }).length;

  const totalHabits = habits.length;
  const remainingHabits = totalHabits - completedCount;

  let notificationMessage;

  if (totalHabits === 0) {
    notificationMessage = "You don't have any habits yet.";
  } else if (remainingHabits === 0) {
    notificationMessage =
      "Great job! All your habits are completed today. 🎉";
  } else if (remainingHabits === 1) {
    notificationMessage =
      "You have 1 habit left to complete today.";
  } else {
    notificationMessage =
      `You have ${remainingHabits} habits to complete today.`;
  }

  // Play reminder sound
  playReminderSound();

  // Browser notification
  if (
    "Notification" in window &&
    Notification.permission === "granted"
  ) {
    const notification = new Notification(
      `Habitly — ${reminder.title}`,
      {
        body: notificationMessage,
        icon: "/favicon.ico",
      }
    );

    // Open/focus Habitly when notification is clicked
    notification.onclick = () => {
  window.focus();
  window.location.href = "/dashboard";
  notification.close();
};
  }

  // Toast inside Habitly
  toast({
    title: reminder.title,
    description: notificationMessage,
  });
};

  // Check reminder times
  useEffect(() => {
    const checkReminders = () => {
      const notificationsEnabled =
  localStorage.getItem("ht_notifications") !== "false";

if (!notificationsEnabled) return;
      const now = new Date();

      const currentHour = String(now.getHours()).padStart(2, "0");
      const currentMinute = String(now.getMinutes()).padStart(2, "0");

      const currentTime = `${currentHour}:${currentMinute}`;

      const today = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

      const lastTriggered = JSON.parse(
        localStorage.getItem("ht_reminder_last_triggered") || "{}"
      );

      ["morning", "afternoon", "evening"].forEach((type) => {
        const reminder = reminders[type];

        if (!reminder.enabled) return;

        if (reminder.time !== currentTime) return;

        const triggerKey = `${today}_${type}_${reminder.time}`;

        if (lastTriggered[type] === triggerKey) {
          return;
        }

        sendReminderNotification(type);

        lastTriggered[type] = triggerKey;

        localStorage.setItem(
          "ht_reminder_last_triggered",
          JSON.stringify(lastTriggered)
        );
      });
    };

    // Check immediately
    checkReminders();

    // Check every 20 seconds
    const interval = setInterval(checkReminders, 20000);

    return () => clearInterval(interval);
  }, [reminders]);

  const saveReminders = async () => {
  const hasEnabledReminder =
    reminders.morning.enabled ||
    reminders.afternoon.enabled ||
    reminders.evening.enabled;

  if (hasEnabledReminder) {
    const permissionGranted =
      await requestNotificationPermission();

    if (!permissionGranted) {
      return;
    }
  }

  try {
    const savedReminders = await reminderApi.save(reminders);

    setReminders({
      morning: savedReminders.morning,
      afternoon: savedReminders.afternoon,
      evening: savedReminders.evening,
    });

    // Keep localStorage as a local cache for the notification scheduler.
    localStorage.setItem(
      "ht_reminders",
      JSON.stringify(savedReminders)
    );

    toast({
      title: "Reminders saved",
      description:
        "Your reminder settings have been updated.",
    });
  } catch (error) {
    console.error("Failed to save reminders:", error);

    toast({
      title: "Could not save reminders",
      description: error.message,
    });
  }
};

  useEffect(() => {
    const saved = localStorage.getItem("ht_reminders");

    if (!saved) {
      localStorage.setItem(
        "ht_reminders",
        JSON.stringify(DEFAULT_REMINDERS)
      );
    }
  }, []);

  return (
    <div className="reminders-page">
      <div className="reminders-header">
        <div className="reminders-heading-icon">
          <Bell size={22} />
        </div>

        <div>
          <h1>Reminders</h1>

          <p>
            Set reminders to help you stay consistent with your habits.
          </p>
        </div>
      </div>

      <div className="reminders-card">
        <ReminderRow
          icon={Sun}
          title="Morning Reminder"
          description="Start your day with your habits"
          reminder={reminders.morning}
          onChange={(value) =>
            updateReminder("morning", value)
          }
        />

        <ReminderRow
          icon={CloudSun}
          title="Afternoon Reminder"
          description="Keep your progress going"
          reminder={reminders.afternoon}
          onChange={(value) =>
            updateReminder("afternoon", value)
          }
        />

        <ReminderRow
          icon={Moon}
          title="Evening Reminder"
          description="Finish your habits before the day ends"
          reminder={reminders.evening}
          onChange={(value) =>
            updateReminder("evening", value)
          }
        />
      </div>

      <div className="reminders-actions">
        <Button
          onClick={saveReminders}
          className="bg-brand-500 text-white hover:bg-brand-600"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}