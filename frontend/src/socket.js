// socket.js
import { io } from "socket.io-client";

const ENDPOINT = import.meta.env.VITE_URL;
let socket;

export const initSocket = (user) => {
  if (!socket) {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
  }
  return socket;
};

export const getSocket = () => socket;
