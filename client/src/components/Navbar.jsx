import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, Timer, Notebook } from 'lucide-react';

const Navbar = () => {
    const navItems = [
        { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/tasks', label: 'Tasks', icon: <ListTodo size={20} /> },
        { path: '/timer', label: 'Timer', icon: <Timer size={20} /> },
        { path: '/notes', label: 'Notes', icon: <Notebook size={20} /> },
    ];

    return (
        <nav style={{
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border)',
            padding: '1rem 0'
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, var(--secondary), var(--primary))', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                    StudyHelp
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                color: isActive ? 'white' : 'var(--text-muted)',
                                background: isActive ? 'var(--primary)' : 'transparent',
                                fontWeight: isActive ? 600 : 400,
                                transition: 'all 0.2s'
                            })}
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
