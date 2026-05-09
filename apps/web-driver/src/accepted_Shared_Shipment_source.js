export const userColumns = [
    // { 
    //     field: "_id", 
    //     headerName: "ID", 
    //     width: 40 
    // },
    // {
    //   field: "user",
    //   headerName: "User",
    //   width: 230,
    //   renderCell: (params) => {
    //     return (
    //       <div className="cellWithImg">
    //         <img className="cellImg" src={params.row.img} alt="avatar" />
    //         {params.row.username}
    //       </div>
    //     );
    //   },
    // },
    {
      field: "customer_shipment_id",
      headerName: "Customer Shipment ID",
      width: 180,
      valueGetter: (params) => params.row.customer_shipment_id._id,
    },
    { 
        field: "customer_id", 
        headerName: "Customer ID", 
        width: 140 ,
        valueGetter: (params) => params.row.customer_shipment_id.customer_id,
    },
    {
      field: "pickupAddress",
      headerName: "Pickup",
      width: 200,
      valueGetter: (params) => params.row.pickupAddress,
    },
    {
      field: "destinationAddress",
      headerName: "Destination",
      width: 200,
      valueGetter: (params) => params.row.destinationAddress,
    },
    {
      field: "vehicleCategory",
      headerName: "Vehicle Category",
      width: 130,
      valueGetter: (params) => params.row.customer_shipment_id.vehicleCategory,
    },
    {
      field: "vehiclePart",
      headerName: "Vehicle's Devision",
      width: 130,
      valueGetter: (params) => params.row.customer_shipment_id.vehiclePart,
    },
    {
      field: "totalVolume",
      headerName: "Total Volume",
      width: 120,
      valueGetter: (params) => params.row.customer_shipment_id.totalVolume,
    },
    {
        field: "price",
        headerName: "Total Volume",
        width: 120,
        valueGetter: (params) => params.row.customer_shipment_id.price,
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params) => {
        return (
          <div className={`cellWithStatus ${params.row.status.replace(/\s+/g, '-')}`}>
            {params.row.status}
          </div>
        );
      },
    },
    // {
    //   field: "driver_location",
    //   headerName: "Driver's Location",
    //   width: 120,
    // },
  ];