/* Creating a new instance of axios with a baseURL of /api. */
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});
export default api;
