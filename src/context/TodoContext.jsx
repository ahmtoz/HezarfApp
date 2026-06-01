import React, { createContext, useContext, useEffect, useReducer, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const TodoContext = createContext();

const initialState = [];

function todoReducer(state, action) {
    switch (action.type) {
        case 'SET_TODOS':
            return action.payload;
        case 'ADD_TODO':
            return [...state, action.payload];
        case 'TOGGLE_TODO':
            return state.map(todo =>
                todo.id === action.payload
                    ? {
                        ...todo,
                        is_completed: !todo.is_completed,
                        completed_at: !todo.is_completed ? new Date().toISOString() : null
                    }
                    : todo
            );
        case 'DELETE_TODO':
            return state.filter(todo => todo.id !== action.payload);
        default:
            return state;
    }
}

export const TodoProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [todos, dispatch] = useReducer(todoReducer, initialState);

    useEffect(() => {
        if (authLoading) return;

        const loadTodos = async () => {
            if (user) {
                try {
                    const { data, error } = await supabase
                        .from('todos')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: true });

                    if (error) throw error;
                    dispatch({ type: 'SET_TODOS', payload: data || [] });
                } catch (error) {
                    console.error("Supabase Todo Fetch Error:", error);
                }
            } else {
                const savedTodos = localStorage.getItem('hezarf_todos');
                if (savedTodos) {
                    dispatch({ type: 'SET_TODOS', payload: JSON.parse(savedTodos) });
                }
            }
        };
        loadTodos();
    }, [user, authLoading]);

    useEffect(() => {
        if (!user && todos.length > 0) {
            localStorage.setItem('hezarf_todos', JSON.stringify(todos));
        } else if (!user && todos.length === 0) {
            localStorage.removeItem('hezarf_todos');
        }
    }, [todos, user]);

    const addTodo = async (title) => {
        if (!title.trim()) return;

        const newTodo = {
            title,
            is_completed: false,
            completed_at: null,
        };

        if (user) {
            newTodo.user_id = user.id;
            try {
                const { data, error } = await supabase
                    .from('todos')
                    .insert([newTodo])
                    .select()
                    .single();

                if (error) throw error;
                if (data) dispatch({ type: 'ADD_TODO', payload: data });
            } catch (error) {
                console.error("Supabase Add Todo Error:", error);
            }
        } else {
            // Local fallback
            newTodo.id = Math.random().toString(36).substr(2, 9);
            newTodo.created_at = new Date().toISOString();
            dispatch({ type: 'ADD_TODO', payload: newTodo });
        }
    };

    const toggleTodo = async (id) => {
        const todoToToggle = todos.find(t => t.id === id);
        if (!todoToToggle) return;

        dispatch({ type: 'TOGGLE_TODO', payload: id });

        if (user) {
            try {
                const newCompletedAt = !todoToToggle.is_completed ? new Date().toISOString() : null;
                const { error } = await supabase
                    .from('todos')
                    .update({ 
                        is_completed: !todoToToggle.is_completed,
                        completed_at: newCompletedAt
                    })
                    .eq('id', id);

                if (error) {
                    dispatch({ type: 'TOGGLE_TODO', payload: id });
                    throw error;
                }
            } catch (error) {
                console.error("Supabase Toggle Todo Error:", error);
            }
        }
    };

    const deleteTodo = async (id) => {
        const todoToDelete = todos.find(t => t.id === id);
        dispatch({ type: 'DELETE_TODO', payload: id });

        if (user) {
            try {
                const { error } = await supabase
                    .from('todos')
                    .delete()
                    .eq('id', id);

                if (error) {
                    dispatch({ type: 'ADD_TODO', payload: todoToDelete });
                    throw error;
                }
            } catch (error) {
                console.error("Supabase Delete Todo Error:", error);
            }
        }
    };

    const contextValue = useMemo(() => ({
        todos,
        addTodo,
        toggleTodo,
        deleteTodo
    }), [todos, user]);

    return (
        <TodoContext.Provider value={contextValue}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodo = () => useContext(TodoContext);