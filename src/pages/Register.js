import { useState } from "react";
import api from "../api/api";
import { Card, CardContent, TextField, Button } from "@mui/material";

export default function Register({ goToLogin }) {

  const [data, setData] = useState({
    name:"", email:"", password:""
  });

  const submit = async e => {
    e.preventDefault();
    await api.post("/auth/register", data);
    alert("Registered!");
    goToLogin();
  };

  return (
    <Card sx={{ maxWidth:400, mx:"auto", mt:10 }}>
      <CardContent>

        <h2>Register</h2>

        <form onSubmit={submit}>

          <TextField label="Name" fullWidth margin="normal"
            onChange={e=>setData({...data,name:e.target.value})}/>

          <TextField label="Email" fullWidth margin="normal"
            onChange={e=>setData({...data,email:e.target.value})}/>

          <TextField label="Password" type="password"
            fullWidth margin="normal"
            onChange={e=>setData({...data,password:e.target.value})}/>

          <Button type="submit" fullWidth variant="contained">
            Register
          </Button>

          <Button fullWidth sx={{ mt:1 }}
            onClick={goToLogin}>
            Back to Login
          </Button>

        </form>

      </CardContent>
    </Card>
  );
}