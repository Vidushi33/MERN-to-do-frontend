import { useMemo } from "react";
import type { Task } from "../utils/interface/task"

interface ProgressBarProps {
  tasks: Task[];
  selectedDate: Date;
}

const getStartOfWeek = (date: Date) => {
  const monday = new Date(date);
  const day = monday.getDay();

  monday.setDate(monday.getDate() + (day === 0 ? -6 : 1 - day));
  monday.setHours(0, 0, 0, 0);

  return monday;
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

const ProgressBar = ({ tasks, selectedDate }: ProgressBarProps) => {
  const { progress } = useMemo(() => {
    const weekStart = getStartOfWeek(selectedDate);
    const weekEnd = new Date(weekStart);

    weekEnd.setDate(weekStart.getDate() + 7);

    const weekTasks = tasks.filter((task) => {
      const dueDate = new Date(task.dueDate).getTime();

      return dueDate >= weekStart.getTime() && dueDate < weekEnd.getTime();
    });

    const completedCount = weekTasks.filter(
      (task) => task.status === "Completed",
    ).length;

    const progress = weekTasks.length
      ? Math.round((completedCount / weekTasks.length) * 100)
      : 0;

    const lastDay = new Date(weekEnd);
    lastDay.setDate(lastDay.getDate() - 1);

    return {
      progress,
      weekLabel: `${formatDate(weekStart)} – ${formatDate(lastDay)}`,
    };
  }, [tasks, selectedDate]);

  return (
    <section>
      <h2 className="mb-4 font-semibold">Weekly Progress</h2>

      <div
        className="h-8 overflow-hidden rounded bg-[#DADAFF]"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Weekly task completion"
      >
        <div
          className="h-full rounded-lg bg-[#253C98] transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

    </section>
  );
};

export default ProgressBar;
