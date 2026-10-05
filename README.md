# Week 2 - Task Manager Frontend

React frontend for the Week 1 Task CRUD API.

## Features

- List tasks
- Create tasks
- Edit tasks
- Delete tasks
- Loading state
- API error messages
- Responsive UI
- API calls kept in `src/services/api.js`

## Backend requirement

Start the Week 1 backend first. The frontend expects:

`http://localhost:3000/api/tasks`

If your backend uses another URL, change `API_BASE_URL` in `src/services/api.js`.

## Run

```bash
npm install
npm run dev
```

Open the URL shown by Vite, normally:

`http://localhost:5173`

## Production build

```bash
npm run build
```

## CRUD demo

1. Create a task.
2. Confirm it appears in the list.
3. Click Edit and update it.
4. Click Delete.
5. Refresh the page to confirm the API data is being used.
