import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api";

const LoginForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("driver");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await login({ email, password, role });
      localStorage.setItem('token', response.data.token); // Save token to local storage
      if(localStorage.getItem('token')) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };

  return (
<form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <div>
          <label>Role</label>
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="driver">Driver</option>
          </select>
        </div>
        <button type="submit">Login</button>
      {error && (
          <div style={{ color: 'red' }}>
            Error: {error}
          </div>
        )}
      <p>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
      </form>
  );
};

export default LoginForm;
