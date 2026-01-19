# StudyHelp App

A simple study helper application with a task manager and focus timer.

## Tech Stack

- **Frontend**: React (Vite), CSS Variables (Dark Theme), Axios, React Router
- **Backend**: Node.js, Express
- **Storage**: JSON files (Local filesystem persistence)

## Features

- **Dashboard**: View today's study stats and recent sessions.
- **Tasks**: Add and manage study tasks.
- **Timer**: Focus timer for selected tasks with session tracking.

## Setup Instructions

### Prerequisites
- Node.js installed on your machine.

### 1. Backend Setup
Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Start the server:

```bash
node index.js
# OR
npm start
```

The server will run on `http://localhost:5000`.

### 2. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies:

```bash
cd client
npm install
```

Start the development server:

```bash
npm run dev
```

The client will run on `http://localhost:5173`.

## Usage
1. Open the app in your browser.
2. Go to **Tasks** and add a subject/topic.
3. Go to **Timer**, select your task, and start a study session.
4. When done, save the session to see it on your **Dashboard**.
