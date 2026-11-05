import DeleteIcon from "../assets/icons/deleteIcon";
import EditIcon from "../assets/icons/editIcon";
import TickIcon from "../assets/icons/tickIcon";
import type { Task } from "../utils/interface/task";

interface TaskRowProps {
  task: Task;
  onStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskRow = ({ task, onStatus, onEdit, onDelete }: TaskRowProps) => {
  const completed = task.status === "Completed";

  return (
    <div className="flex items-center gap-2 border-b border-[#EEEEEE] px-2 py-3 last:border-b-0">
      <button
        type="button"
        onClick={() => onStatus(task)}
        aria-label={completed ? "Mark as in progress" : "Mark as completed"}
        aria-pressed={completed}
        className={`flex h-4 w-4 shrink-0 items-center justify-center border cursor-pointer ${
          completed
            ? "border-primary  text-white"
            : "border-[#7391FF] bg-white"
        }`}
      >
        {completed && <TickIcon />}
      </button>

      <button
        type="button"
        className="min-w-0 flex-1 text-left"
      >
        <span
          className={`block truncate text-[11px] font-medium ${
            completed ? "text-[#888888] line-through" : "text-[#090E23]"
          }`}
        >
          {task.title}
        </span>

      </button>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => onDelete(task._id)}
          aria-label="Delete task"
          className="text-[#C5C5C5] transition-colors hover:text-red-500 cursor-pointer"
        >
          <DeleteIcon />
        </button>

        <button
          type="button"
          onClick={() => onEdit(task)}
          aria-label="Edit task"
          className="text-[#C5C5C5] transition-colors hover:text-primary cursor-pointer"
        >
          <EditIcon />
        </button>
      </div>
    </div>
  );
};

export default TaskRow;
