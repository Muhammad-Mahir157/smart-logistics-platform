import './widget.scss'
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import React, { useState, useEffect } from 'react';
import { getUserStats } from "../../api";


export const Widget = ({type, number}) => {
  let data;
  switch(type){
    case "Complete_Shipments":
      data = {
          title: "Completed Shipments",
          isNumber: number,
          // per: 18,
          // icon: (
          // < PersonOutlineOutlinedIcon 
          // className='icon'
          // style={{
          //   color: "crimson",
          //   backgroundColor: "rgba(255,0,0,0.2)",
          // }}
          // />
          // ),
      }
      break;

    case "Normal_Shippments":
      data = {
          title: "Normal Shipments",
          isNumber: number,
          // per: 27,
          // icon: (
          //   < RocketLaunchIcon 
          //   className='icon'
          //   style={{
          //     color: "	goldenrod",
          //     backgroundColor: "rgba(218,165,32,0.2)",
          //   }}
          //   />
          //   ),
      }
      break;
    
    case "earning":
      data = {
          title: "EARNINGS",
          isNumber:  number,
          // per: 12,
          // icon: (
          //   < MonetizationOnIcon 
          //   className='icon'
          //   style={{
          //     color: "green",
          //     backgroundColor: "rgba(81, 221, 16, 0.5)",
          //   }}
          //   />
          //   ),
      }
      break;

    case "Shared_Shipments":
      data = {
          title: "Shared Shipments",
          isNumber:  number,
          // per: 31,
          // icon: (
          //   < ManageSearchIcon 
          //   className='icon'
          //   style={{
          //     color: "pirple",
          //     backgroundColor: "rgba(135, 75, 219, 0.7)",
          //   }}
          //   />
          //   ),
      }
      break;

      case "Normal_active":
      data = {
          title: "Active",
          isNumber: number,
          // per: 31,
          // icon: (
          //   < ManageSearchIcon 
          //   className='icon'
          //   style={{
          //     color: "pirple",
          //     backgroundColor: "rgba(135, 75, 219, 0.7)",
          //   }}
          //   />
          //   ),
      }
      break;

      case "Normal_In_Progress":
      data = {
          title: "in progress",
          isNumber:  number,
          // per: 31,
          // icon: (
          //   < ManageSearchIcon 
          //   className='icon'
          //   style={{
          //     color: "pirple",
          //     backgroundColor: "rgba(135, 75, 219, 0.7)",
          //   }}
          //   />
          //   ),
      }
      break;

      case "Normal_Payment_Pending":
      data = {
          title: "Payment Pending",
          isNumber: number,
          // per: 31,
          // icon: (
          //   < ManageSearchIcon 
          //   className='icon'
          //   style={{
          //     color: "pirple",
          //     backgroundColor: "rgba(135, 75, 219, 0.7)",
          //   }}
          //   />
          //   ),
      }
      break;

      case "Normal_Completed":
      data = {
          title: "Completed",
          isNumber: number,
          // per: 31,
          // icon: (
          //   < ManageSearchIcon 
          //   className='icon'
          //   style={{
          //     color: "pirple",
          //     backgroundColor: "rgba(135, 75, 219, 0.7)",
          //   }}
          //   />
          //   ),
      }
      break;

      case "Shared_active":
        data = {
            title: "Active",
            isNumber: number
            // per: 31,
            // icon: (
            //   < ManageSearchIcon 
            //   className='icon'
            //   style={{
            //     color: "pirple",
            //     backgroundColor: "rgba(135, 75, 219, 0.7)",
            //   }}
            //   />
            //   ),
        }
        break;
  
        case "Shared_In_Progress":
        data = {
            title: "in progress",
            isNumber: number,
            // per: 31,
            // icon: (
            //   < ManageSearchIcon 
            //   className='icon'
            //   style={{
            //     color: "pirple",
            //     backgroundColor: "rgba(135, 75, 219, 0.7)",
            //   }}
            //   />
            //   ),
        }
        break;
  
        case "Shared_Payment_Pending":
        data = {
            title: "Payment Pending",
            isNumber: number,
            // per: 31,
            // icon: (
            //   < ManageSearchIcon 
            //   className='icon'
            //   style={{
            //     color: "pirple",
            //     backgroundColor: "rgba(135, 75, 219, 0.7)",
            //   }}
            //   />
            //   ),
        }
        break;
  
        case "Shared_Completed":
        data = {
            title: "Completed",
            isNumber:  number,
            // per: 31,
            // icon: (
            //   < ManageSearchIcon 
            //   className='icon'
            //   style={{
            //     color: "pirple",
            //     backgroundColor: "rgba(135, 75, 219, 0.7)",
            //   }}
            //   />
            //   ),
        }
        break;

      default:
        break;
  }


  return (
    <div className='widget'> 
        <div className="left">
            <span className="title">{data.title}</span>
            <span className="counter">
              {data.isNumber }
              </span>
            <span className="link">{data.link}</span>
        </div>

        <div className="right">
            <div className="percentage positive">
            <ExpandLessIcon/> {data.per} % 
            </div>
            
            {data.icon}
        </div>

    </div>
  )
}

export default Widget