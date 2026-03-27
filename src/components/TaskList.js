import { useEffect, useState } from "react";
import api from "../api/api";
import { Card, CardContent, Button, MenuItem, Select } from "@mui/material";

export default function TaskList({ userId }) {

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get(`/tasks/user/${userId}`);
    setTasks(res.data);
  };

  // ✅ DELETE TASK
  const remove = async id => {
    await api.delete(`/tasks/${id}`);
    load();
  };

  // ✅ UPDATE STATUS
  const updateStatus = async (task, newStatus) => {

    const updatedTask = {
      ...task,
      status: newStatus
    };

    await api.put(`/tasks/${task.id}`, updatedTask);
    load();
  };

  return (
    <>
      {tasks.map(t => (
        <Card key={t.id} sx={{ mb:2 }}>
          <CardContent>

            <h3>{t.title}</h3>
            <p>{t.description}</p>

            <p>Priority: {t.priority}</p>
            

            {/* ⭐ STATUS DROPDOWN */}
            <Select
              value={t.status}
              onChange={e => updateStatus(t, e.target.value)}
              size="small"
              sx={{ mr:2 }}
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="DONE">Done</MenuItem>
            </Select>

            {/* DELETE BUTTON */}
            <Button
              color="error"
              onClick={() => remove(t.id)}
            >
              Delete
            </Button>

          </CardContent>
        </Card>
      ))}
    </>
  );
}