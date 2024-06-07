import { createContext } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
const TasksContext = createContext();
function Provider({ children }) {
  const [tasks, setTasks] = useState([]);

  const createTask = async (title, taskDesc) => {
    try {
      const response = await axios.post("http://localhost:3004/tasks", {
        title,
        taskDesc,
      });
      console.log(response);

      const createdTasks = [...tasks, response.data];
      setTasks(createdTasks); //Yeni eklenen elemanları eski arrayin üzerine ekleme işlemi.
    } catch (error) {
      console.error("Create Task Error:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3004/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Fetch Tasks Error:", error);
    }
  };

  const deleteTaskById = async (id) => {
    try {
      await axios.delete(`http://localhost:3004/tasks/${id}`);
      const afterDeletingTasks = tasks.filter((task) => {
        return task.id !== id;
      });
      setTasks(afterDeletingTasks);
    } catch (error) {
      console.error("Delete Task Error:", error);
    }
  };

  const editTaskById = async (id, updatedTitle, updatedTaskDesc) => {
    try {
      await axios.put(`http://localhost:3004/tasks/${id}`, {
        title: updatedTitle,
        taskDesc: updatedTaskDesc,
      });
      const updatedTasks = tasks.map((task) => {
        if (task.id === id) {
          return { id, title: updatedTitle, taskDesc: updatedTaskDesc };
        }
        return task;
      });
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Edit Task Error:", error);
    }
  };
  const sharedValuesAndMethods = {
    tasks,
    createTask,
    fetchTasks,
    editTaskById,
    deleteTaskById,
  };

  return (
    <TasksContext.Provider value={sharedValuesAndMethods}>
      {children}
    </TasksContext.Provider>
  );
}
export { Provider };
export default TasksContext;
