import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShipperSignup } from "../api";
import { publicRequest } from "../requestMethods";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const { fullName, emailAddress, password, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // try {
    //   await ShipperSignup(formData);
    //   // await register(formData);
    //   setSuccessMessage("Signup successful!");
    //   setFormData({
    //     fullName: "",
    //     emailAddress: "",
    //     password: "",
    //     role: "",
    //   });
    //   setError("");
    // } catch (error) {
    //   console.error(error);
    //   setError(error.response.data.message);
    //   setSuccessMessage("");
    // }

    try {
      const res = await publicRequest.post("/auth/shipper/register", formData);
      console.log(res);
      setSuccessMessage("Signup successful!");
      setFormData({
        fullName: "",
        emailAddress: "",
        password: "",
        role: "",
      });
      setError("");
      navigate("/login");
    } catch (error) {
      console.log(error);
      console.error(error);
      setError(error.response.data.message);
      setSuccessMessage("");
    }
  };

  return (
    <div>
      <h1 className="h1">Sign Up</h1>
      <form className="form" onSubmit={onSubmit}>
        <div>
          <label className="label" htmlFor="fullName">
            Name:
          </label>
          <input
            className="input"
            type="text"
            name="fullName"
            value={fullName}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="emailAddress">
            Email:
          </label>
          <input
            className="input"
            type="email"
            name="emailAddress"
            value={emailAddress}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="password">
            Password:
          </label>
          <input
            className="input"
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="role">
            Role:
          </label>
          <select
            className="select"
            name="role"
            value={role}
            onChange={onChange}
            required
          >
            <option value="">--Select Role--</option>
            <option value="admin">Admin</option>
            <option value="shipper">Shipper</option>
            <option value="driver">Driver</option>
          </select>
        </div>
        {error && <div style={{ color: "red" }}>Error: {error}</div>}
        {successMessage && (
          <div style={{ color: "green" }}>{successMessage}</div>
        )}
        <button className="button" type="submit">
          Sign Up
        </button>
      </form>
      <p className="p">
        <Link to="/login">Already have an account? Login</Link>
      </p>
    </div>
  );
};

export default SignupForm;
