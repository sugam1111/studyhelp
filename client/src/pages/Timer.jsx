import React, { useState, useEffect, useRef } from 'react';
import { getTasks, createSession } from '../api';
import { Play, Square, Save, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Timer = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState('');
    const [duration, setDuration] = useState(25);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const timerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const { data } = await getTasks();
                setTasks(data.filter(t => !t.isCompleted));
            } catch (err) {
                console.error(err);
            }
        };
        fetchTasks();
    }, []);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            setIsFinished(true);
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft]);

    const toggleTimer = () => {
        if (!selectedTask) {
            alert("Please select a task first!");
            return;
        }
        setIsActive(!isActive);
    };

    const handleReset = () => {
        setIsActive(false);
        setIsFinished(false);
        setTimeLeft(duration * 60);
    };

    const handleSave = async () => {
        if (!selectedTask) return;
        try {
            // Calculate actual time spent if stopped early? 
            // Requirement says "When session finishes", implying full duration usually, 
            // but let's save the configured duration or elapsed duration?
            // "Start a timer... When session finishes, save".
            // Let's assume we save the full duration if it finished naturally, 
            // or maybe we should allow saving partial if stopped? 
            // Simplest interpretation: Save when finished (natural end or user clicks 'Finish' explicitly).
            // Let's stick to the set duration for simplicity as per "minutes" field requirements often matching the "pomodoro" style.

            const minutesStudied = isFinished ? duration : Math.floor((duration * 60 - timeLeft) / 60);

            if (minutesStudied === 0) {
                alert("Study for at least 1 minute to save!");
                return;
            }

            await createSession({
                taskId: selectedTask,
                minutes: minutesStudied
            });
            alert('Session saved!');
            navigate('/');
        } catch (err) {
            console.error(err);
            alert('Failed to save session');
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleDurationChange = (e) => {
        const val = parseInt(e.target.value) || 0;
        setDuration(val);
        if (!isActive) setTimeLeft(val * 60);
    };

    return (
        <div className="container animate-fade-in" style={{ textAlign: 'center', maxWidth: '600px' }}>
            <h1 className="title">Focus Timer</h1>

            <div className="card" style={{ padding: '3rem 2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Working on:</label>
                    <select
                        className="input"
                        style={{ padding: '0.75rem', fontSize: '1.2rem', textAlign: 'center' }}
                        value={selectedTask}
                        onChange={(e) => setSelectedTask(e.target.value)}
                        disabled={isActive}
                    >
                        <option value="">Select a Task</option>
                        {tasks.map(t => (
                            <option key={t.id} value={t.id}>{t.title} ({t.subject})</option>
                        ))}
                    </select>
                </div>

                <div style={{ fontSize: '6rem', fontWeight: 700, fontFamily: 'monospace', marginBottom: '2rem', letterSpacing: '4px', color: isActive ? 'var(--primary)' : 'var(--text-main)' }}>
                    {formatTime(timeLeft)}
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                    {!isActive && !isFinished && (
                        <button className="btn" onClick={toggleTimer} style={{ fontSize: '1.25rem', padding: '1rem 2rem' }}>
                            <Play fill="currentColor" /> Start
                        </button>
                    )}

                    {isActive && (
                        <button className="btn btn-danger" onClick={toggleTimer} style={{ fontSize: '1.25rem', padding: '1rem 2rem' }}>
                            <Square fill="currentColor" /> Pause
                        </button>
                    )}

                    {(isFinished || (!isActive && timeLeft !== duration * 60)) && (
                        <button className="btn btn-secondary" onClick={handleSave} style={{ fontSize: '1.25rem', padding: '1rem 2rem' }}>
                            <Save /> Finish & Save
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Duration (min):</span>
                    <input
                        type="number"
                        className="input"
                        style={{ width: '80px', margin: 0, textAlign: 'center' }}
                        value={duration}
                        onChange={handleDurationChange}
                        disabled={isActive}
                    />
                </div>
            </div>
        </div>
    );
};

export default Timer;
