import { io } from "socket.io-client";

export const socket = io(`http://${process.env.BACKLINK}`, {
  autoConnect: false, // 🔥 important
});