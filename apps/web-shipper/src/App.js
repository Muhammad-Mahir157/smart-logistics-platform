// import ShipmentStatus from "./pages/ShipmentStatus";
import RequestShipment from "./pages/RequestShipment";
import Navbar from "./components/Navbar";
// import Navbar from "./components/temp/Navbar";
import Temp from "./pages/Temp";
// eslint-disable-next-line
import { Navigate, Routes } from "react-router-dom";
// import { useLocation } from "react-router-dom";
// eslint-disable-next-line
import { BrowserRouter as Router, Route } from "react-router-dom";
// import TrackDriver from "./pages/TrackDriver";
import MapPage from "./pages/MapPage";
import { useJsApiLoader } from "@react-google-maps/api";
import TrackSharedShipments from "./pages/TrackSharedShipments";
import TrackNormalShipments from "./pages/TrackNormalShipments";
import PrivateRoute from "./PrivateRoute";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import "./styles/globals.css";
import Status from "./pages/Status";
import Payment from "./pages/Payment";

function App() {
  const user = useSelector((state) => state.user.currentUser);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Google Map is Loading ...</div>;

  return (
    // <div>
    //   <PlaceOrder/>
    //   <DriverRequests/>
    // </div>

    <div className="App">
      <Router>
        {/* <Navbar /> */}

        <Routes>
          {/* <Route
            exact
            path="/"
            element={user ? <Home /> : <Navigate replace to={"/login"} />}
          /> */}
          {/* <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> */}
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate replace to={"/"} />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate replace to={"/"} />}
          />
          {/* <Route path="/" element={<PrivateRoute />}> */}
          <Route path="shipmentstatus" element={<Status />} />
          {/* <Route path="requestshipment" element={<RequestShipment />} /> */}
          <Route
            path="/"
            element={
              user ? <RequestShipment /> : <Navigate replace to={"/login"} />
            }
          />
          <Route
            path="tracknormalshipments"
            element={<TrackNormalShipments />}
          />
          <Route
            path="tracksharedshipments"
            element={<TrackSharedShipments />}
          />
          <Route path="payment" element={<Payment />} />
          <Route path="mappage" element={<MapPage />} />
          <Route path="testpage" element={<Temp />} />
          {/* </Route> */}
        </Routes>
      </Router>
    </div>

    // <PlaceOrder/>
    // <DriverRequests/>
  );
}

/* <Route
          exact
          path="/"
          element={user ? <Home /> : <Navigate replace to={"/login"} />}
        /> */

export default App;
