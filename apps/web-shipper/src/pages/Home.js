import React, { useState } from "react";
import Navbar from "../components/Navbar";

const Home = () => {
  const [token, setToken] = useState();
  const printToken = async () => {
    const user = await JSON.parse(localStorage.getItem("persist:root"))?.user;
    const currentUser = user && JSON.parse(user).currentUser;
    const TOKEN = currentUser?.token;

    setToken(TOKEN);
    console.log("Token Home Page ->", TOKEN);
  };

  return (
    <div>
      <Navbar />
      Home
      <button onClick={printToken}>Print Token</button>
    </div>
  );
};

export default Home;
