import { useEffect, useState } from "react";
import { Bell, Sun, CloudSun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import "./Reminders.css";

const DEFAULT_REMINDERS = {
  morning: {
    enabled: true,
    time: "07:00",
  },
  afternoon: {
    enabled: false,
    time: "13:00",
  },
  evening: {
    enabled: true,
    time: "20:00",
  },
};

function ReminderRow({ icon: Icon, title, description, reminder, onChange }) {
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

  const [reminders, setReminders] = useState(() => {
    try {
      const saved = localStorage.getItem("ht_reminders");

      return saved
        ? JSON.parse(saved)
        : DEFAULT_REMINDERS;
    } catch {
      return DEFAULT_REMINDERS;
    }
  });

  const updateReminder = (type, value) => {
    setReminders((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const saveReminders = () => {
    localStorage.setItem(
      "ht_reminders",
      JSON.stringify(reminders)
    );

    toast({
      title: "Reminders saved",
      description: "Your reminder settings have been updated.",
    });
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