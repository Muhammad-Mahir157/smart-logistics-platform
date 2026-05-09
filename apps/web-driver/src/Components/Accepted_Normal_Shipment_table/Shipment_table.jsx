import "./shipment_table.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../accepted_Normal_Shipment_source";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from '../../useLocationUpdate';
import { getNormalShipments, cancelNormalShipmentRequest } from "../../api";

const Shipment_table = () => {
  const [data, setData] = useState([]);
  const currentLocation = useLocation();

  const fetch_data = () => {
    getNormalShipments()
    .then(response => {
      // Update the data state with the received data
      console.log(response);
      setData(response.data);
    })
    .catch(error => {
      // Handle any errors that occur during the request
      console.error("Failed to fetch shipments:", error);
    });
  }

  
  // eslint-disable-next-line no-undef
  const geocoder = new google.maps.Geocoder();

  function getAddressFromCoordinates(coordinates) {
    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: { lat: coordinates[0], lng: coordinates[1] } }, (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            resolve(results[0].formatted_address);
          } else {
            reject("No results found");
          }
        } else {
          reject(`Geocode was not successful for the following reason: ${status}`);
        }
      });
    });
  }
  
    
  
    async function getDistance(origin, destination) {
      return new Promise((resolve, reject) => {
        const service = new google.maps.DirectionsService();
        service.route(
          {
            origin,
            destination,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === "OK" && result) {
              resolve(result.routes[0].legs[0].distance.value);
            } else {
              reject(new Error("Failed to get distance."));
            }
          }
        );
      });
    }


  const cancel_normal = (id) => {
    cancelNormalShipmentRequest(id)
    .then(response => {
      alert("Shipment Canceled");
      fetch_data();

    })
    .catch(error => {
      console.error("Error occured while canceling");
    })
  };

  useEffect(() => {
    // Make a GET request to fetch shipment data
    getNormalShipments()
      .then(async response => {
        // Update the data state with the received data by updating the coordinates
        const results = response.data;
        console.log(results);
        
        const updatedData = await Promise.all(
          results.map(async (row) => {
            const pickupAddress = await getAddressFromCoordinates(row.shipment_id.pickupAddress);
            const destinationAddress = await getAddressFromCoordinates(row.shipment_id.destinationAddress);
        
            const distance = await getDistance(
              { lat: currentLocation.lat, lng: currentLocation.lng },
              { lat: row.shipment_id.pickupAddress[0], lng: row.shipment_id.pickupAddress[1] }
            );
        
            return { ...row, pickupAddress, destinationAddress, distance };
          })
        );
        
        setData(updatedData);
      })
      .catch(error => {
        // Handle any errors that occur during the request
        console.error("Failed to fetch shipments:", error);
      });
  }, []); // Empty dependency array to run the effect only once on component mount


  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          
          <div className="cellAction">
            <button disabled = { params.row.status != "Active"? true: false}
              className="deleteButton"
               onClick={() => cancel_normal(params.row._id)}
            >
              Cancel
            </button>

          </div>
        );
      },
    },
  ];
  
  return (
    <div className="Shipment_table">
      <div className="Shipment_tableTitle">
        All Normal Accepted Shipments:
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Shipment_table;
