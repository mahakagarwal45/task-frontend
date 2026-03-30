import { useState, useEffect } from "react";
import api from "../api/api";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import {
  Box,
  Drawer,
  List,
  ListItem,
  IconButton,
  MenuItem,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  TextField,
  Grid,
  Chip,
  Divider,
  Avatar
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";

const drawerWidth = 240;

export default function UserDashboard({ user, onLogout }) {

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [notifications, setNotifications] = useState([]);
const [anchorEl, setAnchorEl] = useState(null);  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "HIGH",
    dueDate: "",
    status: "PENDING"
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
  loadTasks();

  const interval = setInterval(() => {
    loadTasks();
  }, 5000);

  return () => clearInterval(interval);
}, [loadTasks]);

  // LOAD TASKS
 const loadTasks = useCallback(async () => {
  setLoading(true);
  if (!user?.id) return;   
  const res = await api.get(`/tasks/user/${user.id}`);
    setTasks(res.data);

  const newTasks = res.data.filter(
    (t) => t.status === "PENDING" );

  setNotifications(newTasks);

},[user]);

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    await api.put(`/tasks/${id}/status?status=${status}`);
    loadTasks();
  };

  const [loading, setLoading] = useState(false);

  const submit = async () => {

  if (!form.title?.trim()) {
    alert("Title is required");
    return;
  }

  if (!form.description?.trim()) {
    alert("Description is required");
    return;
  }

  if (!form.dueDate) {
    alert("Due date is required");
    return;
  }

  try {
    const data = {
      title: form.title,
      description: form.description,
      priority: form.priority,
      dueDate: form.dueDate,
      status: form.status,
      user: {
        id: user.id   
      }
    };
if (editingId) {
  await api.put(`/tasks/${editingId}`, data);
} else {
  await api.post("/tasks", data);
}
    setForm({
      title: "",
      description: "",
      priority: "HIGH",
      dueDate: ""
    });

    loadTasks();

  } catch (err) {
    console.error(err);
    alert("Task creation failed");
  }
};

  // DELETE
  const remove = async (id) => {
    await api.delete(`/tasks/${id}`);
    loadTasks();
  };

  // EDIT
  const edit = (task) => {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      status: task.status
    });
    setFilter("ALL");
  };

  // FILTER
  const filteredTasks =
    filter === "ALL"
      ? tasks
      : tasks.filter((t) => t.status === filter);

  // SIDEBAR
  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6">Task Manager</Typography>
      </Toolbar>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setFilter("ALL")}>
            <DashboardIcon sx={{ mr: 1 }} />
            <ListItemText primary={`Dashboard (${tasks.length})`} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => setFilter("PENDING")}>
            <PendingIcon sx={{ mr: 1 }} />
            <ListItemText
              primary={`Pending (${tasks.filter(t => t.status==="PENDING").length})`}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => setFilter("IN_PROGRESS")}>
            <AssignmentIcon sx={{ mr: 1 }} />
            <ListItemText
              primary={`In Progress (${tasks.filter(t => t.status==="IN_PROGRESS").length})`}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => setFilter("DONE")}>
            <CheckCircleIcon sx={{ mr: 1 }} />
            <ListItemText
              primary={`Completed (${tasks.filter(t => t.status==="DONE").length})`}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", bgcolor: "#f4f6f8", minHeight: "100vh" }}>

      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: { width: drawerWidth }
        }}
      >
        {drawer}
      </Drawer>

      {/* MAIN */}
      <Box component="main" sx={{ flexGrow: 1 }}>

        {/* TOPBAR */}
        <AppBar position="static">
          <Toolbar>
            <Typography sx={{ flexGrow: 1 }}>
              Welcome, {user.name}
            </Typography>

            <Avatar sx={{ mr: 2 }}>
  {user?.name ? user.name.charAt(0) : "U"}
</Avatar>
            <IconButton
  color="inherit"
  onClick={(e) => setAnchorEl(e.currentTarget)}
>
  <Badge badgeContent={notifications.length} color="error">
    <NotificationsIcon />
  </Badge>
