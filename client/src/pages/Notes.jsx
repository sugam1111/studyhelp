import React, { useEffect, useState } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from '../api';
import { Plus, Trash2, Save, FileText } from 'lucide-react';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ title: '', content: '', subject: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const { data } = await getNotes();
            setNotes(data.reverse()); // Newest first
        } catch (error) {
            console.error("Failed to fetch notes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectNote = (note) => {
        setSelectedNote(note);
        setFormData({ title: note.title, content: note.content, subject: note.subject });
        setIsEditing(true);
    };

    const handleNewNote = () => {
        setSelectedNote(null);
        setFormData({ title: '', content: '', subject: '' });
        setIsEditing(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.title) return;

        try {
            if (selectedNote) {
                // Update
                const { data } = await updateNote(selectedNote.id, formData);
                setNotes(notes.map(n => n.id === selectedNote.id ? data : n));
                setSelectedNote(data);
            } else {
                // Create
                const { data } = await createNote(formData);
                setNotes([data, ...notes]);
                setSelectedNote(data);
            }
            alert('Note saved!');
        } catch (error) {
            console.error(error);
            alert('Failed to save note');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await deleteNote(id);
            setNotes(notes.filter(n => n.id !== id));
            if (selectedNote && selectedNote.id === id) {
                setSelectedNote(null);
                setIsEditing(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="container">Loading notes...</div>;

    return (
        <div className="container animate-fade-in" style={{ height: 'calc(100vh - 100px)', display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '2rem' }}>

            {/* Sidebar List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', overflowY: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: 0 }}>My Notes</h2>
                    <button onClick={handleNewNote} className="btn" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                        <Plus size={20} />
                    </button>
                </div>

                {notes.length === 0 && <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No notes yet. Create one!</div>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {notes.map(note => (
                        <div
                            key={note.id}
                            onClick={() => handleSelectNote(note)}
                            className="card"
                            style={{
                                cursor: 'pointer',
                                padding: '1rem',
                                borderColor: selectedNote?.id === note.id ? 'var(--primary)' : 'var(--border)',
                                background: selectedNote?.id === note.id ? 'var(--bg-card-hover)' : 'var(--bg-card)'
                            }}
                        >
                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{note.title}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{note.subject || 'General'}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editor Area */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2rem' }}>
                {isEditing ? (
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <input
                                className="input"
                                placeholder="Note Title"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                autoFocus
                                style={{ fontSize: '1.25rem', fontWeight: 'bold' }}
                            />
                            <input
                                className="input"
                                placeholder="Subject (Optional)"
                                value={formData.subject}
                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                style={{ width: '200px' }}
                            />
                        </div>

                        <textarea
                            className="input"
                            style={{
                                flex: 1,
                                resize: 'none',
                                fontFamily: 'monospace',
                                lineHeight: '1.5',
                                padding: '1rem'
                            }}
                            placeholder="Write your notes here..."
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                        />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {selectedNote && (
                                <button type="button" onClick={() => handleDelete(selectedNote.id)} className="btn btn-danger">
                                    <Trash2 size={18} /> Delete
                                </button>
                            )}
                            <div style={{ flex: 1 }}></div>
                            <button type="submit" className="btn">
                                <Save size={18} /> Save Note
                            </button>
                        </div>
                    </form>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                        <FileText size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <div style={{ fontSize: '1.25rem' }}>Select a note to view or create a new one.</div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Notes;
