import React from 'react'
import Sidebar from '../../Components/sidebar/Sidebar';
import Navbar from '../../Components/navbar/Navbar';

import './dashboard.scss';
import Widget from '../../Components/widgets/Widget';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Feature from '../../Components/featured/Feature';
import Chart from '../../Components/chart/Chart';
import Table from '../../Components/table/Table'
import {useState, useEffect} from 'react';
import { getUserStats } from "../../api";

const dashboard = () => {

  const [stats, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
        try {
          const user = await getUserStats();
          console.log(user);
          setData(user.data);
        } catch (error) {
          console.error(error);
        }
    };
    fetchData();
  }, []);

  if (!stats) {
    return <div>Loading...</div>;
  }


  return (
    <div className='Dashboard'>  
         <Sidebar/>   
        <div className='home_container'> 
          <Navbar />

          <div className='widgets'>
            < Widget type="Complete_Shipments" number={stats.shipmentCompleted} />
            < Widget type="Normal_Shippments" number={stats.normalCompleted} />  
            < Widget type="earning" number={stats.totalEarning} />  
            < Widget type="Shared_Shipments" number={stats.sharedCompleted} /> 
          </div>

          <div className="top">
            <h1 className="title"> Normal Shipments:- </h1>
            <MoreVertIcon fontSize='Large'/> 
          </div>

          <div className='widgets'>
            < Widget type="Normal_active" number={stats.normalActive} />
            < Widget type="Normal_In_Progress" number={stats.normalInProgress}/>  
            < Widget type="Normal_Payment_Pending" number={stats.normalPendingPayment}/>  
            < Widget type="Normal_Completed" number={stats.normalCompleted}/>  
          </div>

          <div className="top">
            <h1 className="title"> Shared Shipments </h1>
            <MoreVertIcon fontSize='Large'/> 
          </div>

          <div className='widgets'>
            < Widget type="Shared_active"  number={stats.sharedActive}/>
            < Widget type="Shared_In_Progress" number={stats.sharedInProgress}/>  
            < Widget type="Shared_Payment_Pending" number={stats.sharedPendingPayment}/>  
            < Widget type="Shared_Completed" number={stats.sharedCompleted}/>  
          </div>

          {/* <div className="charts">
            < Feature />
            < Chart aspect={2 / 1} title="Last 6 months Ride stats"/>
          </div> */}

          {/* <div className="listContainer">
            <div className="listTitle">
                < Table />
            </div>
          </div> */}
        </div>
    </div>
  )
}

export default dashboard