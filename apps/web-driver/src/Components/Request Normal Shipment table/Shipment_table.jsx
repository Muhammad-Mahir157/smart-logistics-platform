import "./shipment_table.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { getAllNormalShipments, acceptNormalShipment, getNormalShipments, getSharedShipments } from "../../api";
import { useLocation } from '../../useLocationUpdate';

const Shipment_table = () => {
  const [data, setData] = useState([]);
  const currentLocation = useLocation();
  

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
  const fetch_data = () => {
    getNormalShipments().
    then(driver_normals => {
      console.log(driver_normals);
      getSharedShipments().then(driver_shared =>{

        if(driver_normals.data.length != 1 && driver_shared.data.length != 1) {
          getAllNormalShipments()
          .then(async response => {
            const results = response.data;
            console.log(currentLocation);
            
            const updatedData = await Promise.all(
              results.map(async (row) => {
                const pickupAddress = await getAddressFromCoordinates(row.pickupAddress);
                const destinationAddress = await getAddressFromCoordinates(row.destinationAddress);
            
                const distance = await getDistance(
                  { lat: currentLocation.lat, lng: currentLocation.lng },
                  { lat: row.pickupAddress[0], lng: row.pickupAddress[1] }
                );
      
                return { ...row, pickupAddress, destinationAddress, distance };
              })
            );
      
            
            updatedData.sort((a, b) => {
              return a.distance - b.distance;
          });
        
            
            setData(updatedData);
          })
          .catch(error => {
            // Handle any errors that occur during the request
            console.error("Failed to fetch shipments:", error);
          });
        }
        else {
          setData([]);
        }
      }).catch(error => {
        // Handle any errors that occur during the request
        console.error("Failed to fetch shipments:", error);
      });


  })
  .catch(error => {
    // Handle any errors that occur during the request
    console.error("Failed to fetch shipments:", error);
  });
}


  useEffect(() => {


    getNormalShipments().
    then(driver_normals => {
      console.log(driver_normals);
      getSharedShipments().then(driver_shared =>{

        if(driver_normals.data.length != 1 && driver_shared.data.length != 1) {
          getAllNormalShipments()
          .then(async response => {
            const results = response.data;
      console.log(currentLocation);
      
      const updatedData = await Promise.all(
        results.map(async (row) => {
          const pickupAddress = await getAddressFromCoordinates(row.pickupAddress);
          const destinationAddress = await getAddressFromCoordinates(row.destinationAddress);
      
          const distance = await getDistance(
            { lat: currentLocation.lat, lng: currentLocation.lng },
            { lat: row.pickupAddress[0], lng: row.pickupAddress[1] }
          );

          return { ...row, pickupAddress, destinationAddress, distance };
        })
      );

      
      updatedData.sort((a, b) => {
        return a.distance - b.distance;
    });
  
      
      setData(updatedData);
          })
          .catch(error => {
            // Handle any errors that occur during the request
            console.error("Failed to fetch shipments:", error);
          });
        }
        else {
          setData([]);
        }
      }).catch(error => {
        // Handle any errors that occur during the request
        console.error("Failed to fetch shipments:", error);
      });


  })
  .catch(error => {
    // Handle any errors that occur during the request
    console.error("Failed to fetch shipments:", error);
  });

  }, []); // Empty dependency array to run the effect only once on component mount

  const handleDelete = (id) => {
    setData(data.filter((item) => item._id !== id));
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <button
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              Reject
            </button>

            <button
              className="viewButton"
              onClick={() => handleAccept(params.row._id)}
            >
              Accept
            </button>
          </div>
        );
      },
    },
  ];

  const handleAccept = async (id) => {
    const getLocationPromise = () => {
      return new Promise((resolve) => {
        resolve([currentLocation.lat, currentLocation.lng]);
      });
    };
    const location = await getLocationPromise(currentLocation);

    acceptNormalShipment({ shipment_id: id, driver_location: location})
      .then(response => {
        // Update the data state with the received data
        fetch_data();
        alert("Shipment Accepted")
      })
      .catch(error => {
        // Handle any errors that occur during the request
        console.error("Failed to accept shipments:", error);
        // would use toast
      });
  }

  return (
    <div className="Shipment_table">
      <div className="Shipment_tableTitle">
        All Shipments:
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
