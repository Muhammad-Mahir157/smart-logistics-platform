import React from "react";
import { useState, useMemo, useCallback, useRef } from "react";
import { useEffect } from "react";

import {
  DirectionsRenderer,
  GoogleMap,
  Marker,
  //   DirectionsRenderer,
  //   Circle,
  //   MarkerClusterer,
} from "@react-google-maps/api";
// import Places from "./Places";
// import Distance from "./distance";
import "../styles/globals.css";

// type LatLngLiteral = google.maps.LatLngLiteral;
// type DirectionsResult = google.maps.DirectionsResult;
// type MapOptions = google.maps.MapOptions;

// const center = { lat: 48.858093, lng: 2.294694 };

export default function Map() {
  const mapRef = useRef();
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [steps, setSteps] = useState([]);
  // const center = useMemo(() => ({lat: 43, lng:-80}), []);
  // const {office, setOffice} = useState();
  const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [directionsResponce, setDirectionsResponce] = useState(null);
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  // useEffect(() => {
  //   const origin = { lat: 31.582045, lng: 74.329376 };
  //   const destination = { lat: 32.082466, lng: 72.6718596 };

  //   // eslint-disable-next-line no-undef
  //   const directionService = new google.maps.DirectionsService();
  //   const results = directionService.route({
  //     origin: origin,
  //     destination: destination,
  //     // waypoints: stops,
  //     // optimizeWaypoints: true,
  //     // eslint-disable-next-line no-undef
  //     travelMode: google.maps.TravelMode.DRIVING,
  //   });
  //   setDirectionsResponce(results);
  // }, []);

  const handleClick = async () => {
    const origin = { lat: 31.582045, lng: 74.329376 };
    const destination = { lat: 32.082466, lng: 72.6718596 };
    console.log("Here");
    // eslint-disable-next-line no-undef
    const directionService = new google.maps.DirectionsService();
    const results = await directionService.route({
      origin: origin,
      destination: destination,
      // waypoints: stops,
      // optimizeWaypoints: true,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponce(results);
    console.log(results.routes[0].legs[0].steps);
    setSteps(results.routes[0].legs[0].steps);

    const msg = new SpeechSynthesisUtterance(
      results.routes[0].legs[0].steps[0].instructions
    );
    msg.voiceURI = "native";
    msg.lang = "en-US";
    window.speechSynthesis.speak(msg);
  };

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const { latitude, longitude } = position.coords;
  //       setCenter({ lat: latitude, lng: longitude });
  //     },
  //     () => null,
  //     options
  //   );
  // }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
        },
        () => null,
        options
      );
    }, 10000); // update every 10 seconds

    return () => clearInterval(interval); // cleanup function to clear interval on unmount
  }, []);

  // const onLoad = useCallback((map) => (mapRef.current = map), []);
  // const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  return (
    <div className="container1">
      <div className="controls">
        <h1>Commute</h1>
        {/* <Places setOffice={(position) => {
                    setOffice(position);
                    mapRef.current.panTo(position);
                }}/>  */}
        <button onClick={handleClick}>Click</button>
        {steps &&
          steps.map((data, index) => {
            return (
              <p
                key={index}
                dangerouslySetInnerHTML={{ __html: data.instructions }}
              ></p>
            );
          })}
      </div>
      <div className="map">
        <GoogleMap
          zoom={10}
          center={center}
          mapContainerClassName="map-container"
          // mapContainerStyle={{width: '95vw', height: '80vh'}}
          onLoad={(map) => {
            setMap(map);
          }}
        >
          <Marker position={center} />
          {directionsResponce && (
            <DirectionsRenderer directions={directionsResponce} />
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

// const defaultOptions = {
//   strokeOpacity: 0.5,
//   strokeWeight: 2,
//   clickable: false,
//   draggable: false,
//   editable: false,
//   visible: true,
// };
// const closeOptions = {
//   ...defaultOptions,
//   zIndex: 3,
//   fillOpacity: 0.05,
//   strokeColor: "#8BC34A",
//   fillColor: "#8BC34A",
// };
// const middleOptions = {
//   ...defaultOptions,
//   zIndex: 2,
//   fillOpacity: 0.05,
//   strokeColor: "#FBC02D",
//   fillColor: "#FBC02D",
// };
// const farOptions = {
//   ...defaultOptions,
//   zIndex: 1,
//   fillOpacity: 0.05,
//   strokeColor: "#FF5252",
//   fillColor: "#FF5252",
// };

// const generateHouses = (position) => {
//   const _houses = [];
//   for (let i = 0; i < 100; i++) {
//     const direction = Math.random() < 0.5 ? -2 : 2;
//     _houses.push({
//       lat: position.lat + Math.random() / direction,
//       lng: position.lng + Math.random() / direction,
//     });
//   }
//   return _houses;
// };
