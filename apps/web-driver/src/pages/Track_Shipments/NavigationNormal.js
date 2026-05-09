import React, { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "../../Components/sidebar/Sidebar";
import Navbar from "../../Components/navbar/Navbar";
import { getUserInfo } from "../../api";

import "./navigation.css";

// import Button from "react-bootstrap/Button";
import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  Autocomplete,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";
import { Button, ButtonGroup, Card, ListGroup } from "react-bootstrap";
import axios from "axios";

// const center = { lat: 31.582045, lng: 74.329376 };
const NavigationNormal = () => {
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [shipemnt, setShipment] = useState();
  const [currentLocation, setCurrentLocation] = useState(null);
  const driverId = localStorage.getItem("driverId");
  // const [loading, setLoading] = useState(true);
  const [updateShipment, setUpdateShipment] = useState(true);
  const [direction, setDirection] = useState(null);
  const mapRef = useRef();
  const onLoad = useCallback((map) => (mapRef.current = map), []);
  const [pickupDirection, setPickupDirection] = useState(false);
  const [center, setCenter] = useState(null);
  /* 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const getUser = async () => {
        setLoading(true);
        await getUserInfo()
          .then((response) => {
            driverId = response.data._id;
          })
          .catch((error) => {
            console.error(error);
          });
          setLoading(false);
      }

      getUser();
    } 
  }, []);
*/

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  // get center for first time

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCenter({ lat: latitude, lng: longitude });
        setCurrentLocation({ lat: latitude, lng: longitude });
      },
      () => null,
      options
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        () => null,
        options
      );
    }, 10000); // update every 10 seconds

    return () => clearInterval(interval); // cleanup function to clear interval on unmount
  }, []);

  // use effect to get shipment from backend

  const fetchShipment_2 = async () => {
    try {
      // console.log("These are driver ids", driverIds);
      const result = await axios.get(
        "http://localhost:5000/api/navigation/normal/" + driverId
      );

      console.log(result.data);
      setShipment(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        // console.log("These are driver ids", driverIds);
        const result = await axios.get(
          "http://localhost:5000/api/navigation/normal/" + driverId
        );

        console.log(result.data);
        setShipment(result.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchShipment();
  }, [updateShipment]);

  // get status from backend

  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
    // const currentUser = user && JSON.parse(user).currentUser;
    // const TOKEN = currentUser?.token;
    // const headers = { token: `Bearer ${TOKEN}` };

    // fetch the status of normal shipment if, different fron previous status than
    // update the status, and get the updated normal shipment data from database

    const fetchStatus = async () => {
      try {
        // console.log("These are driver ids", driverIds);
        const result = await axios.post(
          "http://localhost:5000/api/navigation/normal/status/" + driverId
        );

        // console.log("status =>", result.data);

        if (result.data !== shipemnt.status) {
          //  JSON.stringify(status) === JSON.stringify(result.data);
          // console.log("status updated");
          setShipment({ ...shipemnt, status: result.data });
        }
      } catch (error) {
        fetchShipment_2();
        console.error(error);
      }
    };
    if (shipemnt) {
      fetchStatus();
    }

    const intervalId = setInterval(() => {
      fetchStatus();
    }, 10000); // Fetch data every 10 seconds

    return () => clearInterval(intervalId); // Clean up the interval when the component unmounts
  }, [shipemnt]);

  const handleCargoDeliver = async (id) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/navigation/normal/inprogress_to_paymentpending/" +
          driverId
      );

      console.log(res.data);
      setUpdateShipment(!updateShipment);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getDirection = (destination) => {
      // orign will be center

      //   if (pickupDirection === false) {
      //     return;
      //   }
      if (!currentLocation) {
        return;
      }

      //   const destination = {
      //     lat: shipemnt.pickupAddress[0],
      //     lng: shipemnt.pickupAddress[1],
      //   };

      // eslint-disable-next-line no-undef
      const service = new google.maps.DirectionsService();
      service.route(
        {
          origin: currentLocation,
          destination: destination,
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirection(result);
            // setDistance(result.routes[0].legs[0].distance.text);
            // setDuration(result.routes[0].legs[0].duration.text);
          }
        }
      );
    };

    if (shipemnt) {
      if (shipemnt.status === "Active") {
        if (pickupDirection !== false) {
          getDirection({
            lat: shipemnt.pickupAddress[0],
            lng: shipemnt.pickupAddress[1],
          });
        }
      } else {
        getDirection({
          lat: shipemnt.destinationAddress[0],
          lng: shipemnt.destinationAddress[1],
        });
      }
    }
  }, [currentLocation, pickupDirection, shipemnt]);

  function clearRoute() {
    setDirection(null);
  }
  /*
  if(loading) {
    return (<>Loading ...</>);
  }
*/
  return (
    <div className="Shipments">
      <Sidebar />
      <div className="ShipmentsContainer">
        <Navbar />

        <div className="row justify-content-center">
          <div className="col-auto mb-4">
            <GoogleMap
              center={center}
              zoom={7}
              mapContainerStyle={{ width: "80vw", height: "80vh" }}
              onLoad={onLoad}
            >
              {currentLocation && <Marker position={currentLocation} />}

              {center && direction && (
                <DirectionsRenderer directions={direction} />
              )}
              {shipemnt && (
                <Marker
                  position={{
                    lat: shipemnt.pickupAddress[0],
                    lng: shipemnt.pickupAddress[1],
                  }}
                />
              )}
            </GoogleMap>
          </div>
        </div>

        {/* <div className=""></div> */}
        <h1 className="d-flex justify-content-center">Shipment Details</h1>
        <div>
          {shipemnt && (
            <Card className="m-2" key={shipemnt._id}>
              <Card.Body>
                <Card.Title>Name: {shipemnt.name}</Card.Title>
                <Card.Text>
                  Vehicle Category: {shipemnt.vehicleCategory}
                </Card.Text>
                {/* <Card.Text>
                  Shared: {object.shared ? "true" : "false"}
                </Card.Text> */}
                <Card.Text>Price: {shipemnt.price} RS</Card.Text>
                <Card.Text>
                  <strong>Load:</strong>
                </Card.Text>
                {shipemnt.Load.map((load, loadIndex) => (
                  <ListGroup
                    horizontal
                    className="d-flex justify-content-center m-2 mb-3"
                    key={loadIndex}
                  >
                    <ListGroup.Item>Length: {load.length}</ListGroup.Item>
                    <ListGroup.Item>Width: {load.width}</ListGroup.Item>
                    <ListGroup.Item>Height: {load.height}</ListGroup.Item>
                    <ListGroup.Item>Quantity: {load.quantity}</ListGroup.Item>
                    <ListGroup.Item>Category: {load.category}</ListGroup.Item>
                  </ListGroup>
                ))}
                <Card.Text>
                  <strong>Status: {shipemnt.status}</strong>
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                {shipemnt.status === "Active" && (
                  <>
                    <Button
                      className="mb-2 mt-3 button-global"
                      size=""
                      variant="primary"
                      onClick={() => {
                        setPickupDirection(true);
                      }}
                    >
                      Direction
                    </Button>
                    <Button
                      className="mb-2 mt-3 ms-2 button-global"
                      size=""
                      variant="primary"
                      onClick={() => {
                        setPickupDirection(false);
                        clearRoute();
                      }}
                    >
                      Clear Direction
                    </Button>
                  </>
                )}
                {shipemnt.status === "In Progress" && (
                  <Button
                    className="mb-2 mt-3 button-global"
                    size=""
                    variant="primary"
                    onClick={() => handleCargoDeliver(shipemnt._id)}
                  >
                    Cargo Delivered
                  </Button>
                )}
              </Card.Footer>
            </Card>
          )}

          {!shipemnt && (
            <div className="m-4">
              <Card className="text-center">
                {/* <Card.Header>Featured</Card.Header> */}
                <Card.Body>
                  <Card.Title>No In progress Normal Shipment</Card.Title>
                  <Card.Text>Take a Delivery Order</Card.Text>
                  <a href="/AvailableNormalShipments" className="button-global" variant="primary">
                    Accept Shipment
                  </a>
                </Card.Body>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigationNormal;
