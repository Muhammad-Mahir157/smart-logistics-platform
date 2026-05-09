import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DriverSignup } from '../../api';


const SignupForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    password: '',
    vehicle: '',
    vehicleCC: 0,
    vehicleRegistration: '',
  });


  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { fullName, emailAddress, password, vehicle, vehicleCC, vehicleRegistration } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await DriverSignup(formData);
      setSuccessMessage('Signup successful!');
      setFormData({
        fullName: '',
        emailAddress: '',
        password: '',
        vehicle: '',
        vehicleCC: 0,
        vehicleRegistration: ''
      });
      setError('');
    } catch (error) {
      console.error(error);
      setError(error.response.data.message);
      setSuccessMessage('');
    }
  };

  return (
    <div class="container">
       <h1>Sign Up</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="fullName">Name:</label>
          <input
            type="text"
            name="fullName"
            value={fullName}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor="emailAddress">Email:</label>
          <input
            type="email"
            name="emailAddress"
            value={emailAddress}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor="vehicle">Vehicle:</label>
          <input
            type="text"
            name="vehicle"
            value={vehicle}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor="vehicleCC">CC of Vehicle:</label>
          <input
            type="text"
            name="vehicleCC"
            value={vehicleCC}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor="vehicleRegistration">Registration Number:</label>
          <input
            type="text"
            name="vehicleRegistration"
            value={vehicleRegistration}
            onChange={onChange}
            required
          />
        </div>
        {/* <div>
          <label htmlFor="role">Role:</label>
          <select name="role" value={role} onChange={onChange} required>
            <option value="">--Select Role--</option>
            <option value="admin">Admin</option>
          </select>
        </div> */}
        {error && (
          <div style={{ color: 'red' }}>
            Error: {error}
          </div>
        )}
        {successMessage && (
          <div style={{ color: 'green' }}>
            {successMessage}
          </div>
        )}
        <button type="submit">Sign Up</button>
      </form>
      <p><Link to='/login'>Already have an account? Login</Link></p>
    </div>
  );
};

export default SignupForm;
