import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Set the default URL for axios requests
axios.defaults.baseURL = API_BASE_URL;

// Add an interceptor to include the token in requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
  return axios.post('/auth/driver/login', formData);
};

export const getUserInfo = () => {
  return axios.get('/auth/getUser');
};

export const getUserStats = () => {
  return axios.get('/auth/driverStats');
};

export const DriverSignup = (formData) => {
  return axios.post('/auth/driver/register', formData);
};

export const getAllNormalShipments = () => {
  return axios.get('/requestshipment/getAllNormalShipmentRequests');
};

export const getAllCompletedSharedShipments = () => {
  return axios.get('/shipmentshared/getDriverCompletedSharedShipments');
};

export const getAllCompletedNormalShipments = () => {
  return axios.get('/shipmentnormal/getDriverCompletedNormalShipments');
};

export const getAllSharedShipments = () => {
  return axios.get('/requestshipment/getAllSharedShipmentRequests');
};

export const getNormalShipments = () => {
  return axios.get('/shipmentnormal/getDriverNormalShipments');
};

export const getSharedShipments = () => {
  return axios.get('/shipmentshared/getDriverSharedShipments');
};

export const acceptNormalShipment = (formData) => {
  return axios.post('/requestshipment/acceptShipmentRequest', formData);
};

export const cancelNormalShipmentRequest = (id) => {
  return axios.post('/shipmentnormal/cancel/active/' + id);
};

export const cancelSharedShipmentRequest = (id) => {
  return axios.post('/shipmentshared/cancel/active/' + id);
};

export const UpdateNormalShipmentsLocation = (location) => {
  return axios.post('/shipmentnormal/updateDriverLocation', { driver_location: location });
}


export const UpdateSharedShipmentsLocation = (location) => {
  return axios.post('/shipmentshared/updateDriverLocation', { driver_location: location });
}

// Add additional API functions here   | /requestshipment/getAllPendingShipmentRequests
