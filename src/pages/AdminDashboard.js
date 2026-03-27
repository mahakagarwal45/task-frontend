import { useState, useEffect } from "react";
import api from "../api/api";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import {
  Box,
  Drawer,
  List,
  Chip,
  ListItem,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Grid,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  MenuItem
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PendingIcon from "@mui/icons-material/Pending";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const drawerWidth = 240;

export default function AdminDashboard({ user, onLogout }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
  title: "",
  description: "",
  priority: "MEDIUM",
  dueDate: "",
  userId: ""
});
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("DASHBOARD");
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
  setSearch("");
}, [filter]);
  const loadData = async () => {
    const u = await api.get("/admin/users");
    const t = await api.get("/admin/tasks");
    setUsers(u.data);
    setTasks(t.data);
  };
useEffect(() => {
  api.get("/admin/users").then(res => setUsers(res.data));
}, []);

  const updateStatus = async (id, status) => {
    await api.put(`/tasks/${id}/status?status=${status}`);
    loadData(); // refresh
  };

const submit = async () => {

  if (!form.title || form.title.trim() === "") {
    alert("Title is required");
    return;
  }

  if (!form.description || form.description.trim() === "") {
    alert("Description is required");
    return;
  }

  if (!form.userId) {
    alert("Please assign a user");
    return;
  }

  if (!form.dueDate) {
    alert("Due date is required");
    return;
  }

  try {
    const data = {
      ...form,
      user: { id: form.userId }
    };

    await api.post("/tasks", data);

    // reset form
    setForm({
      title: "",
      description: "",
      priority: "MEDIUM",
      dueDate: "",
      userId: ""
    });

    loadData(); // reload tasks
  } catch (err) {
    console.error(err);
    alert("Error creating task");
  }
};
  // STATUS COUNTS
  const pending = tasks.filter(t => t.status === "PENDING").length;
  const inProgress = tasks.filter(t => t.status === "IN_PROGRESS").length;
  const completed = tasks.filter(t => t.status === "DONE").length;

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6">Admin Panel</Typography>
      </Toolbar>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setFilter("DASHBOARD")}>
            <DashboardIcon sx={{ mr: 1 }} />
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => setFilter("USERS")}>
            <PeopleIcon sx={{ mr: 1 }} />
            <ListItemText primary="Users" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => setFilter("ALL")}>
            <AssignmentIcon sx={{ mr: 1 }} />
            <ListItemText primary="All Tasks" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => setFilter("PENDING")}>
            <PendingIcon sx={{ mr: 1 }} />
            <ListItemText primary="Pending" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => setFilter("IN_PROGRESS")}>
            <AssignmentIcon sx={{ mr: 1 }} />
            <ListItemText primary="In Progress" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => setFilter("DONE")}>
            <CheckCircleIcon sx={{ mr: 1 }} />
            <ListItemText primary="Completed" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", bgcolor: "#f4f6f8", minHeight: "100vh" }}>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: { width: drawerWidth }
        }}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1 }}>

        <AppBar position="static">
          <Toolbar>
            <Typography sx={{ flexGrow: 1 }}>
              Task Manager
            </Typography>
            <Button color="inherit" onClick={onLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 4 }}>

          {/* DASHBOARD */}
          {filter === "DASHBOARD" && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Card sx={{ bgcolor: "#1976d2", color: "white" }}>
                  <CardContent>
                    <Typography>Total Users</Typography>
                    <Typography variant="h4">  {users.filter(u => u.role === "USER").length}
</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card sx={{ bgcolor: "#7b1fa2", color: "white" }}>
                  <CardContent>
                    <Typography>Total Tasks</Typography>
                    <Typography variant="h4">{tasks.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card sx={{ bgcolor: "#f57c00", color: "white" }}>
                  <CardContent>
                    <Typography>Pending</Typography>
                    <Typography variant="h4">{pending}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card sx={{ bgcolor: "#f31919", color: "white" }}>
                  <CardContent>
                    <Typography>In Progress</Typography>
                    <Typography variant="h4">{inProgress}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card sx={{ bgcolor: "#2e7d32", color: "white" }}>
                  <CardContent>
                    <Typography>Completed</Typography>
                    <Typography variant="h4">{completed}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* USERS */}
          {filter === "USERS" && (
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Users
              </Typography>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {users
                    .filter((u) => u.role !== "ADMIN")
                    .map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>{u.id}</TableCell>
                        <TableCell>{u.name || "-"}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Chip label={u.role} color="primary" />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {filter === "DASHBOARD" && (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Typography variant="h6">Assign Task</Typography>

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
        select
        fullWidth
        label="Assign User"
        sx={{ mb: 2 }}
        value={form.userId}
        onChange={(e) =>
          setForm({ ...form, userId: e.target.value })
        }
      >
        {users
          .filter((u) => u.role === "USER")
          .map((u) => (
            <MenuItem key={u.id} value={u.id}>
              {u.name}
            </MenuItem>
          ))}
      </TextField>

      <TextField
        type="date"
        fullWidth
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 2 }}
        value={form.dueDate}
        onChange={(e) =>
          setForm({ ...form, dueDate: e.target.value })
        }
      />

      <Button variant="contained" onClick={submit}>
        Assign Task
      </Button>
    </CardContent>
  </Card>
)}
   {/* TASKS */}

          {filter !== "DASHBOARD" && filter !== "USERS" && (
            <>
             <TextField
      fullWidth
      placeholder="Search"
      sx={{ mb: 3 }}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Tasks
              </Typography>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Due Date</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {tasks
                    .filter((t) => {
                      if (filter === "PENDING") return t.status === "PENDING";
                      if (filter === "IN_PROGRESS") return t.status === "IN_PROGRESS";
                      if (filter === "DONE") return t.status === "DONE";
                      return true;
                    })
                    .filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  )
                    .map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>{t.id}</TableCell>
                        <TableCell>{t.title}</TableCell>
                        <TableCell>{t.user?.name || "Unknown"}</TableCell>

                        <TableCell>
                          <Chip
                            label={t.priority}
                            color={
                              t.priority === "HIGH"
                                ? "error"
                                : t.priority === "MEDIUM"
                                ? "warning"
                                : "success"
                            }
                          />
                        </TableCell>

                        <TableCell>
                          <TextField
                            select
                            size="small"
                            value={t.status}
                            onChange={(e) =>
                              updateStatus(t.id, e.target.value)
                            }
                          >
                            <MenuItem value="PENDING">Pending</MenuItem>
                            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                            <MenuItem value="DONE">Done</MenuItem>
                          </TextField>
                        </TableCell>

                        <TableCell>{t.dueDate}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
            </>
          )}

        </Container>
      </Box>
    </Box>
  );
}