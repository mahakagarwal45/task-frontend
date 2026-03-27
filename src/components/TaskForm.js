import { useState } from "react";
import api from "../api/api";
import { Paper, TextField, Button, MenuItem } from "@mui/material";

export default function TaskForm({ userId }) {

  const [task, setTask] = useState({
    title:"",
    description:"",
    priority:"MEDIUM"
  });

  const submit = async e => {
    e.preventDefault();

    await api.post("/tasks", {
      ...task,
      user:{ id:userId }
    });

    window.location.reload();
  };

  return (
    <Paper sx={{ p:3, mb:3 }}>
      <h3>Create Task</h3>

      <form onSubmit={submit}>
        <TextField label="Title" fullWidth margin="normal"
          onChange={e=>setTask({...task,title:e.target.value})}
        />

        <TextField label="Description" fullWidth multiline rows={3}
          onChange={e=>setTask({...task,description:e.target.value})}
        />

        <TextField select label="Priority" fullWidth margin="normal"
          onChange={e=>setTask({...task,priority:e.target.value})}
        >
          <MenuItem value="LOW">Low</MenuItem>
          <MenuItem value="MEDIUM">Medium</MenuItem>
          <MenuItem value="HIGH">High</MenuItem>
        </TextField>

        <TextField
  type="date"
  fullWidth
  onChange={e => setTask({...task, dueDate:e.target.value})}
/>

        <Button type="submit" variant="contained">
          Add Task
        </Button>
      </form>
    </Paper>
  );
}