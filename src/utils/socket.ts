import { io } from "socket.io-client";
import { SOCKET_URL } from "./config";

const user = JSON.parse(localStorage.getItem("authUser") || "{}");

if (!user) {
  console.error("No token found in localStorage");
}

const socket = io(SOCKET_URL, {
  auth: {
    token: user?.token,
  },
});
export default socket;
