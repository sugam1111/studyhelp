import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export const getTasks = () => api.get('/tasks');
export const createTask = (task) => api.post('/tasks', task);
export const updateTask = (id, updates) => api.patch(`/tasks/${id}`, updates);

export const getSessions = (date) => api.get(`/sessions${date ? `?date=${date}` : ''}`);
export const createSession = (session) => api.post('/sessions', session);

export const getNotes = () => api.get('/notes');
export const createNote = (note) => api.post('/notes', note);
export const updateNote = (id, note) => api.put(`/notes/${id}`, note);
export const deleteNote = (id) => api.delete(`/notes/${id}`);

export default api;
