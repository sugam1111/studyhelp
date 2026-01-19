const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const NOTES_FILE = path.join(DATA_DIR, 'notes.json');

app.use(cors());
app.use(express.json());

// Helper to read data
const readData = (file) => {
    if (!fs.existsSync(file)) {
        // Create file if it doesn't exist
        writeData(file, []);
        return [];
    }
    try {
        const data = fs.readFileSync(file, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading file:", err);
        return [];
    }
};

// Helper to write data
const writeData = (file, data) => {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR);
        }
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error writing file:", err);
    }
};

// --- TASKS ENDPOINTS ---

// GET /api/tasks
app.get('/api/tasks', (req, res) => {
    const tasks = readData(TASKS_FILE);
    res.json(tasks);
});

// POST /api/tasks
app.post('/api/tasks', (req, res) => {
    const { subject, title } = req.body;
    if (!subject || !title) return res.status(400).json({ error: "Missing fields" });

    const tasks = readData(TASKS_FILE);
    const newTask = {
        id: uuidv4(),
        subject,
        title,
        isCompleted: false,
        createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    writeData(TASKS_FILE, tasks);
    res.status(201).json(newTask);
});

// PATCH /api/tasks/:id
app.patch('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { isCompleted } = req.body;

    let tasks = readData(TASKS_FILE);
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) return res.status(404).json({ error: "Task not found" });

    if (typeof isCompleted !== 'undefined') {
        tasks[taskIndex].isCompleted = isCompleted;
    }
    writeData(TASKS_FILE, tasks);
    res.json(tasks[taskIndex]);
});

// --- SESSIONS ENDPOINTS ---

// GET /api/sessions
app.get('/api/sessions', (req, res) => {
    const { date } = req.query;
    let sessions = readData(SESSIONS_FILE);

    if (date === 'today') {
        const today = new Date().toISOString().split('T')[0];
        sessions = sessions.filter(s => s.timestamp.startsWith(today));
    }

    res.json(sessions);
});

// POST /api/sessions
app.post('/api/sessions', (req, res) => {
    const { taskId, minutes } = req.body;
    if (!taskId || !minutes) return res.status(400).json({ error: "Missing fields" });

    const sessions = readData(SESSIONS_FILE);
    const tasks = readData(TASKS_FILE);
    const task = tasks.find(t => t.id === taskId);

    const newSession = {
        id: uuidv4(),
        taskId,
        taskTitle: task ? task.title : 'Unknown Task',
        minutes: parseInt(minutes),
        timestamp: new Date().toISOString()
    };

    sessions.push(newSession);
    writeData(SESSIONS_FILE, sessions);
    res.status(201).json(newSession);
});

// --- NOTES ENDPOINTS ---

// GET /api/notes
app.get('/api/notes', (req, res) => {
    const notes = readData(NOTES_FILE);
    res.json(notes);
});

// POST /api/notes
app.post('/api/notes', (req, res) => {
    const { title, content, subject } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const notes = readData(NOTES_FILE);
    const newNote = {
        id: uuidv4(),
        title,
        content: content || "",
        subject: subject || "General",
        updatedAt: new Date().toISOString()
    };
    notes.push(newNote);
    writeData(NOTES_FILE, notes);
    res.status(201).json(newNote);
});

// PUT /api/notes/:id
app.put('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    const { title, content, subject } = req.body;

    let notes = readData(NOTES_FILE);
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) return res.status(404).json({ error: "Note not found" });

    notes[index] = { ...notes[index], title, content, subject, updatedAt: new Date().toISOString() };
    writeData(NOTES_FILE, notes);
    res.json(notes[index]);
});

// DELETE /api/notes/:id
app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    let notes = readData(NOTES_FILE); // Should read notes file, not tasks
    const newNotes = notes.filter(n => n.id !== id);
    if (newNotes.length === notes.length) return res.status(404).json({ error: "Note not found" });

    writeData(NOTES_FILE, newNotes);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
