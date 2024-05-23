"use client"

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/navigation";

interface Task {
  _id: string;
  name: string;
  completed: boolean;
}

export default function Home() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await axios.get("/api/tasks");
      setTasks(res.data);
    }

    fetchTasks();
  }, []);

  const handleSubmit = async () => {
    if (inputValue.trim() === "") return;

    try {
      const res = await axios.post("/api/tasks", { name: inputValue });
      setTasks(prevTasks => [...prevTasks, res.data]);
      setInputValue('');
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  const handleDelete = async (taskId: string) => {
    try {
      const res = await axios.delete(`/api/tasks/${taskId}`);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }
  

  return (
    <main className="bg-blue-50 w-full min-h-screen flex flex-col justify-start items-center pt-28">
      <div className="bg-white px-8 py-6 w-full max-w-2xl mx-auto flex flex-col gap-2 justify-center items-center rounded-lg shadow-lg">
        <h1 className="text-black text-2xl font-light text-center">
          Task Manager
        </h1>
        <div className="flex">
          <input
            type="text"
            className="border-[1px] pl-4 py-2 rounded-l-lg"
            placeholder="e.g. Wash the dishes"
            value={inputValue}
            onChange={handleInputChange}
          />
          <button 
            onClick={handleSubmit}
            className="flex justify-center items-center px-4 bg-blue-500 text-white rounded-r-lg"
          >
            Submit
          </button>
        </div>
      </div>
      <div className="w-full max-w-2xl mt-6 flex flex-col gap-4">
        {tasks.length > 0 ? (
          tasks.map((task: any) => (
            <div key={task._id} className="bg-white py-2 px-4 rounded-lg flex justify-between w-full max-w-xl mx-auto shadow-md">
              <h3 className={`${task.completed && 'line-through'} `}>{task.name}</h3>
              <div className="flex text-lg justify-center items-center gap-2">
                <Link href={`/task/${task._id}`}>
                  <CiEdit />
                </Link>
                <MdDelete onClick={() => handleDelete(task._id)} className="cursor-pointer"/>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks available</p>
        )}
      </div>
    </main>
  );
}
