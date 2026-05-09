import React, { useState, useEffect } from 'react';
import {UpdateNormalShipmentsLocation, UpdateSharedShipmentsLocation} from './api';

const LocationContext = React.createContext();

export const useLocationUpdate = () => {
    const [currentLocation, setCurrentLocation] = useState({ lat: null, lng: null });
  
    useEffect(() => {
      const options = {}; // Add any specific options you need for getCurrentPosition
  
      const updateLocation = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ lat: latitude, lng: longitude });
          },
          () => null,
          options
        );
      };
  
      const interval = setInterval(updateLocation, 10000); // Update location every 10 seconds
  
      // Update location immediately
      updateLocation();
  
      return () => clearInterval(interval); // cleanup function to clear interval on unmount
    }, []);

    useEffect(() => {
      if(currentLocation.lat != null && currentLocation.lng != null && localStorage.getItem('token') != null) {
        UpdateNormalShipmentsLocation([currentLocation.lat, currentLocation.lng]);
        UpdateSharedShipmentsLocation([currentLocation.lat, currentLocation.lng]);
        console.log("Updated Driver Location sent!: " + JSON.stringify(currentLocation));
      }
    }, [currentLocation]);
  
    return currentLocation;
  };
  


export const LocationProvider = ({ children }) => {
  const currentLocation = useLocationUpdate();

  return (
    <LocationContext.Provider value={currentLocation}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = React.useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
