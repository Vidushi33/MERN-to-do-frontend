import { useMemo } from "react";

import MetricsCard from "./metricsCard";
import TickIcon from "../assets/icons/tickIcon";
import CrossIcon from "../assets/icons/crossIcon";

import type { Task } from "../utils/interface/task";

const getStartOfWeek = (date: Date) => {
  const monday = new Date(date);
  const day = monday.getDay();

  monday.setDate(monday.getDate() + (day === 0 ? -6 : 1 - day));
  monday.setHours(0, 0, 0, 0);

  return monday;
};

interface IMetricProps {
  tasks: Task[];
  selectedDate: Date;
}

const MetricsComponent = ({ tasks, selectedDate }: IMetricProps) => {
  const { completedCount, openCount } = useMemo(() => {
    const start = getStartOfWeek(new Date());
    const end = new Date(start);

    end.setDate(start.getDate() + 7);

    const currentWeekTasks = tasks.filter((task) => {
      const dueDate = new Date(task.dueDate).getTime();

      return dueDate >= start.getTime() && dueDate < end.getTime();
    });

    const completed = currentWeekTasks.filter(
      (task) => task.status === "Completed",
    ).length;

    return {
      completedCount: completed,
      openCount: currentWeekTasks.length - completed,
    };
  }, [tasks, selectedDate]);

  return (
    <div className="grid grid-cols-2 gap-2 md:gap-8 lg:gap-16">
      <MetricsCard
        title="Task Complete"
        count={completedCount}
        icon={<TickIcon />}
        variant="success"
      />

      <MetricsCard
        title="Task Pending"
        count={openCount}
        icon={<CrossIcon />}
        variant="danger"
      />
    </div>
  );
};

export default MetricsComponent;
