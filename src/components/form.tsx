/* eslint-disable react-hooks/incompatible-library */
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import type { createTask, Task, TaskPriority } from "../utils/interface/task";
import CrossIcon from "../assets/icons/crossIcon";
import CalanderIcon from "../assets/icons/calenderIcon";

interface TaskFormProps {
  editingTask: Task | null;
  selectedDate: Date;
  onClose: () => void;
  onSave: (payload: createTask, taskId?: string) => Promise<void>;
}

interface TaskPayload {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
}

interface FormValues {
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  priority: TaskPriority;
}

const priorities: TaskPriority[] = ["Low", "Medium", "High"];

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getInitialForm = (selectedDate: Date, task: Task | null): FormValues => {
  return {
    title: task?.title || "",
    description: task?.description || "",
    date: getDateKey(task ? new Date(task.dueDate) : selectedDate),
    start_time: "",
    end_time: "",
    priority: task?.priority || "Medium",
  };
};

const TaskForm = ({
  editingTask,
  selectedDate,
  onClose,
  onSave,
}: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: getInitialForm(selectedDate, editingTask),
  });

  useEffect(() => {
    reset(getInitialForm(selectedDate, editingTask));
  }, [selectedDate, editingTask, reset]);

  const handleFormSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      const payload: TaskPayload = {
        title: values.title.trim(),
        description: values.description.trim(),
        dueDate: new Date(`${values.date}T00:00:00`).toISOString(),
        priority: values.priority,
      };

      await onSave(payload, editingTask?._id);
      alert(
      editingTask
        ? "Task updated successfully!"
        : "Task created successfully!"
    );
      onClose();
    } catch (error) {
      setError("root.server", {
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  };

  return (
    <div className="absolute inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget && !isSubmitting) {
            onClose();
          }
        }}
      />

      {/* Bottom Sheet */}
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="absolute bottom-0 left-0 max-h-[90%] w-full overflow-y-auto rounded-t-xl bg-white px-2 md:px-6 pb-6 pt-8 shadow-2xl animate-slide-up"
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#242A45]">
            {editingTask ? "Edit Task" : "Add New Task"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="cursor-pointer text-[#242A45] transition hover:text-primary disabled:opacity-50"
          >
            <CrossIcon />
          </button>
        </div>

        {/* Title */}
        <label htmlFor="task-title" className={labelClass}>
          Task title
        </label>

        <input
          id="task-title"
          type="text"
          placeholder="Enter task title"
          maxLength={120}
          className={inputClass}
          {...register("title", {
            required: "Task title is required.",
            validate: (value) =>
              !!value.trim() || "Task title cannot be empty.",
          })}
        />

        {errors.title && <p className={errorClass}>{errors.title.message}</p>}

        <div className="grid grid-cols-2 gap-3">
          {/* Start Time */}
          <div>
            <label htmlFor="start-time" className={labelClass}>
              Start Time
            </label>

            <div className="relative">
              <input
                id="start-time"
                placeholder="Start"
                type="time"
                className={`${inputClass} `}
                {...register("start_time")}
              />
            </div>
          </div>

          {/* End Time */}
          <div>
            <label htmlFor="end-time" className={labelClass}>
              End Time
            </label>

            <div className="relative">
              <input
                id="end-time"
                type="time"
                placeholder="End"
                className={`${inputClass} `}
                {...register("end_time", {
                  validate: (value) => {
                    const start = watch("start_time");

                    if (!start || !value) return true;

                    return (
                      value > start || "End time must be later than start time."
                    );
                  },
                })}
              />
            </div>

            {errors.end_time && (
              <p className={errorClass}>{errors.end_time.message}</p>
            )}
          </div>
        </div>

        {/* Date */}
        <label htmlFor="task-date" className={labelClass}>
          Set Date
        </label>

        <div className="relative">
          <span className={iconClass}>
            <CalanderIcon />
          </span>

          <input
            id="task-date"
            type="date"
            className={`${inputClass} `}
            {...register("date", {
              required: "Date is required.",
            })}
          />
        </div>

        {errors.date && <p className={errorClass}>{errors.date.message}</p>}

        {/* Priority */}
        <label className={labelClass}>Priority</label>

        <div className="flex flex-wrap gap-2">
          {priorities.map((priority) => (
            <label key={priority}>
              <input
                type="radio"
                value={priority}
                className="peer sr-only"
                {...register("priority")}
              />

              <span className="inline-block cursor-pointer rounded-[3px] border border-[#E8E9EF] bg-white px-4 py-2 text-[11px] text-[#8A8D98] transition peer-checked:border-primary peer-checked:bg-[#F2F4FF] peer-checked:text-primary">
                {priority}
              </span>
            </label>
          ))}
        </div>

        {/* Description */}
        <label htmlFor="task-description" className={labelClass}>
          Description
        </label>

        <textarea
          id="task-description"
          placeholder="Add Description"
          maxLength={1000}
          className={`${inputClass} h-32 resize-y py-3`}
          {...register("description")}
        />

        {/* Server Error */}
        {errors.root?.server && (
          <p role="alert" className={errorClass}>
            {errors.root.server.message}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer mt-5 w-full bg-primary py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Saving..."
            : editingTask
              ? "Save changes"
              : "Create task"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;

const inputClass =
  "py-2 w-full rounded border border-[#E9E9EE] bg-white px-2 text-xs text-[#242A45] outline-none transition focus:border-[#9AA9FF] focus:ring-2 focus:ring-[#4966EE]/10";

const labelClass = "mb-2 mt-4 block text-xs font-medium text-[#8D909B]";

const errorClass = "mt-1 text-xs text-red-500";

const iconClass =
  "pointer-events-none absolute left-3  top-3 z-10 text-[#555D79]";
