import React, { useEffect, useState } from 'react';
import { getSessions, getTasks } from '../api';
import { Clock, CheckCircle, ListTodo, Play, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [sessions, setSessions] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [{ data: sessionData }, { data: taskData }] = await Promise.all([
                getSessions(),
                getTasks()
            ]);

            // Sort sessions: recent first
            sessionData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setSessions(sessionData);
            setTasks(taskData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(s => s.timestamp.startsWith(today));

    const totalMinutes = todaySessions.reduce((acc, curr) => acc + curr.minutes, 0);
    const sessionCount = todaySessions.length;
    const pendingTasks = tasks.filter(t => !t.isCompleted);

    if (loading) return <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>Loading visuals...</div>;

    return (
        <div className="container animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="title" style={{ margin: 0 }}>Dashboard</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/tasks" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                        <Plus size={18} /> New Task
                    </Link>
                    <Link to="/timer" className="btn" style={{ textDecoration: 'none' }}>
                        <Play size={18} /> Start Focus
                    </Link>
                </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '50%', color: 'var(--secondary)' }}>
                            <Clock size={24} />
                        </div>
                        <h3 style={{ margin: 0, color: 'var(--text-muted)' }}>Today's Focus</h3>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                        {totalMinutes} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>min</span>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '50%', color: 'var(--primary)' }}>
                            <CheckCircle size={24} />
                        </div>
                        <h3 style={{ margin: 0, color: 'var(--text-muted)' }}>Sessions</h3>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                        {sessionCount}
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', color: 'var(--danger)' }}>
                            <ListTodo size={24} />
                        </div>
                        <h3 style={{ margin: 0, color: 'var(--text-muted)' }}>Pending Tasks</h3>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                        {pendingTasks.length}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

                {/* Recent History */}
                <div>
                    <h2 style={{ marginBottom: '1.5rem' }}>Recent Sessions</h2>
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        {sessions.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                No study sessions recorded yet.
                            </div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Task</th>
                                        <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessions.slice(0, 5).map((session) => (
                                        <tr key={session.id} style={{ borderTop: '1px solid var(--border)' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: 500 }}>{session.taskTitle}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            </td>
                                            <td style={{ padding: '1rem', color: 'var(--secondary)', fontWeight: 600 }}>{session.minutes} min</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Pending Tasks Quick View */}
                <div>
                    <h2 style={{ marginBottom: '1.5rem' }}>Up Next</h2>
                    <div className="card" style={{ padding: '1rem' }}>
                        {pendingTasks.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
                                No pending tasks! Good job.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {pendingTasks.slice(0, 5).map(task => (
                                    <div key={task.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem',
                                        background: 'var(--bg-dark)',
                                        borderRadius: '0.5rem',
                                        border: '1px solid var(--border)'
                                    }}>
                                        <div style={{ overflow: 'hidden' }}>
                                            <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{task.subject}</div>
                                        </div>
                                        <Link to="/timer" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', marginLeft: '1rem', flexShrink: 0 }}>
                                            Start
                                        </Link>
                                    </div>
                                ))}
                                {pendingTasks.length > 5 && (
                                    <Link to="/tasks" style={{ textAlign: 'center', display: 'block', marginTop: '0.5rem', color: 'var(--primary)', fontSize: '0.9rem' }}>
                                        View all {pendingTasks.length} tasks
                                    </Link>
                                )}
                            </div>
                        )}
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                            <Link to="/tasks" style={{ color: 'var(--secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <Plus size={14} /> Add new task
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
