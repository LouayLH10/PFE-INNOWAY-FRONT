import { io } from "socket.io-client";
const baseURL =
  process.env.NODE_ENV === "production"
    ? `https://${process.env.NEXT_PUBLIC_BACKLINK}`
    : `http://${process.env.NEXT_PUBLIC_BACKLINK}`;
export const socket = io(baseURL, {
  autoConnect: false, // 🔥 important
});