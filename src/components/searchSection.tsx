import type { Task } from "../utils/interface/task";
import TaskRow from "./taskRow";

interface SearchSectionProps {
  tasks: Task[];
  loading: boolean;
  onStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const SearchSection = ({
  tasks,
  loading,
  onStatus,
  onEdit,
  onDelete,
}: SearchSectionProps) => {
  return (
    <section className="flex h-full flex-col overflow-y-auto bg-white ">
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-[#8D909B]">Searching tasks...</p>
        </div>
      ) : tasks.length > 0 ? (
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskRow
              key={task._id}
              task={task}
              onStatus={onStatus}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-[#8D909B]">No tasks found.</p>
        </div>
      )}
    </section>
  );
};

export default SearchSection;
