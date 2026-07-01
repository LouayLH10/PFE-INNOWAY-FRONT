import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? `https://${process.env.NEXT_PUBLIC_BACKLINK}`
    : `http://${process.env.NEXT_PUBLIC_BACKLINK}`;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
