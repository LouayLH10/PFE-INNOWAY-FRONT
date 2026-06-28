import axios from "axios";

export const api = axios.create({
  baseURL: `https://${process.env.NEXT_PUBLIC_BACKLINK}`,
  withCredentials: true,
});