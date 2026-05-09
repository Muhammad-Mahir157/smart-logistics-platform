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

const TrackSharedShipments = () => {
  // will receive all the shipments with customer id with following attributes
  // source address, destination address, shipment name, customer_id, driver_id
  // from driver id we will get driver location after 10 seconds and update it on the map
  // const [normalShipment, setNormalShipment] = useState([]);
  const [sharedShipment, setSharedShipment] = useState([]);
  const [wayPoints, setWayPoints] = useState();
  const [driverLocations, setDriverLocations] = useState([]);
  const [driverIds, setDriverIds] = useState([]);
  const [shipmentIds, setShipmentIds] = useState([]);
  const [distance, setDistance] = useState();
  const [duration, setDuration] = useState();
  const [updateShipment, setUpdateShipment] = useState(false); // to get data from backend if distance of driver to way point is less than 100m
  const mapRef = useRef();
  const [directions, setDirections] = useState();
  const [selected, setSelected] = useState(-1);
  const [status, setStatus] = useState(null);
  // const [updateTimee, setUpdateTime] = useState();

  // for shared shipment calculate the order of delivery

  // const sortDestinations = (destinationAddress, pickupAddress, way_point) => {
  //   // Adjust Waypoints
  //   // calculate if distance to waypoint is larger than orignal destination
  //   //const way_point = wayPoints[event.target.value];

  //   // eslint-disable-next-line no-undef
  //   const service = new google.maps.DirectionsService();

  //   let destinationDistance = 0;
  //   // eslint-disable-next-line no-undef

  //   const origin = { lat: pickupAddress[0], lng: pickupAddress[1] };
  //   const destination = {
  //     lat: destinationAddress[0],
  //     lng: destinationAddress[1],
  //   };
  //   // console.log("This is origin, ", origin);

  //   service.route(
  //     {
  //       origin: origin,
  //       destination: destination,
  //       // eslint-disable-next-line no-undef
  //       travelMode: google.maps.TravelMode.DRIVING,
  //     },
  //     (result, status) => {
  //       if (status === "OK" && result) {
  //         destinationDistance = result.routes[0].legs[0].distance.value;
  //       }
  //     }
  //   );

  //   const index = [];
  //   way_point.forEach((data, i) => {
  //     service.route(
  //       {
  //         // eslint-disable-next-line no-undef
  //         origin: new google.maps.LatLng(pickupAddress[0], pickupAddress[1]),
  //         // eslint-disable-next-line no-undef
  //         destination: new google.maps.LatLng(data[0], data[1]),
  //         // eslint-disable-next-line no-undef
  //         travelMode: google.maps.TravelMode.DRIVING,
  //       },
  //       (result, status) => {
  //         if (status === "OK" && result) {
  //           const dis = result.routes[0].legs[0].distance.value;
  //           // if (dis > destinationDistance) {
  //           //   index.push(i);
  //           // }
  //           if (dis < destinationDistance) {
  //             // console.log("[data[0], data[1]]", [data[0], data[1]]);
  //             index.push([data[0], data[1]]);
  //           }
  //         }
  //       }
  //     );
  //   });

  //   // console.log("way_point before= ", way_point);

  //   // console.log("I am here 2");
  //   // console.log("index= ", index);

  //   // remove unnecessary waypoints from data
  //   // index.forEach((item) => {
  //   //   way_point.splice(item, 1);
  //   // });

  //   // console.log("way_point after= ", way_point);

  //   // return way_point;

  //   return index;
  // };

  const sortDestinations = (destinationAddress, pickupAddress, way_point) => {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-undef
      const service = new google.maps.DirectionsService();

      let destinationDistance = 0;
      const origin = { lat: pickupAddress[0], lng: pickupAddress[1] };
      const destination = {
        lat: destinationAddress[0],
        lng: destinationAddress[1],
      };

      service.route(
        {
          origin: origin,
          destination: destination,
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            destinationDistance = result.routes[0].legs[0].distance.value;

            const index = [];
            let completedRequests = 0;

            const checkCompletion = () => {
              if (completedRequests === way_point.length) {
                resolve(index);
              }
            };

            way_point.forEach((data, i) => {
              service.route(
                {
                  // eslint-disable-next-line no-undef
                  origin: new google.maps.LatLng(
                    pickupAddress[0],
                    pickupAddress[1]
                  ),
                  // eslint-disable-next-line no-undef
                  destination: new google.maps.LatLng(data[0], data[1]),
                  // eslint-disable-next-line no-undef
                  travelMode: google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                  if (status === "OK" && result) {
                    const dis = result.routes[0].legs[0].distance.value;
                    if (dis < destinationDistance) {
                      index.push([data[0], data[1]]);
                    }
                  }
                  completedRequests++;
                  checkCompletion();
                }
              );
            });
          } else {
            reject(new Error("Failed to calculate destination distance."));
          }
        }
      );
    });
  };

  useEffect(() => {
    // Set the ID in the request header
    // const authorization = "Bearer 641949fa8a88881be9b2fb61";
    // const headers = { authorization };

    const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
    const currentUser = user && JSON.parse(user).currentUser;
    const TOKEN = currentUser?.token;
    const headers = { token: `Bearer ${TOKEN}` };

    // Send the GET request to the backend to fetch shared shipment
    const getShipmentObject = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/trackshipment/shared/",
          { headers }
        );
        setSharedShipment(res.data);
        console.log("This is shared shipment object", res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getShipmentObject();
    // .then((shipment) => {
    //   console.log("This is responce from backend\n", shipment);
    //   setSharedShipment(shipment);
    //   // console.log("This is after setSharedShipment\n", sharedShipment);
    //   const idsList = [];
    //   const way_Points = {};

    //   shipment.forEach((object, index) => {
    //     idsList.push(object.shipment_details._id);

    //     way_Points[object.shipment_details._id] = object.other_shipments;

    //     console.log("These are way points before", way_Points);
    //     // console.log(
    //     //   "These are way points dict",
    //     //   way_Points[object.shipment_details._id]
    //     // );

    //     // sort the way_points
    //     way_Points[object.shipment_details._id] = sortDestinations(
    //       object.shipment_details.destinationAddress,
    //       object.shipment_details.pickupAddress,
    //       way_Points[object.shipment_details._id]
    //     );

    //     console.log("These are way points after", way_Points);
    //   });

    //   setShipmentIds(idsList);
    //   // console.log("These are shipment ids", shipmentIds);
    //   setWayPoints(way_Points);
    // })
    // .catch((error) => {
    //   console.log("Error: ", error);
    // });

    // const getData = async () => {
    //   try {
    //     const result = await axios.get(
    //       "http://localhost:5000/api/trackshipment/shared/",
    //       { headers }
    //     );

    //     console.log("This is result", result.data);

    //     setSharedShipment(result.data);
    //     console.log(sharedShipment);

    //     const idsList = [];
    //     const way_Points = {};
    //     const shipment = sharedShipment;

    //     shipment.forEach((object, index) => {
    //       idsList.push(object.shipment_details._id);

    //       way_Points[object.shipment_details._id] = object.other_shipments;

    //       console.log("These are way points before", way_Points);
    //       console.log(
    //         "These are way points dict",
    //         way_Points[object.shipment_details._id]
    //       );

    //       // sort the way_points
    //       way_Points[object.shipment_details._id] = sortDestinations(
    //         object.shipment_details.destinationAddress,
    //         object.shipment_details.pickupAddress,
    //         way_Points[object.shipment_details._id]
    //       );

    //       console.log("These are way points after", way_Points);
    //     });

    //     setShipmentIds(idsList);
    //     console.log("These are shipment ids", shipmentIds);
    //     setWayPoints(way_Points);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

    // getData(); // Fetch data immediately when the component mounts
  }, [updateShipment, status]);

  // use effect to sort the way points
  useEffect(() => {
    // console.log("This is responce from backend\n", sharedShipment);
    const idsList = [];
    const way_Points = {};

    sharedShipment.forEach((object, index) => {
      idsList.push(object.shipment_details._id);

      way_Points[object.shipment_details._id] = object.other_shipments;

      console.log("These are way points before", way_Points);
      // console.log(
      //   "These are way points dict",
      //   way_Points[object.shipment_details._id]
      // );

      // sort the way_points
      // way_Points[object.shipment_details._id] = sortDestinations(
      //   object.shipment_details.destinationAddress,
      //   object.shipment_details.pickupAddress,
      //   way_Points[object.shipment_details._id]
      // );

      sortDestinations(
        object.shipment_details.destinationAddress,
        object.shipment_details.pickupAddress,
        way_Points[object.shipment_details._id]
      )
        .then((index) => {
          way_Points[object.shipment_details._id] = index;
          console.log(way_Points[object.shipment_details._id]);
        })
        .catch((error) => {
          console.error(error);
        });

      console.log("These are way points after", way_Points);
    });

    setShipmentIds(idsList);
    // console.log("These are shipment ids", shipmentIds);
    setWayPoints(way_Points);
  }, [sharedShipment]);

  // const object1 = {
  //   id1: { id_1: true, id_2: false },
  //   id2: { id_3: true, id_4: false }
  // };

  // const object2 = {
  //   id2: { id_4: false, id_3: true },
  //   id1: { id_2: false, id_1: true }
  // };

  // Function to compare two objects
  function compareObjects(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      const value1 = obj1[key];
      const value2 = obj2[key];

      if (typeof value1 === "object" && typeof value2 === "object") {
        if (!compareObjects(value1, value2)) {
          return false;
        }
      } else if (value1 !== value2) {
        return false;
      }
    }

    return true;
  }

  // get driver location

  useEffect(() => {
    // const authorization = "Bearer 641949fa8a88881be9b2fb61";
    // const headers = { authorization };

    const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
    const currentUser = user && JSON.parse(user).currentUser;
    const TOKEN = currentUser?.token;
    const headers = { token: `Bearer ${TOKEN}` };

    const fetchData = async () => {
      try {
        // console.log(
        //   "These are shipment ids need to send to backend",
        //   shipmentIds
        // );
        const result = await axios.post(
          "http://localhost:5000/api/trackshipment/shared/driverlocation/",
          {
            data: shipmentIds,
          },
          { headers }
        );
        setDriverLocations(result.data);
        // console.log("These are driver location received", result.data);
      } catch (error) {
        console.error(error);
      }
    };

    // get ids from normal shipments

    // const ids = sharedShipment.map((obj) => {
    //   return obj.shipment_id;
    // });

    const fetchStatus = async () => {
      try {
        // console.log("These are driver ids", driverIds);
        const result = await axios.post(
          "http://localhost:5000/api/trackshipment/shared/updatestatus",
          { shipment_id: shipmentIds },
          { headers }
        );

        console.log("This status object", result.data);

        if (status === null) {
          setStatus(result.data);
        } else if (!compareObjects(status, result.data)) {
          // compareObjects(status, result.data);
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
  }, [driverIds, shipmentIds]);

  const onLoad = useCallback((map) => (mapRef.current = map), []);

  function clearRoute() {
    setDirections(null);
    setDistance("");
    setDuration("");
  }

  function formatDuration(duration) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    return `${hours} hours ${minutes} minutes ${seconds} seconds`;
  }

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
      const selectedShipment = sharedShipment.find(
        (shipment) => shipment.shipment_details._id === selectedOption
      );

      if (!selectedShipment) {
        // console.log("Here");
        return;
      }

      let origin = {
        lat: selectedShipment.shipment_details.pickupAddress[0],
        lng: selectedShipment.shipment_details.pickupAddress[1],
      };
      let destination = {
        lat: selectedShipment.shipment_details.destinationAddress[0],
        lng: selectedShipment.shipment_details.destinationAddress[1],
      };

      // console.log(
      //   "These are waypoints for selected shipments\n",
      //   wayPoints[selectedShipment.shipment_details._id]
      // );

      let stops = [];

      wayPoints[selectedShipment.shipment_details._id].forEach(
        (data, index) => {
          let tempObject = {};
          tempObject["location"] = { lat: data[0], lng: data[1] };
          stops.push(tempObject);
        }
      );

      console.log("These are way points", stops);

      const selectedDriver = driverLocations.find(
        (location) => location.customer_shipment_id === selectedOption
      );

      // check if status is active or not

      if (selectedShipment.status.toLowerCase() === "active") {
        destination = origin;
        origin = {
          lat: selectedDriver.driver_location[0],
          lng: selectedDriver.driver_location[1],
        };

        stops = [];
      }

      // console.log("These are updated waypoints for selected shipments\n", stops);

      // eslint-disable-next-line no-undef
      const service = new google.maps.DirectionsService();
      service.route(
        {
          origin: origin,
          destination: destination,
          waypoints: stops,
          optimizeWaypoints: true,
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirections(result);
            // setDistance(result.routes[0].legs[0].distance.text);
            // setDuration(result.routes[0].legs[0].duration.text);

            if (result.routes[0].legs[0].distance.value <= 100) {
              setUpdateShipment(!updateShipment);
            }
          }
        }
      );

      // calculation distance and time from driver location

      // console.log("This is selected driver", selectedDriver);

      // orign = drivrer location
      origin = {
        lat: selectedDriver.driver_location[0],
        lng: selectedDriver.driver_location[1],
      };

      // console.log("This is driver location", origin);

      // // calculate if distance to waypoint is larger than orignal destination
      // const way_point = wayPoints[event.target.value];
      // const index = [];
      // way_point.forEach((data, i) => {
      //   service.route(
      //     {
      //       origin: sharedShipment.shipment_details.pickupAddress,
      //       // eslint-disable-next-line no-undef
      //       destination: new google.maps.LatLng(data[0], data[1]),
      //       // eslint-disable-next-line no-undef
      //       travelMode: google.maps.TravelMode.DRIVING,
      //     },
      //     (result, status) => {
      //       if (status === "OK" && result) {
      //         const dis = result.routes[0].legs[0].distance.value;
      //         if (dis > distanceToDestination) {
      //           index.push(i);
      //         }
      //       }
      //     }
      //   );
      // });

      // // remove unnecessary waypoints from data
      // index.forEach((item) => {
      //   way_point.splice(item, 1);
      // });

      service.route(
        {
          origin: origin,
          destination: destination,
          waypoints: stops,
          optimizeWaypoints: true,
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            // setDistance(result.routes[0].legs[0].distance.text);
            // setDuration(result.routes[0].legs[0].duration.text);

            let totalDistance = 0;
            let totalDuration = 0;
            for (let i = 0; i < result.routes[0].legs.length; i++) {
              totalDistance += result.routes[0].legs[i].distance.value;
              totalDuration += result.routes[0].legs[i].duration.value;
            }
            setDistance((totalDistance / 1000).toFixed(2) + " km");
            setDuration(formatDuration(totalDuration));

            // console.log(
            //   "This is value of distance",
            //   result.routes[0].legs[0].distance.value
            // );
          }
        }
      );
    };

    handleShipmentSelect(selected);
  }, [driverLocations, selected, sharedShipment, updateShipment, wayPoints]);
  return (
    <>
      <Navbar />
      <div className="container1">
        <div className="controls-global">
          <h2>Track Shipments</h2>
          <br />

          <h3>Shared Shipments</h3>
          <select
            className="form-select"
            // onChange={handleShipmentSelect}
            onChange={(e) => setSelected(e.target.value)}
            value={selected}
          >
            <option selected value={-1}>
              Select Shipment
            </option>
            {sharedShipment &&
              sharedShipment.map((shipment) => {
                return (
                  <option
                    key={shipment.shipment_details._id}
                    value={shipment.shipment_details._id}
                  >
                    {shipment.shipment_details.name}
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
                    key={dLocation.customer_shipment_id}
                    position={{
                      lat: dLocation.driver_location[0],
                      lng: dLocation.driver_location[1],
                    }}
                    // onClick={() => {
                    //   fetchDirection(
                    //     dLocation.customer_shipment_id,
                    //     dLocation.driver_location
                    //   );
                    // }}

                    onClick={() => {
                      setSelected(dLocation.customer_shipment_id);
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

export default TrackSharedShipments;
