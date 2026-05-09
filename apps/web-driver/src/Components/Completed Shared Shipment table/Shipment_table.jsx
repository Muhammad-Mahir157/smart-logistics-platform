import "./shipment_table.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../accepted_Shared_Shipment_source";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { getAllCompletedSharedShipments } from "../../api";
//import { useLocation } from '../../useLocationUpdate';

const Shipment_table = () => {
  const [data, setData] = useState([]);


  
  
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
  

  useEffect(() => {
    // Make a GET request to fetch shipment data
    getAllCompletedSharedShipments()
      .then(async response => {
        // Update the data state with the received data
        const results = response.data;
        
        const updatedData = await Promise.all(
          results.map(async (row) => {
            const pickupAddress = await getAddressFromCoordinates(row.customer_shipment_id.pickupAddress);
            const destinationAddress = await getAddressFromCoordinates(row.customer_shipment_id.destinationAddress);
        
            return { ...row, pickupAddress, destinationAddress };
          })
        );
        
        setData(updatedData);
      })
      .catch(error => {
        // Handle any errors that occur during the request
        console.error("Failed to fetch shipments:", error);
      });
  }, []); // Empty dependency array to run the effect only once on component mount


  return (
    <div className="Shipment_table">
      <div className="Shipment_tableTitle">
        All Completed Shared Shipments:
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Shipment_table;
