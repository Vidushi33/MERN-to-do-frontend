import { useEffect, useState } from "react";

import SearchIcon from "../assets/icons/searchIcon";
import DateComp from "../components/dateComp";
import MetricsComponent from "../components/metricsComponent";
import ProgressBar from "../components/progessBar";
import TaskSection from "../components/taskSection";

import type { Task, TaskStatus, createTask } from "../utils/interface/task";
import { apiRequest } from "../fetch/fetchApi";
import TaskForm from "../components/form.tsx";
import { debounce } from "../utils/debounce";
import PrevArrow from "../assets/icons/prevArrow.tsx";
import SearchSection from "../components/searchSection.tsx";

const HomePage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError("");

        const query = search.trim()
          ? `?search=${encodeURIComponent(search.trim())}`
          : "";

        const result = await apiRequest<Task[]>(`/tasks${query}`, {
          signal: controller.signal,
        });

        setTasks(result.data);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    const debouncedFetch = debounce(fetchTasks, 2000);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
      controller.abort();
    };
  }, [search]);

  const openCreate = (task: Task | null = null) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const saveTask = async (payload: createTask, taskId?: string) => {
    setError("");

    if (taskId) {
      const result = await apiRequest<Task>(`/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? result.data : task)),
      );
    } else {
      const result = await apiRequest<Task>("/tasks", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setTasks((prev) => [...prev, result.data]);
    }
  };

  const changeStatus = async (task: Task) => {
    const status: TaskStatus =
      task.status === "Completed" ? "In Progress" : "Completed";

    try {
      setError("");

      const result = await apiRequest<Task>(`/tasks/${task._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      setTasks((prev) =>
        prev.map((item) => (item._id === task._id ? result.data : item)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update task.");
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      setError("");

      await apiRequest<null>(`/tasks/${taskId}`, {
        method: "DELETE",
      });

      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete task.");
    }
  };

  return (
    <div className="flex min-h-screen h-screen items-start justify-center md:p-7">
      <main className="relative flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl md:max-w-[90%] md:rounded-3xl">
        <section className="flex  h-full flex-col overflow-y-auto bg-white py-6 px-2 md:px-10 md:py-10">
          {search !== "" && (
            <div className="mb-5 cursor-pointer" onClick={()=>setSearch("")}>
              <PrevArrow />
            </div>
          )}
          <div className="mb-8 flex shrink-0 items-center justify-between rounded border border-[#E6E6E6] px-4 py-4 text-black/60">
            <input
              type="text"
              value={search}
              onChange={(e) => {setLoading(true);setSearch(e.target.value)}}
              placeholder="Search for a task"
              aria-label="Search tasks"
              className="w-full bg-transparent text-sm text-[#090E23] outline-none placeholder:text-[#A0A2AB]"
            />

            <SearchIcon />
          </div>

          {error && (
            <p
              role="alert"
              className="mb-4 rounded bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {error}
            </p>
          )}
          {search == "" ? (
            <>
              <DateComp
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />

              <div className="my-8">
                <MetricsComponent tasks={tasks} selectedDate={selectedDate} />
              </div>

              <ProgressBar tasks={tasks} selectedDate={selectedDate} />

              <div className="mt-8 min-h-0 flex-1 overflow-y-auto">
                <TaskSection
                  tasks={tasks}
                  selectedDate={selectedDate}
                  loading={loading}
                  onStatus={changeStatus}
                  onEdit={openCreate}
                  onDelete={deleteTask}
                />
              </div>

              <div className="flex shrink-0 justify-center pt-4">
                <button
                  type="button"
                  onClick={() => openCreate()}
                  aria-label="Add task"
                  className="cursor-pointer flex h-14 w-14 items-center justify-center rounded-full bg-primary text-3xl text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
                >
                  +
                </button>
              </div>
            </>
          ) : (
            <div>
              <SearchSection
                tasks={tasks}
                loading={loading}
                onStatus={changeStatus}
                onEdit={openCreate}
                onDelete={deleteTask}
              />
            </div>
          )}
        </section>

        {modalOpen && (
          <TaskForm
            editingTask={editingTask}
            selectedDate={selectedDate}
            onClose={closeModal}
            onSave={saveTask}
          />
        )}
      </main>
    </div>
  );
};

export default HomePage;
