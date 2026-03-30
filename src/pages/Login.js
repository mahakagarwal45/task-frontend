import { useState } from "react";
import api from "../api/api";
import { Card, CardContent, TextField, Button } from "@mui/material";

export default function Login({ setUser, goToRegister }) {

  const [data, setData] = useState({ email:"", password:"" });
  
const submit = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/auth/login", data);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data));

    setUser({
      id: res.data.id,
      name: res.data.name,
      role: res.data.role
    });

  } catch (err) {
    console.log(err);
    alert("Login failed");
  }
};
  

  return (
    <Card sx={{ maxWidth:400, mx:"auto", mt:10 }}>
      <CardContent>

        <h2>Login</h2>

        <form onSubmit={submit}>

          <TextField label="Email" fullWidth margin="normal"
            onChange={e => setData({...data,email:e.target.value})}/>

          <TextField label="Password" type="password"
            fullWidth margin="normal"
            onChange={e => setData({...data,password:e.target.value})}/>

          <Button type="submit" fullWidth variant="contained">
            Login
          </Button>

          <Button fullWidth sx={{ mt:1 }}
            onClick={goToRegister}>
            Create Account
          </Button>

        </form>

      </CardContent>
    </Card>
  );
}