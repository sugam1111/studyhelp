import React, { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask } from '../api';
import { Plus, Check, BookOpen } from 'lucide-react';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ subject: '', title: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const { data } = await getTasks();
            setTasks(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newTask.subject || !newTask.title) return;
        try {
            const { data } = await createTask(newTask);
            setTasks([...tasks, data]);
            setNewTask({ subject: '', title: '' });
        } catch (error) {
            console.error(error);
        }
    };

    const toggleTask = async (id, currentStatus) => {
        try {
            const { data } = await updateTask(id, { isCompleted: !currentStatus });
            setTasks(tasks.map(t => t.id === id ? data : t));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container animate-fade-in">
            <h1 className="title">Tasks</h1>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginTop: 0 }}>Add New Task</h3>
                <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '1rem' }}>
                    <input
                        className="input"
                        style={{ marginBottom: 0 }}
                        placeholder="Subject (e.g. Math)"
                        value={newTask.subject}
                        onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                    />
                    <input
                        className="input"
                        style={{ marginBottom: 0 }}
                        placeholder="What do you need to study?"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                    <button type="submit" className="btn">
                        <Plus size={20} /> Add
                    </button>
                </form>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tasks.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No tasks found.</div>}

                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="card"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem 1.5rem',
                            opacity: task.isCompleted ? 0.6 : 1
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button
                                onClick={() => toggleTask(task.id, task.isCompleted)}
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    border: `2px solid ${task.isCompleted ? 'var(--success)' : 'var(--text-muted)'}`,
                                    background: task.isCompleted ? 'var(--success)' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    cursor: 'pointer',
                                    padding: 0
                                }}
                            >
                                {task.isCompleted && <Check size={14} />}
                            </button>
                            <div>
                                <div style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 500,
                                    textDecoration: task.isCompleted ? 'line-through' : 'none'
                                }}>
                                    {task.title}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                    <BookOpen size={14} /> {task.subject}
                                </div>
                            </div>
                        </div>
                        {task.isCompleted && <span style={{ color: 'var(--success)', fontSize: '0.875rem', fontWeight: 600 }}>Done</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tasks;
