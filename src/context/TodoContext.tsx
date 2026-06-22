import React, { createContext, useContext, useEffect, useReducer, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';
import { CanvasBlock, Task } from '../types/todo';

export interface Todo {
    id: string;
    title: string;
    is_completed: boolean;
    completed_at: string | null;
    user_id?: string;
    created_at?: string;
}

interface TodoState {
    todos: Todo[];
    blocks: CanvasBlock[];
}

type TodoAction =
    | { type: 'SET_TODOS'; payload: Todo[] }
    | { type: 'ADD_TODO'; payload: Todo }
    | { type: 'TOGGLE_TODO'; payload: string }
    | { type: 'DELETE_TODO'; payload: string }
    | { type: 'SET_BLOCKS'; payload: CanvasBlock[] }
    | { type: 'ADD_BLOCK'; payload: CanvasBlock }
    | { type: 'UPDATE_BLOCK'; payload: { id: string; updates: Partial<CanvasBlock> } }
    | { type: 'DELETE_BLOCK'; payload: string }
    | { type: 'ASSIGN_TASK_DATE'; payload: { blockId: string; taskId: string; date: string | null } }
    | { type: 'ADD_TASK'; payload: { blockId: string; task: Task } }
    | { type: 'TOGGLE_TASK'; payload: { blockId: string; taskId: string } }
    | { type: 'DELETE_TASK'; payload: { blockId: string; taskId: string } }
    | { type: 'UPDATE_TASK_TIME'; payload: { blockId: string; taskId: string; durationMs: number } };

interface TodoContextType {
    todos: Todo[];
    blocks: CanvasBlock[];
    addTodo: (title: string) => Promise<void>;
    toggleTodo: (id: string) => Promise<void>;
    deleteTodo: (id: string) => Promise<void>;
    // Canvas Block Metotları
    addBlock: (weekId: string, type: 'text' | 'todo') => Promise<void>;
    updateBlock: (blockId: string, updates: Partial<CanvasBlock>) => Promise<void>;
    deleteBlock: (blockId: string) => Promise<void>;
    // Canvas Blok Görev Metotları
    addTaskToBlock: (blockId: string, title: string) => Promise<void>;
    toggleTaskInBlock: (blockId: string, taskId: string) => Promise<void>;
    deleteTaskFromBlock: (blockId: string, taskId: string) => Promise<void>;
    assignTaskToDate: (blockId: string, taskId: string, date: string | null) => Promise<void>;
    updateTaskTime: (blockId: string, taskId: string, durationMs: number) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const initialState: TodoState = {
    todos: [],
    blocks: []
};

function todoReducer(state: TodoState, action: TodoAction): TodoState {
    switch (action.type) {
        case 'SET_TODOS':
            return { ...state, todos: action.payload };
        case 'ADD_TODO':
            return { ...state, todos: [...state.todos, action.payload] };
        case 'TOGGLE_TODO':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload
                        ? {
                            ...todo,
                            is_completed: !todo.is_completed,
                            completed_at: !todo.is_completed ? new Date().toISOString() : null
                        }
                        : todo
                )
            };
        case 'DELETE_TODO':
            return { ...state, todos: state.todos.filter(todo => todo.id !== action.payload) };
        case 'SET_BLOCKS':
            return { ...state, blocks: action.payload };
        case 'ADD_BLOCK':
            return { ...state, blocks: [...state.blocks, action.payload] };
        case 'UPDATE_BLOCK':
            return {
                ...state,
                blocks: state.blocks.map(block =>
                    block.id === action.payload.id ? { ...block, ...action.payload.updates } as CanvasBlock : block
                )
            };
        case 'DELETE_BLOCK':
            return { ...state, blocks: state.blocks.filter(block => block.id !== action.payload) };
        case 'ASSIGN_TASK_DATE':
            return {
                ...state,
                blocks: state.blocks.map(block => {
                    if (block.id !== action.payload.blockId || block.type !== 'todo') return block;
                    return {
                        ...block,
                        tasks: block.tasks.map(task =>
                            task.id === action.payload.taskId ? { ...task, assignedDate: action.payload.date } : task
                        )
                    };
                })
            };
        case 'ADD_TASK':
            return {
                ...state,
                blocks: state.blocks.map(block => {
                    if (block.id !== action.payload.blockId || block.type !== 'todo') return block;
                    return {
                        ...block,
                        tasks: [...block.tasks, action.payload.task]
                    };
                })
            };
        case 'TOGGLE_TASK':
            return {
                ...state,
                blocks: state.blocks.map(block => {
                    if (block.id !== action.payload.blockId || block.type !== 'todo') return block;
                    return {
                        ...block,
                        tasks: block.tasks.map(task =>
                            task.id === action.payload.taskId
                                ? { ...task, isCompleted: !task.isCompleted }
                                : task
                        )
                    };
                })
            };
        case 'DELETE_TASK':
            return {
                ...state,
                blocks: state.blocks.map(block => {
                    if (block.id !== action.payload.blockId || block.type !== 'todo') return block;
                    return {
                        ...block,
                        tasks: block.tasks.filter(task => task.id !== action.payload.taskId)
                    };
                })
            };
        case 'UPDATE_TASK_TIME':
            return {
                ...state,
                blocks: state.blocks.map(block => {
                    if (block.id !== action.payload.blockId || block.type !== 'todo') return block;
                    return {
                        ...block,
                        tasks: block.tasks.map(task =>
                            task.id === action.payload.taskId
                                ? { ...task, totalTimeSpent: task.totalTimeSpent + action.payload.durationMs }
                                : task
                        )
                    };
                })
            };
        default:
            return state;
    }
}

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading: authLoading } = useAuth() as any;
    const [state, dispatch] = useReducer(todoReducer, initialState);

    useEffect(() => {
        if (authLoading) return;

        const loadData = async () => {
            if (user) {
                try {
                    // Todos yükle
                    const { data: todosData, error: todosError } = await supabase
                        .from('todos')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: true });

                    if (todosError) throw todosError;
                    dispatch({ type: 'SET_TODOS', payload: todosData || [] });

                    // Canvas bloklarını yükle
                    const { data: blocksData, error: blocksError } = await supabase
                        .from('canvas_blocks')
                        .select('*')
                        .eq('user_id', user.id);

                    if (blocksError) throw blocksError;
                    
                    // Supabase'den gelen verilerin tiplerini doğrula
                    const typedBlocks: CanvasBlock[] = (blocksData || []).map((b: any) => {
                        if (b.type === 'todo') {
                            return {
                                id: b.id,
                                weekId: b.week_id,
                                type: 'todo',
                                title: b.title || 'Görev Listesi',
                                tasks: Array.isArray(b.tasks) ? b.tasks : [],
                                x: b.x != null ? Number(b.x) : 0,
                                y: b.y != null ? Number(b.y) : 0
                            };
                        } else {
                            return {
                                id: b.id,
                                weekId: b.week_id,
                                type: 'text',
                                content: b.content || '',
                                x: b.x != null ? Number(b.x) : 0,
                                y: b.y != null ? Number(b.y) : 0
                            };
                        }
                    });
                    
                    dispatch({ type: 'SET_BLOCKS', payload: typedBlocks });
                } catch (error) {
                    console.error("Supabase Veri Çekme Hatası:", error);
                }
            } else {
                // Ziyaretçi local fallbacks
                const savedTodos = localStorage.getItem('hezarf_todos');
                if (savedTodos) {
                    dispatch({ type: 'SET_TODOS', payload: JSON.parse(savedTodos) });
                }

                const savedBlocks = localStorage.getItem('hezarf_canvas_blocks');
                if (savedBlocks) {
                    dispatch({ type: 'SET_BLOCKS', payload: JSON.parse(savedBlocks) });
                }
            }
        };
        loadData();
    }, [user, authLoading]);

    // Ziyaretçiler için local storage güncellemeleri
    useEffect(() => {
        if (!user) {
            if (state.todos.length > 0) {
                localStorage.setItem('hezarf_todos', JSON.stringify(state.todos));
            } else {
                localStorage.removeItem('hezarf_todos');
            }
        }
    }, [state.todos, user]);

    useEffect(() => {
        if (!user) {
            if (state.blocks.length > 0) {
                localStorage.setItem('hezarf_canvas_blocks', JSON.stringify(state.blocks));
            } else {
                localStorage.removeItem('hezarf_canvas_blocks');
            }
        }
    }, [state.blocks, user]);

    // Klasik Todo CRUD Fonksiyonları
    const addTodo = async (title: string) => {
        if (!title.trim()) return;

        const newTodo: Omit<Todo, 'id'> & { id?: string; user_id?: string; created_at?: string } = {
            title,
            is_completed: false,
            completed_at: null
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
            const localTodo: Todo = {
                ...newTodo,
                id: Math.random().toString(36).substr(2, 9),
                created_at: new Date().toISOString()
            };
            dispatch({ type: 'ADD_TODO', payload: localTodo });
        }
    };

    const toggleTodo = async (id: string) => {
        const todoToToggle = state.todos.find(t => t.id === id);
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
                    dispatch({ type: 'TOGGLE_TODO', payload: id }); // Geri al
                    throw error;
                }
            } catch (error) {
                console.error("Supabase Toggle Todo Error:", error);
            }
        }
    };

    const deleteTodo = async (id: string) => {
        const todoToDelete = state.todos.find(t => t.id === id);
        dispatch({ type: 'DELETE_TODO', payload: id });

        if (user) {
            try {
                const { error } = await supabase
                    .from('todos')
                    .delete()
                    .eq('id', id);

                if (error) {
                    if (todoToDelete) dispatch({ type: 'ADD_TODO', payload: todoToDelete }); // Geri al
                    throw error;
                }
            } catch (error) {
                console.error("Supabase Delete Todo Error:", error);
            }
        }
    };

    // Canvas Blok Yönetim Fonksiyonları
    const addBlock = async (weekId: string, type: 'text' | 'todo') => {
        const newBlockBase = {
            week_id: weekId,
            type,
            x: 0,
            y: 0,
            ...(type === 'text' ? { content: '' } : { title: 'Görev Listesi', tasks: [] })
        };

        if (user) {
            try {
                const { data, error } = await supabase
                    .from('canvas_blocks')
                    .insert([{ ...newBlockBase, user_id: user.id }])
                    .select()
                    .single();

                if (error) throw error;
                if (data) {
                    const typedBlock: CanvasBlock = type === 'todo' ? {
                        id: data.id,
                        weekId: data.week_id,
                        type: 'todo',
                        title: data.title || 'Görev Listesi',
                        tasks: data.tasks || [],
                        x: Number(data.x) || 0,
                        y: Number(data.y) || 0
                    } : {
                        id: data.id,
                        weekId: data.week_id,
                        type: 'text',
                        content: data.content || '',
                        x: Number(data.x) || 0,
                        y: Number(data.y) || 0
                    };
                    dispatch({ type: 'ADD_BLOCK', payload: typedBlock });
                }
            } catch (error) {
                console.error("Supabase Add Block Error:", error);
            }
        } else {
            // Local fallback
            const localBlock = {
                id: Math.random().toString(36).substr(2, 9),
                weekId,
                type,
                x: 0,
                y: 0,
                ...(type === 'text' ? { content: '' } : { title: 'Görev Listesi', tasks: [] })
            } as CanvasBlock;
            dispatch({ type: 'ADD_BLOCK', payload: localBlock });
        }
    };

    const updateBlock = async (blockId: string, updates: Partial<CanvasBlock>) => {
        dispatch({ type: 'UPDATE_BLOCK', payload: { id: blockId, updates } });

        if (user) {
            try {
                // Tip alanlarını veritabanı isimlendirmesine uyarla
                const dbUpdates: any = {};
                if (updates.x !== undefined) dbUpdates.x = updates.x;
                if (updates.y !== undefined) dbUpdates.y = updates.y;
                if (updates.weekId !== undefined) dbUpdates.week_id = updates.weekId;
                
                if (updates.type === 'todo') {
                    if (updates.title !== undefined) dbUpdates.title = updates.title;
                    if (updates.tasks !== undefined) dbUpdates.tasks = updates.tasks;
                } else if (updates.type === 'text') {
                    if (updates.content !== undefined) dbUpdates.content = updates.content;
                }

                const { error } = await supabase
                    .from('canvas_blocks')
                    .update(dbUpdates)
                    .eq('id', blockId);

                if (error) throw error;
            } catch (error) {
                console.error("Supabase Update Block Error:", error);
            }
        }
    };

    const deleteBlock = async (blockId: string) => {
        const blockToDelete = state.blocks.find(b => b.id === blockId);
        dispatch({ type: 'DELETE_BLOCK', payload: blockId });

        if (user) {
            try {
                const { error } = await supabase
                    .from('canvas_blocks')
                    .delete()
                    .eq('id', blockId);

                if (error) {
                    if (blockToDelete) dispatch({ type: 'ADD_BLOCK', payload: blockToDelete }); // Geri al
                    throw error;
                }
            } catch (error) {
                console.error("Supabase Delete Block Error:", error);
            }
        }
    };

    // Blok İçi Görev Yönetim Fonksiyonları
    const addTaskToBlock = async (blockId: string, title: string) => {
        if (!title.trim()) return;

        const block = state.blocks.find(b => b.id === blockId);
        if (!block || block.type !== 'todo') return;

        const newTask: Task = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            isCompleted: false,
            assignedDate: null,
            totalTimeSpent: 0
        };

        dispatch({ type: 'ADD_TASK', payload: { blockId, task: newTask } });

        if (user) {
            const updatedTasks = [...block.tasks, newTask];
            try {
                const { error } = await supabase
                    .from('canvas_blocks')
                    .update({ tasks: updatedTasks })
                    .eq('id', blockId);

                if (error) throw error;
            } catch (error) {
                console.error("Supabase Add Task to Block Error:", error);
            }
        }
    };

    const toggleTaskInBlock = async (blockId: string, taskId: string) => {
        const block = state.blocks.find(b => b.id === blockId);
        if (!block || block.type !== 'todo') return;

        dispatch({ type: 'TOGGLE_TASK', payload: { blockId, taskId } });

        if (user) {
            const updatedTasks = block.tasks.map(t =>
                t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
            );
            try {
                const { error } = await supabase
                    .from('canvas_blocks')
                    .update({ tasks: updatedTasks })
                    .eq('id', blockId);

                if (error) throw error;
            } catch (error) {
                console.error("Supabase Toggle Task in Block Error:", error);
            }
        }
    };

    const deleteTaskFromBlock = async (blockId: string, taskId: string) => {
        const block = state.blocks.find(b => b.id === blockId);
        if (!block || block.type !== 'todo') return;

        dispatch({ type: 'DELETE_TASK', payload: { blockId, taskId } });

        if (user) {
            const updatedTasks = block.tasks.filter(t => t.id !== taskId);
            try {
                const { error } = await supabase
                    .from('canvas_blocks')
                    .update({ tasks: updatedTasks })
                    .eq('id', blockId);

                if (error) throw error;
            } catch (error) {
                console.error("Supabase Delete Task from Block Error:", error);
            }
        }
    };

    const assignTaskToDate = async (blockId: string, taskId: string, date: string | null) => {
        const block = state.blocks.find(b => b.id === blockId);
        if (!block || block.type !== 'todo') return;

        dispatch({ type: 'ASSIGN_TASK_DATE', payload: { blockId, taskId, date } });

        if (user) {
            const updatedTasks = block.tasks.map(t =>
                t.id === taskId ? { ...t, assignedDate: date } : t
            );
            try {
                const { error } = await supabase
                    .from('canvas_blocks')
                    .update({ tasks: updatedTasks })
                    .eq('id', blockId);

                if (error) throw error;
            } catch (error) {
                console.error("Supabase Assign Task Date Error:", error);
            }
        }
    };

    const updateTaskTime = async (blockId: string, taskId: string, durationMs: number) => {
        const block = state.blocks.find(b => b.id === blockId);
        if (!block || block.type !== 'todo') return;

        dispatch({ type: 'UPDATE_TASK_TIME', payload: { blockId, taskId, durationMs } });

        if (user) {
            const updatedTasks = block.tasks.map(t =>
                t.id === taskId ? { ...t, totalTimeSpent: t.totalTimeSpent + durationMs } : t
            );
            try {
                const { error } = await supabase
                    .from('canvas_blocks')
                    .update({ tasks: updatedTasks })
                    .eq('id', blockId);

                if (error) throw error;
            } catch (error) {
                console.error("Supabase Update Task Time Error:", error);
            }
        }
    };

    const contextValue = useMemo(() => ({
        todos: state.todos,
        blocks: state.blocks,
        addTodo,
        toggleTodo,
        deleteTodo,
        addBlock,
        updateBlock,
        deleteBlock,
        addTaskToBlock,
        toggleTaskInBlock,
        deleteTaskFromBlock,
        assignTaskToDate,
        updateTaskTime
    }), [state.todos, state.blocks, user]);

    return (
        <TodoContext.Provider value={contextValue}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodo = () => {
    const context = useContext(TodoContext);
    if (context === undefined) {
        throw new Error('useTodo must be used within a TodoProvider');
    }
    return context;
};
