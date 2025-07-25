import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
// Modern icons from Heroicons
import {
  PencilSquareIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/solid';

const App = () => {
  const [newTodo, setNewTodo] = useState('');
  const [allTodo, setAllTodo] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editingText, setEditingText] = useState('');
  // State for dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- Core Todo Logic (Unchanged) ---
  const handleOnClick = async () => {
    if (!newTodo.trim()) {
      toast.info('Todo cannot be empty');
      return;
    }
    try {
      const { data } = await axios.post('http://localhost:4000/api/v1/', { text: newTodo });
      setAllTodo([data.data, ...allTodo]);
      setNewTodo('');
      toast.success('Todo Added Successfully');
    } catch (error) {
      console.log('Error while adding Todo:', error);
      toast.error("Todo Can't be Added");
    }
  };

  const fetchAllTodo = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/api/v1');
      setAllTodo(data.data.reverse());
    } catch (error) {
      console.log('Error while fetching the todos:', error);
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo._id);
    setEditingText(todo.text);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.patch(`http://localhost:4000/api/v1/${editingTodo}`, { text: editingText });
      if (response.data.success) {
        toast.success('Todo Updated Successfully');
        setAllTodo((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === editingTodo ? { ...todo, text: editingText } : todo
          )
        );
      } else {
        toast.error('Todo Cannot be Updated');
      }
      setEditingText('');
      setEditingTodo(null);
    } catch (error) {
      toast.error(error.message);
      console.log('Todo Cannot be Updated : ', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/v1/${id}`);
      if (response.data.success) {
        toast.success('Todo Deleted successfully');
        const newTodoList = allTodo.filter((todo) => todo._id !== id);
        setAllTodo(newTodoList);
      } else {
        toast.error("Todo Can't be Deleted");
      }
    } catch (error) {
      toast.error("Todo Can't be Deleted");
      console.log("Todo can't be deleted : ", error);
    }
  };

  const handleComplete = async (todo) => {
    try {
      const updatedStatus = !todo.completed;
      const response = await axios.patch(`http://localhost:4000/api/v1/${todo._id}`, {
        completed: updatedStatus,
      });

      if (response.data.success) {
        toast.success(`Marked as ${updatedStatus ? 'Completed' : 'Incomplete'}`);
        setAllTodo((prevTodos) =>
          prevTodos.map((t) =>
            t._id === todo._id ? { ...t, completed: updatedStatus } : t
          )
        );
      } else {
        toast.error('Could not update status');
      }
    } catch (error) {
      toast.error("Task Can't be marked complete");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllTodo();
  }, []);

  // --- JSX with manual dark mode ---
  return (
    <div className={`min-h-screen w-full flex justify-center items-start sm:items-center p-4 font-sans transition-colors duration-500 ${isDarkMode ? 'bg-slate-900 text-slate-200' : 'bg-slate-100 text-slate-800'}`}>
      <div className={`w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-lg transition-all ${isDarkMode ? 'bg-slate-800/60 shadow-black/30 border-slate-700/50' : 'bg-white/70 shadow-slate-400/20 border-slate-200/50'} border`}>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            My Tasks
          </h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full transition-colors duration-300 ${isDarkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-200'}`}
          >
            {isDarkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
          </button>
        </div>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            className={`flex-grow p-3 rounded-lg outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'bg-slate-700/50 border-slate-600 focus:ring-indigo-400 placeholder:text-slate-500' : 'bg-slate-100/80 border-slate-300 focus:ring-indigo-500 placeholder:text-slate-400'} border`}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleOnClick()}
            placeholder="Add a new task..."
          />
          <button
            className={`p-3 rounded-lg bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 active:scale-95 transition-all duration-300 ${isDarkMode ? 'focus:ring-offset-slate-900' : 'focus:ring-offset-2'}`}
            onClick={handleOnClick}
          >
            <PlusIcon className="h-6 w-6" />
          </button>
        </div>

        <hr className={isDarkMode ? 'border-slate-700' : 'border-slate-200'} />

        <div className="mt-6 space-y-3 max-h-[50vh] overflow-y-auto pr-2">
          {allTodo.map((todo) => (
            <div
              key={todo._id}
              className={`flex items-center p-3 rounded-xl shadow-md border border-transparent hover:border-indigo-400/50 transition-all duration-300 ${isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'}`}
            >
              {editingTodo === todo._id ? (
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                    className={`flex-grow p-2 rounded-md outline-none focus:ring-2 focus:ring-green-500 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-300'} border`}
                  />
                  <button onClick={handleUpdate} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-green-400 hover:bg-green-800/50' : 'text-green-600 hover:bg-green-100'}`}>
                    <CheckIcon className="h-6 w-6" />
                  </button>
                  <button onClick={() => setEditingTodo(null)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-red-400 hover:bg-red-800/50' : 'text-red-600 hover:bg-red-100'}`}>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center w-full">
                  <div
                    className={`h-6 w-6 rounded-full border-2 flex justify-center items-center cursor-pointer transition-all duration-300 ${todo.completed ? 'bg-indigo-600 border-indigo-600' : (isDarkMode ? 'border-slate-500' : 'border-slate-400')}`}
                    onClick={() => handleComplete(todo)}
                  >
                    {todo.completed && <CheckIcon className="h-4 w-4 text-white" />}
                  </div>
                  <span className={`flex-grow mx-4 transition-colors duration-300 ${todo.completed ? (isDarkMode ? 'line-through text-slate-500' : 'line-through text-slate-400') : ''}`}>
                    {todo.text}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(todo)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-slate-500 hover:text-indigo-400 hover:bg-slate-700' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-200'}`}>
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(todo._id)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-slate-500 hover:text-red-500 hover:bg-slate-700' : 'text-slate-500 hover:text-red-600 hover:bg-slate-200'}`}>
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;