import'./sidebar.scss';
import DashboardIcon from '@mui/icons-material/GridView';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import LogoutIcon from '@mui/icons-material/Logout';
import LogoutButton from "../logout/LogoutButton";
import NoiseAwareIcon from '@mui/icons-material/NoiseAware';
import PersonIcon from '@mui/icons-material/Person';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import NavigationRoundedIcon from '@mui/icons-material/NavigationRounded';
import { Link } from "react-router-dom";


export const Sidebar = () => {
  return (
    <div className='sidebar'> 
        <div className='top'> 
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className='logo'> Driver Dashboard </span>
        </Link>
        </div>
        <hr />
          <div className='center'> 
            <ul>

                <Link to="/" style={{ textDecoration: "none" }}>
                <li>            
                    <DashboardIcon className="icon" />
                  <span> Dashboard </span>
                </li>
                </Link>

                {/* <Link to="/Shippers" style={{ textDecoration: "none" }}>
                <li>
                  <PersonOutlineOutlinedIcon className="icon"/>
                  <span> Shipers </span>
                </li>
                </Link>
                
                <Link to="/Drivers" style={{ textDecoration: "none" }}>
                <li>
                  < EngineeringOutlinedIcon className="icon"/> 
                  <span> Drivers </span>
                </li>
                </Link> */}

                <Link to="/AvailableNormalShipments" style={{ textDecoration: "none" }}>
                <li>
                  <LocalShippingIcon className="icon"/>
                  <span> Request Normal Shipments </span>
                </li>
                </Link>

                <Link to="/AvailableSharedShipments" style={{ textDecoration: "none" }}>
                <li>
                  <LocalShippingIcon className="icon"/>
                  <span> Request Shared Shipments </span>
                </li>
                </Link>

                <Link to="/NormalShipments" style={{ textDecoration: "none" }}>
                <li>
                  <InboxRoundedIcon className="icon"/>
                  <span> Normal Shipment </span>
                </li>
                </Link>

                <Link to="/SharedShipments" style={{ textDecoration: "none" }}>
                <li>
                  <InboxRoundedIcon className="icon"/>
                  <span> Shared Shipment </span>
                </li>
                </Link>

                <Link to="/CompletedNormalShipments" style={{ textDecoration: "none" }}>
                <li>
                  <CheckCircleOutlineRoundedIcon className="icon"/>
                  <span> Completed Normal Shipment </span>
                </li>
                </Link>

                <Link to="/CompletedSharedShipments" style={{ textDecoration: "none" }}>
                <li>
                  <CheckCircleOutlineRoundedIcon className="icon"/>
                  <span> Completed Shared Shipment </span>
                </li>
                </Link>


                <Link to="/TrackNormalShipments" style={{ textDecoration: "none" }}>
                <li>
                  <NavigationRoundedIcon className="icon"/>
                  <span> Navigation Normal Shipment </span>
                </li>
                </Link>

                <Link to="/TrackSharedShipments" style={{ textDecoration: "none" }}>
                <li>
                  <NavigationRoundedIcon className="icon"/>
                  <span> Navigation Shared Shipment </span>
                </li>
                </Link>
 

                {/* <li>
                  <QueryStatsIcon className="icon"/>
                  <span> Stats </span>
                </li>

                <li>
                  < NotificationsNoneIcon className="icon"/>
                  <span> Notification </span>
                </li>

                <li>
                  < MonitorHeartIcon className="icon"/>
                  <span> System Health </span>
                </li>

                <li>
                  < SettingsApplicationsIcon className="icon"/>
                  <span> Site Settings </span>
                </li>

                <li>
                  < NoiseAwareIcon className="icon"/>
                  <span> Logs </span>
                </li> */}

                <Link to="/Profile" style={{ textDecoration: "none" }}>
                <li>
                < PersonIcon className="icon"/>
                  <span> Profile </span>
                </li>
                </Link>

                <li>
                  < LogoutIcon className="icon"/>
                  <span><LogoutButton /></span>
                </li>

            </ul>
          </div>
          
          <div className='bottom'> 

          <div className="ColorOptions"></div>
          <div className="ColorOptions"></div>
          
          </div>
    </div>
    
  )
}

export default Sidebar