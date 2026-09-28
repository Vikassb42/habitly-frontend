import {
  BookOpen,
  Target,
  Flame,
  Brain,
  HelpCircle,
} from "lucide-react";
import "./Resources.css";

const resources = [
  {
    title: "Habit Tips",
    icon: BookOpen,
    items: [
      {
        title: "How to Build a Habit",
        text: "Start with a small action and repeat it regularly. Consistency is more important than trying to do too much at once.",
      },
      {
        title: "How Long Habits Take to Form",
        text: "Habit formation takes time and varies from person to person. Focus on repeating the habit rather than counting the days.",
      },
      {
        title: "How to Maintain Consistency",
        text: "Set a regular time for your habit, keep your goals realistic, and use Habitly to track your progress.",
      },
    ],
  },
  {
    title: "Goal Setting",
    icon: Target,
    items: [
      {
        title: "Setting Realistic Goals",
        text: "Choose goals that fit your daily routine. Start small and gradually increase your target as you become consistent.",
      },
      {
        title: "Daily vs Weekly Goals",
        text: "Daily goals are useful for regular habits, while weekly goals give you more flexibility when your schedule changes.",
      },
    ],
  },
  {
    title: "Streak Guide",
    icon: Flame,
    items: [
      {
        title: "How Streaks Work",
        text: "A streak represents consecutive days on which you complete a habit. Maintaining your streak can help you stay motivated.",
      },
      {
        title: "How to Recover After Missing a Day",
        text: "Missing one day does not mean you have failed. Start again the next day and focus on building your consistency.",
      },
    ],
  },
  {
    title: "Productivity",
    icon: Brain,
    items: [
      {
        title: "Focus Techniques",
        text: "Work on one important task at a time, remove distractions, and take short breaks when needed.",
      },
      {
        title: "Morning Routines",
        text: "A simple morning routine can help you start your day with a clear plan and positive habits.",
      },
      {
        title: "Evening Routines",
        text: "Use your evening to review your day, prepare for tomorrow, and maintain a consistent sleep routine.",
      },
    ],
  },
  {
    title: "Help",
    icon: HelpCircle,
    items: [
      {
        title: "How to Use Habitly",
        text: "Create your habits, choose when you want to complete them, and use the dashboard to track your progress.",
      },
      {
        title: "How Completion Status Works",
        text: "Mark a habit according to what happened on that day. Your completion history is used to track your progress and streaks.",
      },
      {
        title: "How Skip / Fail / Complete Works",
        text: "Complete means you finished the habit, Skip means you intentionally skipped it, and Fail means the habit was not completed.",
      },
    ],
  },
];

function Resources() {
  return (
    <div className="resources-page">
      <div className="resources-header">
        <h1>Resources</h1>
        <p>
          Simple guides and tips to help you build better habits and use
          Habitly effectively.
        </p>
      </div>

      <div className="resources-grid">
        {resources.map((section) => {
          const Icon = section.icon;

          return (
            <section className="resource-card" key={section.title}>
              <div className="resource-title">
                <div className="resource-icon">
                  <Icon size={22} />
                </div>
                <h2>{section.title}</h2>
              </div>

              <div className="resource-items">
                {section.items.map((item) => (
                  <div className="resource-item" key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default Resources;