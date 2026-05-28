import React, { useState } from 'react';
import { useTodo } from '../../context/TodoContext';

function ToDoList() {
    const { todos, addTodo, toggleTodo, deleteTodo } = useTodo();
    const [inputValue, setInputValue] = useState("");

    const handleAdd = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            addTodo(inputValue);
            setInputValue("");
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm flex flex-col w-full h-[600px]">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">To-do List</h2>

            <form onSubmit={handleAdd} className="flex gap-3 mb-6">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="What needs to be done?"
                    className="flex-1 px-4 py-3 bg-light-gray rounded-lg border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors duration-200 text-sm md:text-base text-gray-800"
                />
                <button
                    type="submit"
                    className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 hover:cursor-pointer transition-colors duration-200"
                >
                    Add
                </button>
            </form>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {todos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <p>No tasks yet. Add one above!</p>
                    </div>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {todos.map(todo => (
                            <li
                                key={todo.id}
                                className="flex items-center gap-3 p-4 bg-light-gray rounded-lg group hover:bg-gray-100 transition-colors duration-200"
                            >
                                <button
                                    onClick={() => toggleTodo(todo.id)}
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 hover:cursor-pointer transition-colors duration-200 ${todo.is_completed ? 'bg-primary border-primary' : 'border-gray-300 hover:border-primary'}`}
                                >
                                    {todo.is_completed && (
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>

                                <span className={`flex-1 text-sm md:text-base transition-all duration-200 ${todo.is_completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                    {todo.title}
                                </span>

                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    className="opacity-0 group-hover:opacity-100 hover:cursor-pointer text-gray-400 hover:text-red-500 transition-all duration-200 p-1"
                                    aria-label="Delete todo"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default ToDoList;