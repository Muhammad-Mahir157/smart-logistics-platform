import axios from "axios";
const BASE_URL = "http://localhost:5000/api/";
// const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODEwZDM1NzIzNDk4OWRjMWVmYzM4ZSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY2OTQ4NDEyMiwiZXhwIjoxNjY5NzQzMzIyfQ.Ykwgu1vZLQa1QPkBByubrmBLWLSL1JXn1mzCSGX-oVM";
// let TOKEN = "";
// if (localStorage.getItem("persist:root").user) {
//   TOKEN = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user)
//     .currentUser.accessToken;
// }
const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
const currentUser = user && JSON.parse(user).currentUser;
const TOKEN = currentUser?.token;

console.log("Token Request Method ->", TOKEN);

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});
export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: {
    token: `Bearer ${TOKEN}`,
  },
});
