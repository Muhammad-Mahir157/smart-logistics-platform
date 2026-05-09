import React, { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "../../Components/sidebar/Sidebar";
import Navbar from "../../Components/navbar/Navbar";

import './navigation.css'
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

const center = { lat: 48.858093, lng: 2.294694 };
const NavigationShared = () => {
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [shipment, setShipment] = useState();
  const [currentLocation, setCurrentLocation] = useState(null);
  const driverId = localStorage.getItem('driverId');
  const [updateShipment, setUpdateShipment] = useState(true);
  const [direction, setDirection] = useState(null);
  // const mapRef = useRef();
  // const onLoad = useCallback((map) => (mapRef.current = map), []);
  const [pickupDirection, setPickupDirection] = useState(false);
  const [center, setCenter] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

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


  const fetchShipment_2 = async () => {
    try {
      // console.log("These are driver ids", driverIds);
      const result = await axios.get(
        "http://localhost:5000/api/navigation/shared/" + driverId
      );

      console.log("shipment Object => ", result.data);
      setShipment(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  // use effect to get shipment from backend

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        // console.log("These are driver ids", driverIds);
        const result = await axios.get(
          "http://localhost:5000/api/navigation/shared/" + driverId
        );

        console.log("shipment Object => ", result.data);
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
        const result = await axios.get(
          "http://localhost:5000/api/navigation/shared/status/" + driverId
        );

        console.log("status =>", result.data);

        let flag = true;
        shipment.forEach((data) => {
          // console.log("data._id", data._id);
          // console.log("result.data[data._id]", result.data[data._id]);
          // console.log("data.status", data.status);
          if (result.data[data._id] !== data.status) {
            flag = false;
            // console.log("Here");
          }
        });

        if (flag === false) {
          console.log("shipment updated");
          setUpdateShipment(!updateShipment);
        }
        // if (result.data !== shipemnt.status) {
        //   //  JSON.stringify(status) === JSON.stringify(result.data);
        //   // console.log("status updated");
        //   setShipment({ ...shipemnt, status: result.data });
        // }
      } catch (error) {
        fetchShipment_2();
        console.error(error);
      }
    };
    if (shipment) {
      // fetchStatus();
    }

    const intervalId = setInterval(() => {
      fetchStatus();
    }, 5000); // Fetch data every 10 seconds

    return () => clearInterval(intervalId); // Clean up the interval when the component unmounts
  }, [shipment]);

  const handleCargoDeliver = async (id) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/navigation/shared/inprogress_to_paymentpending/" +
          driverId,
        { shipmentId: id }
      );

      console.log(res.data);
      setUpdateShipment(!updateShipment);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getPickupDirection = (destination) => {
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

    const getRouteDirection = () => {
      // orign will be center

      //   if (pickupDirection === false) {
      //     return;
      //   }
      if (!currentLocation) {
        console.log("not going to display route direction");
        return;
      }

      // set waypoints
      const stops = [];
      const destinations = [];
      shipment.forEach((data) => {
        stops.push({
          location: {
            lat: data.destinationAddress[0],
            lng: data.destinationAddress[1],
          },
        });

        destinations.push({
          lat: data.destinationAddress[0],
          lng: data.destinationAddress[1],
        });
      });

      function findDestinationWithMaxDistance(origin, destinations) {
        var maxDistance = -1;
        var maxDestination = null;

        destinations.forEach(function (destination) {
          try {
            let distance =
              // eslint-disable-next-line no-undef
              google.maps.geometry.spherical.computeDistanceBetween(
                origin,
                destination
              );

            if (distance > maxDistance) {
              maxDistance = distance;
              maxDestination = destination;
            }
          } catch (err) {
            console.log(err);
          }
        });

        return maxDestination;
      }

      const destination = findDestinationWithMaxDistance(
        currentLocation,
        destinations
      );
      console.log("max destination =>", destination);

      console.log("stops =>", stops[0]);

      // eslint-disable-next-line no-undef
      const service = new google.maps.DirectionsService();
      service.route(
        {
          origin: currentLocation,
          destination: destination,
          waypoints: stops,
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

    if (shipment) {
      // check if status of all the shared shipments are in progress

      let flag = true;
      shipment.forEach((data) => {
        if (data.status === "Active") {
          flag = false;
        }
      });
      // flag === false mean there are still shipments which are in Active state
      if (flag === false) {
        if (pickupDirection !== false && selectedAddress) {
          getPickupDirection({
            lat: selectedAddress[0],
            lng: selectedAddress[1],
          });
        }
      } else {
        getRouteDirection();
        console.log("Getting route direction");
      }
    }
  }, [currentLocation, pickupDirection, shipment, selectedAddress]);

  function clearRoute() {
    setDirection(null);
  }

  return (
    <div>
      {/* Google Map starts here */}

      <div className="Shipments">
      <Sidebar/>

      <div className="ShipmentsContainer">
        <Navbar/>

      <div className="row justify-content-center">
        <div className="col-auto mb-4">
          <GoogleMap
            center={center}
            zoom={10}
            mapContainerStyle={{ width: "80vw", height: "80vh" }}
            // onLoad={onLoad}
            onLoad={(map) => {
              setMap(map);
            }}
          >
            {currentLocation && <Marker position={currentLocation} />}

            {center && direction && (
              <DirectionsRenderer directions={direction} />
            )}
            {shipment &&
              shipment.map((obj) => (
                <Marker
                  key={obj._id}
                  position={{
                    lat: obj.pickupAddress[0],
                    lng: obj.pickupAddress[1],
                  }}
                />
              ))}
          </GoogleMap>
        </div>
      </div>

      {/* <div className=""></div> */}
      <h1 className="d-flex justify-content-center">Shipment Details</h1>
      <div>
        {shipment &&
          shipment.map((obj, index) => {
            return (
              <Card className="m-2" key={obj._id}>
                <Card.Body>
                  <Card.Title>Name: {obj.name}</Card.Title>
                  <Card.Text>Vehicle Category: {obj.vehicleCategory}</Card.Text>
                  {/* <Card.Text>
                  Shared: {object.shared ? "true" : "false"}
                </Card.Text> */}
                  <Card.Text>Price: {obj.price} RS</Card.Text>
                  <Card.Text>
                    <strong>Load:</strong>
                  </Card.Text>
                  {obj.Load.map((load, loadIndex) => (
                    <ListGroup horizontal className="d-flex justify-content-center m-2 mb-3" key={loadIndex}>
                      <ListGroup.Item>Length: {load.length}</ListGroup.Item>
                      <ListGroup.Item>Width: {load.width}</ListGroup.Item>
                      <ListGroup.Item>Height: {load.height}</ListGroup.Item>
                      <ListGroup.Item>Quantity: {load.quantity}</ListGroup.Item>
                      <ListGroup.Item>Category: {load.category}</ListGroup.Item>
                    </ListGroup>
                  ))}
                  <Card.Text>
                    <strong>Status: {obj.status}</strong>
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  {obj.status === "Active" && (
                    <>
                      <Button
                        className="mb-2 mt-3 button-global"
                        size=""
                        variant="primary"
                        onClick={() => {
                          setSelectedAddress(obj.pickupAddress);
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
                  {obj.status === "In Progress" && (
                    <Button
                      className="mb-2 mt-3 button-global"
                      size=""
                      variant="primary"
                      onClick={() => handleCargoDeliver(obj._id)}
                    >
                      Cargo Delivered
                    </Button>
                  )}
                </Card.Footer>
              </Card>
            );
          })}

        {(!shipment || shipment.length == 0) && (
          <div className="m-4">
            <Card className="text-center">
              {/* <Card.Header>Featured</Card.Header> */}
              <Card.Body>
                <Card.Title>No In progress Shared Shipment</Card.Title>
                <Card.Text>Take a Delivery Order</Card.Text>
                <a href="/AvailableSharedShipments"  className="button-global" variant="primary">
                  Accept Shipment
                </a>
              </Card.Body>
            </Card>
          </div>
        )}
      </div>
    </div>
    </div>
    </div>
  );
};

export default NavigationShared;
