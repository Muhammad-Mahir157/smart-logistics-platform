import React, { useState, useRef, useEffect } from "react";
// import Navbar from '../components/Navbar'
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../styles/globals.css";

import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import DynamicForm from "../components/DynamicForm";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { userRequest } from "../requestMethods";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const center = { lat: 48.858093, lng: 2.294694 };

function RequestShipment() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // const stops = [
  //   { location: { lat: 31.710163999217308, lng: 73.98634987882987 } },
  //   { location: { lat: 31.851746477109874, lng: 73.62555094813249 } },
  //   { location: { lat: 31.885726437736984, lng: 73.28739078888589 } },
  //   { location: { lat: 32.2924767442238, lng: 72.8994090195503 } },
  //   { location: { lat: 32.272946479823, lng: 72.4657149909418 } },
  // ];

  // const convertToHours = (seconds) => {
  //   const durationSeconds = seconds;
  //   const hours = Math.floor(durationSeconds / 3600);
  //   const minutes = Math.floor((durationSeconds % 3600) / 60);
  //   const durationText = `${hours} h ${minutes} min`;
  //   // setDuration(durationText);
  //   return durationText;
  // };

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponce, setDirectionsResponce] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [shipmentObject, setShipmentObject] = useState({});
  // const [modal, setModal] = useState("value");
  const [details, setDetails] = useState({});
  const [price, setPrice] = useState(0);
  const [isShared, setIsShared] = useState(false);
  const [error, setError] = useState(null);
  const [showPrice, setShowPrice] = useState(false);
  const navigate = useNavigate();
  // const [address, setAddress] = useState({});

  /** @type React.MutableRefObject<HTMLInputElement> */
  const orignRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();

  // useEffect(()=>{

  //   const price = calculateCost(details)

  // }, [details]);

  if (!isLoaded) {
    return <div>Not Loaded</div>;
  }

  async function calculateRoute() {
    if (orignRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }

    // eslint-disable-next-line no-undef
    const geocoder = new google.maps.Geocoder();

    const [originResult, destinationResult] = await Promise.all([
      new Promise((resolve, reject) => {
        geocoder.geocode(
          { address: orignRef.current.value },
          (results, status) => {
            if (status === "OK") {
              const location = results[0].geometry.location;
              // console.log(`Origin location: ${location}`);
              resolve(location);
            } else {
              console.error(
                `Geocode was not successful for the following reason: ${status}`
              );
              reject(status);
            }
          }
        );
      }),
      new Promise((resolve, reject) => {
        geocoder.geocode(
          { address: destinationRef.current.value },
          (results, status) => {
            if (status === "OK") {
              const location = results[0].geometry.location;
              // console.log(`Destination location: ${location}`);
              resolve(location);
            } else {
              console.error(
                `Geocode was not successful for the following reason: ${status}`
              );
              reject(status);
            }
          }
        );
      }),
    ]);

    const origin = {
      lat: Number(originResult.lat()),
      lng: Number(originResult.lng()),
    };
    const destination = {
      lat: Number(destinationResult.lat()),
      lng: Number(destinationResult.lng()),
    };

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
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);

    // console.log("Distance in meters", results.routes[0].legs[0].distance.value);

    // setAddress({ pickupAddress: origin, destinationAddress: destination });
    let data = JSON.parse(
      JSON.stringify({
        ...shipmentObject,
        pickupAddress: [origin.lat, origin.lng],
        destinationAddress: [destination.lat, destination.lng],
      })
    );
    setShipmentObject(data);

    // pickupAddress: [0, 0],
    // destinationAddress: [0, 0],

    // setDistance(
    //   results.routes[0].legs.reduce(
    //     (total, leg) => total + leg.distance.value,
    //     0
    //   ) / 1000
    // );

    // let seconds = results.routes[0].legs.reduce(
    //   (total, leg) => total + leg.duration.value,
    //   0
    // );
    // convertToHours(seconds);

    // setDuration(convertToHours(seconds));
  }

  function clearRoute() {
    setDirectionsResponce(null);
    setDistance("");
    setDuration("");
    orignRef.current.value = "";
    destinationRef.current.value = "";
  }

  const truckData = {
    Mazda: {
      id: 1,
      volume: 16,
      milage: 7,
    },
    Shehzore: {
      id: 2,
      volume: 5.5,
      milage: 8,
    },
    Pickup: {
      id: 3,
      volume: 4,
      milage: 9,
    },
  };

  function calculateCost(details) {
    const petrol = 283;
    const distance = directionsResponce.routes[0].legs[0].distance.value / 1000;
    const milage = truckData[details.vehicleCategory].milage;

    let truckCost = 0;
    if (!details.shared) {
      truckCost = truckData[details.vehicleCategory].volume * 500;
    } else {
      truckCost = details.totalVolume * 500;
    }

    const price = (distance / milage) * petrol + truckCost;
    return parseFloat(price.toFixed(2));
  }

  const calculateVolume = (formData) => {
    if (!directionsResponce) {
      alert("Please select Pickup and Destination Address");
      return;
    }
    console.log("This is form data", formData);

    setDetails(formData);

    const price = calculateCost(formData);

    setPrice(price);

    setShowPrice(true);
    // alert(`Shipment Price: ${price} RS`);

    // const newObject = JSON.parse(
    //   JSON.stringify({ ...shipmentObject, ...formData, price: price })
    // );
    // console.log("This is new obj\n", newObject);

    // const headers = {
    //   token: "641949fa8a88881be9b2fb6d",
    //   // token: "Bearer 641949fa8a88881be9b2fb6d",
    // };

    // axios
    //   .post(
    //     "http://localhost:5000/api/requestshipment",
    //     { data: newObject },
    //     { headers }
    //   )
    //   .then((response) => {
    //     console.log(response);
    //     alert("Shipment Requested");
    //     window.location.reload();
    //   })
    //   .catch((error) => {
    //     console.log("I am here");
    //     console.log(error);
    //   });
  };

  // const handleClose = () => setError(false);
  // const handleShow = () => setError(true);

  const sendData = async () => {
    const newObject = JSON.parse(
      JSON.stringify({
        ...shipmentObject,
        ...details,
        price: price,
        status: false,
      })
    );

    console.log("This is new obj\n", newObject);

    const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
    const currentUser = user && JSON.parse(user).currentUser;
    const TOKEN = currentUser?.token;
    const headers = { token: `Bearer ${TOKEN}` };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/requestshipment",
        { ...newObject },
        { headers }
      );
      console.log(res.data);
      setError("Shipment Request Successfull");
      if (isShared) {
        navigate("/shipmentstatus");
      } else {
        navigate("/shipmentstatus");
      }
    } catch (err) {
      console.log(err);
      setError("Shipment Request Failed");
    }
  };

  return (
    <div>
      {/* <Navbar/> */}
      <Navbar />

      <div className="p-4">
        <div className="row">
          <div className="col">
            <div className="input-group mb-3">
              <span className="input-group-text color-global" id="basic-addon1">
                Orign
              </span>
              <Autocomplete>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Orign"
                  ref={orignRef}
                />
              </Autocomplete>
            </div>
          </div>
          <div className="col">
            <div className="input-group mb-3">
              <span className="input-group-text color-global" id="basic-addon1">
                Destination
              </span>
              <Autocomplete>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Destination"
                  ref={destinationRef}
                />
              </Autocomplete>
            </div>
          </div>

          <div className="col">
            <button
              type="submit"
              className="btn btn-primary mb-3 button-global"
              onClick={calculateRoute}
            >
              Calculate Route
            </button>
            <button
              type="submit"
              className="btn btn-primary mb-3 ms-2 button-global"
              onClick={clearRoute}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <label for="calDistance" className="col-sm-2 col-form-label">
              Distance: {distance}
            </label>
            {/* <div className="col-sm-10">
                <input type="text" readonly className="form-control-plaintext" id="calDistance" value={distance}/>
              </div> */}
          </div>

          <div className="col">
            <label for="calDuration" className="col-sm-2 col-form-label">
              Duration: {duration}
            </label>
            {/* <div className="col-sm-10">
                <input type="text" readonly className="form-control-plaintext" id="calDuration" value={duration}/>
              </div> */}
          </div>

          <div className="col">
            <button
              type="submit"
              className="btn btn-primary mb-3 button-global"
              onClick={() => map.panTo(center)}
            >
              Recenter
            </button>
          </div>
        </div>
      </div>

      {/* Google Map starts here */}

      <div className="row justify-content-center h-100 w-100">
        <div className="col-auto">
          <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{ width: "95vw", height: "80vh" }}
            onLoad={(map) => {
              setMap(map);
            }}
          >
            <MarkerF position={{ lat: 48.858093, lng: 2.294694 }} />
            {directionsResponce && (
              <DirectionsRenderer directions={directionsResponce} />
            )}
          </GoogleMap>
        </div>
        {/* <GoogleMap center={center} zoom={15} mapContainerStyle={{width: '800px', height: '500px'}}>

        </GoogleMap> */}
      </div>

      {/* Google map ends here */}

      <div className="container d-flex justify-content-center">
        <DynamicForm onSubmit={calculateVolume} />
      </div>

      {/* Display modal on event */}

      {/* <div className="container d-flex justify-content-center">
        <ButtonGroup className="mb-2">
          <ToggleButton
            className={`mb-2 checkbox-global`}
            id="toggle-check"
            type="checkbox"
            variant="outline-warning"
            checked={isShared}
            value="1"
            onChange={(e) => setIsShared(e.currentTarget.checked)}
            style={{
              backgroundColor: ` ${isShared ? "#df8100" : ""}`,
              color: `${isShared ? "white" : ""}`,
            }}
          >
            Shared
          </ToggleButton>

          <Button
            className="mb-2 ms-2 button-global"
            size="sm"
            variant="primary"
            onClick={() => setShowPrice(true)}
          >
            Request Shipment
          </Button>
        </ButtonGroup>
      </div> */}

      {/* pricing model */}

      <Modal
        show={showPrice}
        onHide={() => setShowPrice(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Calculated Cost</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <p>Total Volume: {} </p> */}
          Shipment Price: {price} RS
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPrice(false)}>
            Cancel
          </Button>
          <Button
            className="button-global"
            variant="primary"
            onClick={sendData}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}

      <Modal show={error} onHide={() => setError(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setError(null)}>
            Close
          </Button>
          {/* <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default RequestShipment;
