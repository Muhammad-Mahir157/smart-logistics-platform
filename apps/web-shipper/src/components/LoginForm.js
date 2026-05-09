import React, { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../redux/apiCalls";
import { useDispatch } from "react-redux";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("shipper");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(dispatch, { email, password, role });
    } catch (err) {
      console.log(error);
      setError("Invalid Username / Password");
    }
    // const user = JSON.parse(localStorage.getItem("persist:root")).user;
    // const currentUser = user && JSON.parse(user).currentUser;
    // const TOKEN = currentUser?.token;
    // // console.log(currentUser);
    // if (user) {
    //   navigate("/");
    // }
    // try {
    //   const response = await login({ email, password, role });
    //   localStorage.setItem("token", response.data.token); // Save token to local storage
    //   if (localStorage.getItem("token")) {
    //     navigate("/");
    //   }
    // } catch (error) {
    //   console.log(error);
    //   setError(error.response.data.message);
    // }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div>
        <label className="label">Email</label>
        <input
          className="input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <div>
        <label className="label">Password</label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>
      <div>
        <label className="label">Role</label>
        <select
          className="select"
          value={role}
          onChange={(event) => setRole(event.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="shipper">Shipper</option>
          <option value="driver">Driver</option>
        </select>
      </div>
      <button className="button" type="submit">
        Login
      </button>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <p className="p">
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </form>
  );
};

export default LoginForm;
