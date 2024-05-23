"use client";

import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Task {
  _id: string;
  name: string;
  completed: boolean;
}

export default function Page() {
  const { taskId } = useParams();

  const [task, setTask] = useState<Task>({ _id: '', name: '', completed: false });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`/api/tasks/${taskId}`);
        setTask(res.data);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask({ ...task, name: e.target.value });
  };

  const handleCompletedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask({ ...task, completed: e.target.checked });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.patch(`/api/tasks/${task._id}`, {
        name: task.name,
        completed: task.completed,
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  return (
    <main className="bg-blue-50 w-full min-h-screen flex flex-col justify-start items-center pt-28">
      <div className="bg-white px-8 py-6 w-full max-w-2xl mx-auto flex flex-col gap-2 justify-center items-center rounded-lg shadow-lg">
        <h1 className="text-black text-2xl font-light text-center">
          Edit Task
        </h1>
        <div className="flex w-full px-2 justify-center gap-4">
          <div className="flex flex-col justify-center items-start gap-2">
            <p className="text-lg font-light">Task Id</p>
            <p className="text-lg font-light">Title</p>
            <p className="text-lg font-light">Completed</p>
          </div>
          <div className="flex flex-col justify-center items-start gap-2">
            <p className="text-lg font-light">{task._id}</p>
            <input
              type="text"
              value={task.name}
              onChange={handleNameChange}
              className="text-lg font-light"
            />
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleCompletedChange}
              className="h-8"
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white mt-4 px-24 py-2 rounded-lg"
        >
          Edit
        </button>
      </div>
      <Link 
        href="/"
        className="bg-blue-400 text-white px-4 py-2 rounded-xl mt-8"
      >
        Back to Home
      </Link>
    </main>
  );
}
