import { useMemo, useState } from "react";

import type { Task } from "../utils/interface/task";
import TaskRow from "./taskRow";

interface TaskSectionProps {
  tasks: Task[];
  selectedDate: Date;
  loading: boolean;
  onStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const dateKey = (value: Date | string) => {
  const date = new Date(value);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const TaskSection = ({
  tasks,
  selectedDate,
  loading,
  onStatus,
  onEdit,
  onDelete,
}: TaskSectionProps) => {
  const [viewAll, setViewAll] = useState(false);

  const todayTasks = useMemo(
    () => tasks.filter((task) => dateKey(task.dueDate) === dateKey(selectedDate)),
    [tasks, selectedDate],
  );

  const displayedTasks = useMemo(() => {
    if (!viewAll) return todayTasks;

    return [...tasks].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    );
  }, [tasks, todayTasks, viewAll]);

  const isToday = dateKey(new Date()) === dateKey(selectedDate);

  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {viewAll && (
            <button
              type="button"
              onClick={() => setViewAll(false)}
              aria-label="Go back to daily tasks"
              className="text-primary hover:opacity-70"
            >
              ←
            </button>
          )}

          <h2 className="text-xl font-semibold text-[#090E23]">
            {viewAll ? "All Tasks" : isToday ? "Tasks Today" : "Tasks"}
          </h2>
        </div>

        {!viewAll && (
          <button
            type="button"
            onClick={() => setViewAll(true)}
            className="text-sm font-medium text-primary hover:opacity-70"
          >
            View All
          </button>
        )}
      </div>

      {/* Task List */}
      <div>
        {loading ? (
          <p className="py-6 text-center text-sm text-[#A0A2AB]">
            Loading tasks...
          </p>
        ) : displayedTasks.length === 0 ? (
          <p className="py-6 text-center text-sm text-[#A0A2AB]">
            {viewAll
              ? "No tasks available."
              : "No tasks scheduled for this day."}
          </p>
        ) : (
          displayedTasks.map((task) => (
            <TaskRow
              key={task._id}
              task={task}
              onStatus={onStatus}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default TaskSection;
