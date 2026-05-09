import Dashboard from "./pages/Dashboard/Dashboard"
import Single_Driver from "./pages/single/Single";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/Signup";
import { shipperInputs, driverInputs } from "./formSource";
import NormalShipments from "./pages/Normal Shipments/Shipments";
import SharedShipments from "./pages/Shared_Shipments/Shipments";
import TrackNormalShipments from "./pages/Track_Shipments/NavigationNormal";
import TrackSharedShipments from "./pages/Track_Shipments/NavigationShared";
import AvailableNormalShipments from "./pages/Normal Available Shipments/Shipments";
import AvailableSharedShipments from "./pages/Shared Available Shipments/Shipments";
import CompleteNomal from "./pages/Completed Normal Shipment/Shipments";
import CompleteShared from "./pages/Completed Shared Shipment/Shipments";
import PrivateRoute from "./PrivateRoute";

import { useJsApiLoader } from "@react-google-maps/api";

import {
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  
  if (!isLoaded) return <div>Google Map is Loading ...</div>;


  return (
    <div className="App">
      <BrowserRouter>
          <Routes>

              	<Route exact path="/login" element={<Login />} />
                <Route exact path="/signup" element={<SignUp />} />
              <Route path='/' element={<PrivateRoute />}>
                <Route index element={<Dashboard/>} />

                  <Route path="AvailableNormalShipments">
                      <Route index element={<AvailableNormalShipments/>} />
                  </Route>

                  <Route path="AvailableSharedShipments">
                      <Route index element={<AvailableSharedShipments/>} />
                  </Route>

                    <Route path="NormalShipments">
                      <Route index element={<NormalShipments/>} />
                    </Route>

                    <Route path="SharedShipments">
                      <Route index element={<SharedShipments/>} />
                    </Route>

                    <Route path="CompletedNormalShipments">
                      <Route index element={<CompleteNomal/>} />
                    </Route>

                    <Route path="CompletedSharedShipments">
                      <Route index element={<CompleteShared/>} />
                    </Route>


                    <Route path="TrackNormalShipments">
                      <Route index element={<TrackNormalShipments/>} />
                    </Route>

                    <Route path="TrackSharedShipments">
                      <Route index element={<TrackSharedShipments/>} />
                    </Route>

                    <Route path="Profile">
                      <Route index element={<Single_Driver/>} />
                    </Route>

              </Route>
             
          </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
