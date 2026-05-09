import React from "react";
import Map from "../components/Map";
import "../styles/globals.css";
import {
  GoogleMap,
  MarkerF,
  //   DirectionsRenderer,
  //   Circle,
  //   MarkerClusterer,
} from "@react-google-maps/api";
import Navbar from "../components/Navbar";

const MapPage = () => {
  return (
    <div>
      <Navbar />
      <Map />
    </div>
  );
};

export default MapPage;
