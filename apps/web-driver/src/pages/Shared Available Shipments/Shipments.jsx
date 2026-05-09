import "./Shipments.scss"
import Sidebar from "../../Components/sidebar/Sidebar"
import Navbar from "../../Components/navbar/Navbar"
import Shipment_table from "../../Components/Request Shared Shipment table/Shipment_table";

export const Shipments = () => {
  return (
    <div className="Shipments">
      <Sidebar/>

      <div className="ShipmentsContainer">
        <Navbar/>
        <Shipment_table/>
      </div>
      
    </div>
  )
}
export default Shipments