</IconButton>

            <Button color="inherit" onClick={onLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={() => setAnchorEl(null)}
>
  {notifications.length === 0 ? (
    <MenuItem>No new tasks</MenuItem>
  ) : (
    notifications.map((n) => (
      <MenuItem
        key={n.id}
        onClick={() => {
          
          setNotifications((prev) =>
            prev.filter((x) => x.id !== n.id)
          );
          setAnchorEl(null);
        }}
      >
        📌 {n.title}
      </MenuItem>
    ))
  )}

  {notifications.length > 0 && (
    <MenuItem onClick={() => setNotifications([])}>
      Clear All
    </MenuItem>
  )}
</Menu>


        <Container sx={{ mt: 4 }}>

          {/* DASHBOARD */}
          {filter === "ALL" && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={3}>
                <Card sx={{ p: 2, bgcolor: "#1976d2", color: "white" }}>
                  <Typography>Total Tasks</Typography>
                  <Typography variant="h4">{tasks.length}</Typography>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card sx={{ p: 2, bgcolor: "#ff9800", color: "white" }}>
                  <Typography>Pending</Typography>
                  <Typography variant="h4">
                    {tasks.filter(t => t.status==="PENDING").length}
                  </Typography>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card sx={{ p: 2, bgcolor: "#a31297", color: "white" }}>
                  <Typography>In Progress</Typography>
                  <Typography variant="h4">
                    {tasks.filter(t => t.status==="IN_PROGRESS").length}
                  </Typography>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card sx={{ p: 2, bgcolor: "#2e7d32", color: "white" }}>
                  <Typography>Completed</Typography>
                  <Typography variant="h4">
                    {tasks.filter(t => t.status==="DONE").length}
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* CREATE TASK */}
          {filter === "ALL" && (
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6">Create Task</Typography>

                <TextField
                  fullWidth
                  label="Title"
                  sx={{ mb: 2 }}
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  sx={{ mb: 2 }}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />

                <TextField
                  select
                  fullWidth
                  label="Priority"
                  sx={{ mb: 2 }}
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value })
                  }
                >
                  <MenuItem value="LOW">LOW</MenuItem>
                  <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                  <MenuItem value="HIGH">HIGH</MenuItem>
                </TextField>

                <TextField
                  type="date"
                  fullWidth
                  label="Due Date"
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                />

                <Button variant="contained" onClick={submit}>
                  {editingId ? "Update Task" : "Add Task"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* TASK LIST */}
          {filter !== "ALL" && (
            <Grid container spacing={3}>
              {filteredTasks.map((t) => (
                <Grid item xs={12} md={4} key={t.id}>
                  <Card>
                    <CardContent>

                      <Typography variant="h6">
                        {t.title}
                      </Typography>

                      <Typography sx={{ mb: 1 }}>
                        {t.description}
                      </Typography>
<Typography variant="body2" color="text.secondary">
  Created: {t.createdAt ? new Date(t.createdAt).toLocaleString() : "N/A"}
</Typography>

<Typography variant="body2" color="text.secondary">
  Updated: {t.updatedAt ? new Date(t.updatedAt).toLocaleString() : new Date(t.createdAt).toLocaleString()}
</Typography>
                      

                      <Chip
                        label={t.priority}
                        color={
                          t.priority === "HIGH"
                            ? "error"
                            : t.priority === "MEDIUM"
                            ? "warning"
                            : "success"
                        }
                        sx={{ mr: 1 }}
                      />

                      <TextField
                        select
                        size="small"
                        value={t.status}
                        onChange={(e) =>
                          updateStatus(t.id, e.target.value)
                        }
                      >
                        <MenuItem value="PENDING">PENDING</MenuItem>
                        <MenuItem value ="IN_PROGRESS">IN_PROGRESS</MenuItem>
                        <MenuItem value="DONE">DONE</MenuItem>
                      </TextField>

                      <Chip
                        label={`Due: ${t.dueDate}`}
                        variant="outlined"
                      />

                      <Box sx={{ mt: 2 }}>
                        <Button onClick={() => edit(t)}>Edit</Button>
                        <Button onClick={() => remove(t.id)} color="error">
                          Delete
                        </Button>
                      </Box>

                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

        </Container>
      </Box>
    </Box>
  );
}
