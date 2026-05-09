import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Set the default URL for axios requests
axios.defaults.baseURL = API_BASE_URL;

// Add an interceptor to include the token in requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = (formData) => {
  return axios.post("/auth/login", formData);
};

// export const register = (formData) => {
//   return axios.post("/auth/signup", formData);
// };

// export const ShipperSignup = (formData) => {
//   return axios.post("/shipper/register", formData);
// };

export const ShipperSignup = (formData) => {
  return axios.post("/auth/shipper/register", formData);
};

export const DriverSignup = (formData) => {
  return axios.post("/auth/DriverSignup", formData);
};

export const getUserInfo = () => {
  return axios.get("/auth/getUser");
};

export const getAllShippers = () => {
  return axios.get("/shipper/getAllShippers");
};

export const getShipperProfile = (ID) => {
  return axios.get("/shipper/getProfile", {
    params: { shipperID: ID },
  });
};

export const requestShipment = (newObject) => {
  return axios.post("/shipper/requestshipment", { data: newObject });
};
// Add additional API functions here
