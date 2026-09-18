import axios from "axios";
import { server } from "../config/api"; 
const api = axios.create({
  baseURL: server,
  headers: { "Content-Type": "application/json" }
});

export default api;
