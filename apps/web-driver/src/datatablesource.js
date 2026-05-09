export const userColumns = [
    { field: "customer_id", headerName: "ID", width: 40 },
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
      field: "name",
      headerName: "Name",
      width: 180,
    },
  
    {
      field: "pickupAddress",
      headerName: "Pickup",
      width: 250,
    },
    {
      field: "destinationAddress",
      headerName: "Destination",
      width: 250,
    },
    {
      field: "vehicleCategory",
      headerName: "Vehicle Category",
      width: 130,
    },
    {
      field: "vehiclePart",
      headerName: "Vehicle's Devision",
      width: 130,
    },
    {
      field: "totalVolume",
      headerName: "Total Volume",
      width: 120,
    },
    {
      field: "shared",
      headerName: "Shared",
      width: 70,
      // renderCell: (params) => {
      //   return (
      //     <div className={`cellWithCategory ${params.row.shared}`}>
      //         {params.row.shared}
      //     </div>
      //   );
      //},
    },
    {
      field: "status",
      headerName: "Status",
      width: 70,
      // renderCell: (params) => {
      //   return (
      //     <div className={`cellWithStatus ${params.row.status}`}>
      //       {params.row.status}
      //     </div>
      //   );
      // },
    },
    {
      field: "price",
      headerName: "Price",
      width: 120,
    },
  ];
  
  //temporary data
  export const userRows = [
    {
      id: 1,
      username: "Ahmad Asif",
      img: "https://i.dailymail.co.uk/1s/2019/04/01/17/11723940-6873499-Another_Pakistani_man_featured_in_the_series_is_Zaki_Arshad_a_th-a-100_1554137746764.jpg",
      status: "active",
      email: "ahmad.asif@gmail.com",
      age: 35,
    },
    {
      id: 2,
      username: "Jamie Lannister",
      img: "https://static.vecteezy.com/system/resources/thumbnails/004/607/806/small/man-face-emotive-icon-smiling-bearded-male-character-in-yellow-flat-illustration-isolated-on-white-happy-human-psychological-portrait-positive-emotions-user-avatar-for-app-web-design-vector.jpg",
      email: "2snow@gmail.com",
      status: "passive",
      age: 42,
    },
    {
      id: 3,
      username: "Lannister",
      img: "https://cdn-icons-png.flaticon.com/512/147/147142.png",
      email: "3snow@gmail.com",
      status: "pending",
      age: 45,
    },
    {
      id: 4,
      username: "Stark",
      img: "https://img.freepik.com/free-icon/stewardess_318-210098.jpg?t=st=1672599218~exp=1672599818~hmac=75735756b26a679e96906c4f4d689f10eb3dbf73986a317c113a5d4d0252c79e",
      email: "4snow@gmail.com",
      status: "active",
      age: 16,
    },
    {
      id: 5,
      username: "Targaryen",
      img: "https://img.freepik.com/free-icon/son_318-599519.jpg?t=st=1672599266~exp=1672599866~hmac=b8fcee3a9634aaadff5e584992b00faad74bea6cba84c3d03408cfc2d77acfcf",
      email: "5snow@gmail.com",
      status: "passive",
      age: 22,
    },
    {
      id: 6,
      username: "Melisandre",
      img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      email: "6snow@gmail.com",
      status: "active",
      age: 15,
    },
    {
      id: 7,
      username: "Clifford",
      img: "https://img.freepik.com/free-icon/croupier_318-210091.jpg?t=st=1672599231~exp=1672599831~hmac=c0f67d8f57a51f24e4fd8caf0b53507408b81d05bb29728c7f3b5bfdf579d36d",
      email: "7snow@gmail.com",
      status: "passive",
      age: 44,
    },
    {
      id: 8,
      username: "Frances",
      img: "https://i.pinimg.com/originals/72/cd/96/72cd969f8e21be3476277d12d44c791c.png",
      email: "8snow@gmail.com",
      status: "active",
      age: 36,
    },
    {
      id: 9,
      username: "Roxie",
      img: "https://img.freepik.com/free-icon/user_318-219674.jpg?t=st=1672599365~exp=1672599965~hmac=308065c583603deb367c16f981abac738e97c386d79d4e3a1440f34e0752c6a4",
      email: "snow@gmail.com",
      status: "pending",
      age: 65,
    },
    {
      id: 10,
      username: "Roxie",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRbiMjUoOxJCAMB9poSO2wLg34m7OxmyaT-A&usqp=CAU",
      email: "snow@gmail.com",
      status: "active",
      age: 65,
    },
  ];