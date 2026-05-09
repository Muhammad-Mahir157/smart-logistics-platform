import "./single.scss";
import Sidebar from "../../Components/sidebar/Sidebar";
import Navbar from "../../Components/navbar/Navbar";
import Chart from "../../Components/chart/Chart";
import List from "../../Components/table/Table";
import React, { useState, useEffect } from 'react';
import { getUserInfo }from "../../api";

const Single = () => {

  const [data, setData] = useState();


  useEffect(() => {
    const fetchData = async () => {
        try {
          const user = await getUserInfo();
          console.log(user.data);
          setData(user.data);
        } catch (error) {
          console.error(error);
        }
    };
    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">

          <div className="left">

            <div className="details">
                <h1 className="itemTitle">Information</h1>

                <div className="detailItem">
                  <span className="itemKey">Full Name: </span>
                  <span className="itemValue">{ data.fullName }</span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Email: </span>
                  <span className="itemValue">{ data.emailAddress }</span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Vehicle: </span>
                  <span className="itemValue">{ data.vehicle }</span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">CC of the Vehicle: </span>
                  <span className="itemValue">{ data.vehicleCC }</span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Registration Number of Vehicle: </span>
                  <span className="itemValue">{ data.vehicleRegistration }</span>
                </div>
            </div>





            {/* <div className="editButton">Edit</div>
            
            <div className="item">
              <img
                src="https://i.dailymail.co.uk/1s/2019/04/01/17/11723940-6873499-Another_Pakistani_man_featured_in_the_series_is_Zaki_Arshad_a_th-a-100_1554137746764.jpg"
                alt=""
                className="itemImg"
              />

              <div className="details">
                <h1 className="itemTitle">{ data.fullName }</h1>

                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{ data.Email }</span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">+923225167288</span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">
                    street #4 Block B, Township, Lahore
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Country:</span>
                  <span className="itemValue">Pakistan</span>
                </div>

              </div>
              
            </div> */}
          </div>

          {/* <div className="right">
            <Chart aspect={3 / 1} title="Last 6 months Ride stats" />
          </div> */}

        </div>

        {/* <div className="bottom">
        <h1 className="title">Last Rides</h1>
          <List/>
        </div> */}

      </div>
    </div>
  );
};

export default Single;