import React from "react";
import { useState, useCallback, useRef, useEffect } from "react";
// import "../styles/globals.css";
import {
  GoogleMap,
  Marker,
  MarkerF,
  DirectionsRenderer,
  //   Circle,
  //   MarkerClusterer,
} from "@react-google-maps/api";
import axios from "axios";
import Navbar from "../components/Navbar";

// const center = { lat: 48.858093, lng: 2.294694 };
const center = { lat: 31.582045, lng: 74.329376 };

const TrackNormalShipments = () => {
  // will receive all the shipments with customer id with following attributes
  // source address, destination address, shipment name, customer_id, driver_id
  // from driver id we will get driver location after 10 seconds and update it on the map
  const [normalShipment, setNormalShipment] = useState([]);
  // const [sharedShipment, setSharedShipment] = useState([]);
  const [driverLocations, setDriverLocations] = useState([]);
  const [driverIds, setDriverIds] = useState([]);
  const [distance, setDistance] = useState();
  const [duration, setDuration] = useState();
  const [status, setStatus] = useState(null);
  const [selected, setSelected] = useState(-1);

  // const n = {
  //   Load: [{}],
  //   customer_id: "646dd0e37109dfbe9e39b3db",
  //   destinationAddress: [32.0739787, 72.6860696],
  //   driver_id: "61e92879c2be211234c8c526",
  //   driver_location: [31.48233123852431, 73.06778685056378],
  //   name: "Lahore to Sargodha (temp1)",
  //   pickupAddress: [31.5203696, 74.35874729999999],
  //   price: 7907.18,
  //   shared: false,
  //   shipment_id: "647a4278c13455d52120db3c",
  //   status: "In Progress",
  //   totalVolume: 1,
  //   vehicleCategory: "Pickup",
  //   vehiclePart: 0,
  // };

  // hook to get shipment data
  useEffect(() => {
    // Set the ID in the request header
    // const id = "641949fa8a88881be9b2fb6d";
    // const headers = { id };

    const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
    const currentUser = user && JSON.parse(user).currentUser;
    const TOKEN = currentUser?.token;
    const headers = { token: `Bearer ${TOKEN}` };

    // Send the GET request to the backend to fetch normal shipment

    let shipmentNormal;
    const idsList = [];

    axios
      .get("http://localhost:5000/api/trackshipment/normal", { headers })
      .then((response) => {
        // Update the component state with the response data
        setNormalShipment(response.data);
        shipmentNormal = response.data;
        console.log("Shipment Normal object", shipmentNormal);

        shipmentNormal.forEach((object, index) => {
          idsList.push(object.driver_id);
        });

        setDriverIds(idsList);

        // console.log(idsList);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });

    // console.log("request sent");
  }, [status]);

  // get driver location

  useEffect(() => {
    // const id = "641949fa8a88881be9b2fb6d";
    const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
    const currentUser = user && JSON.parse(user).currentUser;
    const TOKEN = currentUser?.token;
    const headers = { token: `Bearer ${TOKEN}` };

    const fetchData = async () => {
      try {
        console.log("These are driver ids", driverIds);
        const result = await axios.post(
          "http://localhost:5000/api/trackshipment/normal/driverlocation",
          {
            data: driverIds,
          },
          { headers }
        );
        setDriverLocations(result.data);
        console.log(result.data);
      } catch (error) {
        console.error(error);
      }
    };

    // fetch the status of normal shipment if, different fron previous status than
    // update the status, and get the updated normal shipment data from database

    // get ids from normal shipments

    const ids = normalShipment.map((obj) => {
      return obj.shipment_id;
    });

    const fetchStatus = async () => {
      try {
        // console.log("These are driver ids", driverIds);
        const result = await axios.post(
          "http://localhost:5000/api/trackshipment/normal/updatestatus",
          { shipment_id: ids },
          { headers }
        );

        console.log(result.data);

        if (status === null) {
          setStatus(result.data);
        } else if (JSON.stringify(status) !== JSON.stringify(result.data)) {
          //  JSON.stringify(status) === JSON.stringify(result.data);
          console.log("status updated");
          setStatus(result.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData(); // Fetch data immediately when the component mounts
    fetchStatus();

    const intervalId = setInterval(() => {
      fetchData();
      fetchStatus();
    }, 10000); // Fetch data every 10 seconds

    return () => clearInterval(intervalId); // Clean up the interval when the component unmounts
  }, [driverIds]);

  const mapRef = useRef();
  const [directions, setDirections] = useState();

  function clearRoute() {
    setDirections(null);
    setDistance("");
    setDuration("");
  }
  const onLoad = useCallback((map) => (mapRef.current = map), []);

  useEffect(() => {
    const handleShipmentSelect = (selectedOption) => {
      // console.log("Pickup Address", typeof normalShipment[0].pickupAddress);
      // console.log(normalShipment[0].pickupAddress[0]);
      // console.log(typeof event.target.value);
      if (!selectedOption) {
        return;
      }
      if (parseInt(selectedOption) === -1) {
        clearRoute();
        return;
      }
      const selectedShipment = normalShipment.find(
        (shipment) => shipment.shipment_id === selectedOption
      );
      if (!selectedShipment) {
        console.log("Here");
        return;
      }

      let origin = {
        lat: selectedShipment.pickupAddress[0],
        lng: selectedShipment.pickupAddress[1],
      };
      let destination = {
        lat: selectedShipment.destinationAddress[0],
        lng: selectedShipment.destinationAddress[1],
      };

      // driver of shipment
      const selectedDriver = driverLocations.find(
        (location) => location.shipment_id === selectedOption
      );

      if (selectedShipment.status.toLowerCase() === "active") {
        destination = origin;
        origin = {
          lat: selectedDriver.driver_location[0],
          lng: selectedDriver.driver_location[1],
        };
      }

      // eslint-disable-next-line no-undef
      const service = new google.maps.DirectionsService();
      service.route(
        {
          origin: origin,
          destination: destination,
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirections(result);
            // setDistance(result.routes[0].legs[0].distance.text);
            // setDuration(result.routes[0].legs[0].duration.text);
          }
        }
      );

      // const selectedDriver = driverLocations.find(
      //   (location) => location.shipment_id === event.target.value
      // );

      // calculation distance and time from driver location

      origin = {
        lat: selectedDriver.driver_location[0],
        lng: selectedDriver.driver_location[1],
      };

      console.log("This is driver location", origin);

      service.route(
        {
          origin: origin,
          destination: destination,
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDistance(result.routes[0].legs[0].distance.text);
            setDuration(result.routes[0].legs[0].duration.text);
          }
        }
      );
    };

    handleShipmentSelect(selected);
  }, [selected, driverLocations, normalShipment]);

  return (
    <>
      <Navbar />
      <div className="container1">
        <div className="controls-global">
          <h2>Track Shipments</h2>
          <br />

          <h3>Normal Shipments</h3>
          <select
            className="form-select"
            // onChange={handleShipmentSelect}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option selected value={-1}>
              Select Shipment
            </option>
            {normalShipment &&
              normalShipment.map((shipment) => {
                return (
                  <option
                    key={shipment.shipment_id}
                    value={shipment.shipment_id}
                  >
                    {shipment.name}
                  </option>
                );
              })}
          </select>

          <div className="">
            <h4>Distance {distance}</h4>
            <h4>Duration {duration}</h4>
          </div>
        </div>
        <div className="map">
          <GoogleMap
            zoom={7}
            center={center}
            mapContainerClassName="map-container"
            // mapContainerStyle={{width: '95vw', height: '80vh'}}
            onLoad={onLoad}
          >
            <MarkerF position={{ lat: 48.858093, lng: 2.294694 }} />
            {/* <MarkerF position={{ lat: 48.8584, lng: 2.2945 }} />
          <MarkerF position={{ lat: 48.8588, lng: 2.295 }} /> */}

            {directions && <DirectionsRenderer directions={directions} />}

            {driverLocations &&
              driverLocations.map((dLocation) => {
                return (
                  <Marker
                    key={dLocation.shipment_id}
                    position={{
                      lat: dLocation.driver_location[0],
                      lng: dLocation.driver_location[1],
                    }}
                    // onClick={() => {
                    //   fetchDirection(
                    //     dLocation.shipment_id,
                    //     dLocation.driver_location
                    //   );
                    // }}

                    onClick={() => {
                      setSelected(dLocation.shipment_id);
                    }}
                  />
                );
              })}
          </GoogleMap>
        </div>
      </div>
    </>
  );
};

export default TrackNormalShipments;
