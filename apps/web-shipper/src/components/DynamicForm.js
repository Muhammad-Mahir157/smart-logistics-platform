// import { red } from "@mui/material/colors";
// import { color } from "@mui/system";
import React, { useState } from "react";
import { Button, ButtonGroup, Modal, ToggleButton } from "react-bootstrap";

const DynamicForm = (props) => {
  const [formFields, setFormFields] = useState({
    name: "",
    vehicleCategory: "",
    shared: false,
    Load: [{ length: 1, width: 1, height: 1, quantity: 1, category: null }],
  });

  const [error, setError] = useState();
  const [isShared, setIsShared] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  //   const [formFields, setFormFields] = useState([
  //     { length: "", width: "", height: "", quantity: "", category: "" },
  //   ]);

  //   const [name, setName] = useState();
  //   const [vehicleCategory, setVehicleCategory] = useState();

  const truckType = [
    {
      id: 1,
      type: "Mazda",
      volume: 16,
    },
    {
      id: 2,
      type: "Shehzore",
      volume: 5.5,
    },
    {
      id: 3,
      type: "Pickup",
      volume: 4,
    },
  ];

  const truckData = {
    Mazda: {
      id: 1,
      volume: 16,
    },
    Shehzore: {
      id: 2,
      volume: 5.5,
    },
    Pickup: {
      id: 3,
      volume: 4,
    },
  };

  //   const handleNameChange = (event) => {
  //     if (!event.target.value) {
  //       return;
  //     }

  //     setName(event.target.value);
  //   };

  const handleFormChange = (event, index) => {
    setError("");

    // set name
    if (index === -1) {
      // let data = { ...formFields, [event.target.name]: event.target.value };
      let data = JSON.parse(
        JSON.stringify({
          ...formFields,
          [event.target.name]: event.target.value,
        })
      );
      setFormFields(data);
    }
    // set other fields
    else {
      if (event.target.name === "quantity") {
        try {
          let val = parseFloat(event.target.value);
          if (isNaN(val) || val <= 0) {
            // setError("Quantity must be greater than zero");
            // let prevData = { ...formFields };
            let prevData = JSON.parse(JSON.stringify({ ...formFields }));
            setFormFields(prevData);
            throw new Error("Invalid Value");
            // return;
          }
        } catch (error) {
          setError("Quantity must be greater than zero");
          return;
        }
      }

      if (event.target.name === "length") {
        // if (parseFloat(event.target.value) <= -1) {
        //   setError("Length can not be negative");
        //   // let prevData = { ...formFields };
        //   let prevData = JSON.parse(JSON.stringify({ ...formFields }));
        //   setFormFields(prevData);
        //   return;
        // }

        try {
          let val = parseFloat(event.target.value);
          if (isNaN(val) || val <= 0) {
            // setError("Quantity must be greater than zero");
            // let prevData = { ...formFields };
            let prevData = JSON.parse(JSON.stringify({ ...formFields }));
            setFormFields(prevData);
            throw new Error("Invalid Value");
            // return;
          }
        } catch (error) {
          setError("Length must be greater than zero");
          return;
        }
      }

      if (event.target.name === "width") {
        try {
          let val = parseFloat(event.target.value);
          if (isNaN(val) || val <= 0) {
            // setError("Quantity must be greater than zero");
            // let prevData = { ...formFields };
            let prevData = JSON.parse(JSON.stringify({ ...formFields }));
            setFormFields(prevData);
            throw new Error("Invalid Value");
            // return;
          }
        } catch (error) {
          setError("Width must be greater than zero");
          return;
        }
      }

      if (event.target.name === "height") {
        try {
          let val = parseFloat(event.target.value);
          if (isNaN(val) || val <= 0) {
            // setError("Quantity must be greater than zero");
            // let prevData = { ...formFields };
            let prevData = JSON.parse(JSON.stringify({ ...formFields }));
            setFormFields(prevData);
            throw new Error("Invalid Value");
            // return;
          }
        } catch (error) {
          setError("Height must be greater than zero");
          return;
        }
      }

      let data = JSON.parse(JSON.stringify({ ...formFields }));
      let temp = event.target.name;
      if (
        temp === "quantity" ||
        temp === "length" ||
        temp === "width" ||
        temp === "height"
      ) {
        data.Load[index][event.target.name] = parseFloat(event.target.value);
      } else {
        data.Load[index][event.target.name] = event.target.value;
      }

      setFormFields(data);
    }
  };

  const handleVehicleSelect = (event) => {
    console.log(event.target.value);
    if (!event.target.value) {
      return;
    }
    if (parseInt(event.target.value) === -1) {
      return;
    }

    const selectedVehicle = truckType.find(
      (truck) => truck.id === parseInt(event.target.value)
    );
    if (!selectedVehicle) {
      console.log("Here");
      return;
    }

    // let data = { ...formFields, vehicle: selectedVehicle.type };
    let data = JSON.parse(
      JSON.stringify({ ...formFields, vehicleCategory: selectedVehicle.type })
    );
    setFormFields(data);
    // setVehicleCategory(selectedVehicle.type);
  };

  //   const submit = (e) => {
  //     e.preventDefault();
  //     console.log(formFields)
  //   }

  const submit = (e) => {
    e.preventDefault();

    if (!formFields.name) {
      setError("Enter Name for Shipment");
      return;
    }

    if (!formFields.vehicleCategory) {
      setError("Please Select a Vehicle Category");
      return;
    }

    const hasNullCategory = formFields.Load.some(
      (item) => item.category === null
    );

    if (hasNullCategory) {
      // Category is null in at least one Load object
      setError("Category should not be null in all Load objects");
      return;
    }

    let totalVolume = 0;
    formFields.Load.forEach((item) => {
      const volume = item.length * item.width * item.height;
      totalVolume += volume;
    });

    const truckVoulme = truckData[formFields.vehicleCategory].volume;
    if (totalVolume > truckVoulme) {
      setError("Volume of Load is greater than volume of truck");
    }

    //console.log(typeof formFields);
    // let shipmentObject = {
    //   name: name,
    //   Load: [...formFields],
    //   vehicleCategory: vehicleCategory,
    // };
    props.onSubmit({
      ...formFields,
      shared: isShared,
      totalVolume: totalVolume,
    }); // Call the onSubmit prop with the form data
  };

  const addFields = (e) => {
    e.preventDefault();
    let object = {
      length: 1,
      width: 1,
      height: 1,
      quantity: 1,
      category: "",
    };

    let data = JSON.parse(
      JSON.stringify({ ...formFields, Load: [...formFields.Load, object] })
    );
    setFormFields(data);
    // setFormFields({ ...formFields, Load: [...formFields.Load, object] });
  };

  const removeFields = (e, index) => {
    e.preventDefault();
    // let data = { ...formFields };
    let data = JSON.parse(JSON.stringify({ ...formFields }));
    data.Load.splice(index, 1);
    setFormFields(data);
  };

  return (
    <div className="mt-3">
      <div className="container">
        {error && (
          <p
            style={{
              color: "red",
            }}
          >
            {error}
          </p>
        )}
      </div>
      <form onSubmit={submit}>
        <div className="row g-3 align-items-center ps-4 mb-4">
          <div className="col-auto">
            <label for="orderName" className="col-form-label">
              Order Name
            </label>
          </div>
          <div className="col-auto">
            <input
              name="name"
              type="text"
              id="orderName"
              className="form-control"
              onChange={(event) => handleFormChange(event, -1)}
              required
              value={formFields.name}
            />
          </div>
          <div className="col-auto">
            <label for="vehicle" className="col-form-label">
              Vehicle Type
            </label>
          </div>
          <div className="col-auto">
            <select className="form-select" onChange={handleVehicleSelect}>
              <option selected value={-1}>
                Select Vehicle
              </option>
              {truckType &&
                truckType.map((truck) => {
                  return (
                    <option key={truck.id} value={truck.id}>
                      {truck.type}
                    </option>
                  );
                })}
            </select>
          </div>
        </div>

        {formFields.Load.map((form, index) => {
          return (
            // Change Start

            <div key={index}>
              <div className="ps-4 dynamicForm mb-4">
                <div className="row g-3 align-items-center mb-2">
                  <div className="col-auto">
                    <label for="quantity" className="col-form-label">
                      Quantity
                    </label>
                  </div>
                  <div className="col-auto">
                    <input
                      name="quantity"
                      type="number"
                      id="quantity"
                      className="form-control"
                      placeholder="Quantity"
                      onChange={(event) => handleFormChange(event, index)}
                      value={form.quantity}
                      min="1"
                    />
                  </div>

                  <div className="col-auto">
                    <select
                      name="category"
                      className="form-select"
                      value={form.category}
                      onChange={(event) => handleFormChange(event, index)}
                    >
                      <option selected>Category</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select>
                  </div>

                  <div className="col-auto">
                    <button
                      // type="submit"
                      className="btn btn-primary btn-sm button-global p-2 ps-3 pe-3"
                      onClick={(event) => removeFields(event, index)}
                    >
                      Remove
                    </button>

                    {/* <button
                      // type="submit"
                      className="btn btn-primary btn-sm button-global ms-2"
                      onClick={addFields}
                    >
                      +
                    </button> */}
                  </div>
                </div>

                <div className="row g-3 align-items-center mb-2">
                  <div className="col-auto">
                    <label for="length" className="col-form-label">
                      Length
                    </label>
                  </div>
                  <div className="col-auto">
                    <input
                      name="length"
                      type="number"
                      id="length"
                      className="form-control"
                      placeholder="Length"
                      onChange={(event) => handleFormChange(event, index)}
                      value={form.length}
                      min="1"
                    />
                  </div>

                  <div className="col-auto">
                    <label for="width" className="col-form-label">
                      Width
                    </label>
                  </div>
                  <div className="col-auto">
                    <input
                      name="width"
                      type="number"
                      id="width"
                      className="form-control"
                      placeholder="Width"
                      onChange={(event) => handleFormChange(event, index)}
                      value={form.width}
                      min="1"
                    />
                  </div>

                  <div className="col-auto">
                    <label for="height" className="col-form-label">
                      Height
                    </label>
                  </div>
                  <div className="col-auto">
                    <input
                      name="height"
                      type="number"
                      id="height"
                      className="form-control"
                      placeholder="Height"
                      onChange={(event) => handleFormChange(event, index)}
                      value={form.height}
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic From Ends Here */}
            </div>

            // Change End
          );
        })}
      </form>
      <div className="row g-3 align-items-center ps-4 mb-4">
        <div className="col-auto">
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
              className="mb-2 ms-2 ps-4 pe-4 button-global"
              size="sm"
              variant="primary"
              onClick={addFields}
            >
              +
            </Button>
          </ButtonGroup>
        </div>
        {/* <div className="col-auto">
          <button
            // type="submit"
            className="btn btn-primary btn-sm button-global ps-4 pe-4"
            onClick={addFields}
          >
            +
          </button>
        </div> */}
        {/* <div className="col-auto">
          <button
            type="checkbox"
            className="btn btn-primary btn-sm button-global"
            
            onClick={submit}
          >
            Calculate Volume
          </button>
        </div> */}
      </div>
      <div className="container d-flex justify-content-center">
        <ButtonGroup className="mb-2">
          {/* <ToggleButton
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
          </ToggleButton> */}

          <Button
            className="mb-2 ms-2 button-global"
            size=""
            variant="primary"
            onClick={submit}
          >
            Request Shipment
          </Button>
        </ButtonGroup>
      </div>

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
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DynamicForm;
