import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Button, ButtonGroup, Card, ListGroup } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Status = () => {
  const [pendingShipments, setPendingShipments] = useState();
  const [activeShipments, setActiveShipments] = useState();
  const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
  const currentUser = user && JSON.parse(user).currentUser;
  const TOKEN = currentUser?.token;
  const headers = { token: `Bearer ${TOKEN}` };
  const navigate = useNavigate();
  // const getPendingShipments = ()->{
  // }

  // get pending shipments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/requestshipment/get/pending",
          {
            headers,
          }
        );
        // console.log("Pending Shipments", res.data);

        setPendingShipments(res.data);
      } catch (err) {
        console.error("Error fetching pending shipemnts");
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // get active shipments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/requestshipment/get/active",
          {
            headers,
          }
        );
        // console.log("Active Shipments", res.data);
        setActiveShipments(res.data);
      } catch (err) {
        console.error("Error fetching active shipemnts");
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const arrayOfObjects = [
  //   {
  //     name: "Object 1",
  //     vehicleCategory: "Category 1",
  //     Load: [
  //       { length: 1, width: 1, height: 1, quantity: 1, category: null },
  //       { length: 1, width: 1, height: 1, quantity: 1, category: null },
  //       // Other Load objects
  //     ],
  //   },
  //   {
  //     name: "Object 2",
  //     vehicleCategory: "Category 2",
  //     Load: [
  //       { length: 2, width: 2, height: 2, quantity: 2, category: "Category A" },
  //       // Other Load objects
  //     ],
  //   },
  //   // Other objects
  // ];

  const cancelPending = async (id) => {
    console.log("cancelPending =>", id);

    try {
      const res = await axios.delete(
        "http://localhost:5000/api/requestshipment/cancel/pending/" + id,
        {
          headers: { ...headers },
        }
      );

      console.log(res);
      // navigate("/shipmentstatus");
      window.location.reload();
    } catch (err) {
      console.log(err);
      alert("Error");
    }
  };

  const cancelActive = async (id, shared) => {
    console.log("cancelPending =>", id);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/requestshipment/cancel/active/" + id,
        {
          isShared: shared,
        },
        {
          headers: { ...headers },
        }
      );

      console.log(res);
      // navigate("/shipmentstatus");
      window.location.reload();
    } catch (err) {
      console.log(err);
      alert("Error");
    }
  };

  const changeStatus = async (id, shared) => {
    console.log("changeStatus =>", id);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/requestshipment/active_to_inprogress/" + id,
        {
          isShared: shared,
        },
        {
          headers: { ...headers },
        }
      );

      console.log(res);
      // navigate("/shipmentstatus");
      window.location.reload();
    } catch (err) {
      console.log(err);
      alert("Error");
    }
  };

  return (
    <>
      <Navbar />
      <h1 className="d-flex justify-content-center">Pending Shipments</h1>
      <div>
        {pendingShipments &&
          pendingShipments.map((object, index) => (
            <Card className="m-2" key={index}>
              <Card.Body>
                <Card.Title>Name: {object.name}</Card.Title>
                <Card.Text>
                  Vehicle Category: {object.vehicleCategory}
                </Card.Text>
                <Card.Text>
                  Shared: {object.shared ? "true" : "false"}
                </Card.Text>
                <Card.Text>Price: {object.price} RS</Card.Text>
                <Card.Text>
                  <strong>Load:</strong>
                </Card.Text>
                {object.Load.map((load, loadIndex) => (
                  <ListGroup horizontal className="m-2 mb-3" key={loadIndex}>
                    <ListGroup.Item>Length: {load.length}</ListGroup.Item>
                    <ListGroup.Item>Width: {load.width}</ListGroup.Item>
                    <ListGroup.Item>Height: {load.height}</ListGroup.Item>
                    <ListGroup.Item>Quantity: {load.quantity}</ListGroup.Item>
                    <ListGroup.Item>Category: {load.category}</ListGroup.Item>
                  </ListGroup>
                ))}
              </Card.Body>
              <Card.Footer>
                <Button
                  className="mb-2 mt-3 button-global"
                  size=""
                  variant="primary"
                  onClick={() => cancelPending(object._id)}
                >
                  Cancel Shipment
                </Button>
              </Card.Footer>
            </Card>
          ))}
      </div>

      {/* Active Shipments */}

      <h1 className="d-flex justify-content-center">Active Shipments</h1>
      <div>
        {activeShipments &&
          activeShipments.map((object, index) => (
            <Card className="m-2" key={index}>
              <Card.Body>
                <Card.Title>{object.name}</Card.Title>
                <Card.Text>
                  Vehicle Category: {object.vehicleCategory}
                </Card.Text>
                <Card.Text>
                  Shared: {object.shared ? "true" : "false"}
                </Card.Text>
                <Card.Text>Price: {object.price} RS</Card.Text>
                <Card.Text>
                  <strong>Load:</strong>
                </Card.Text>
                {object.Load.map((load, loadIndex) => (
                  <ListGroup horizontal className="m-2 mb-3" key={loadIndex}>
                    <ListGroup.Item>Length: {load.length}</ListGroup.Item>
                    <ListGroup.Item>Width: {load.width}</ListGroup.Item>
                    <ListGroup.Item>Height: {load.height}</ListGroup.Item>
                    <ListGroup.Item>Quantity: {load.quantity}</ListGroup.Item>
                    <ListGroup.Item>Category: {load.category}</ListGroup.Item>
                  </ListGroup>
                ))}
              </Card.Body>
              <Card.Footer>
                <ButtonGroup className="mb-2 mt-3">
                  <Button
                    className="mb-2 ms-2 button-global"
                    size=""
                    variant="primary"
                    onClick={() => cancelActive(object._id, object.shared)}
                  >
                    Cancel Shipment
                  </Button>

                  <Button
                    className="mb-2 ms-2 button-global"
                    size=""
                    variant="primary"
                    onClick={() => changeStatus(object._id, object.shared)}
                  >
                    Confirm Pickup
                  </Button>
                </ButtonGroup>
              </Card.Footer>
            </Card>
          ))}
      </div>
    </>
  );
};

export default Status;
