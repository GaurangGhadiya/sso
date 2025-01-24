// utils/api.js
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export const apiUrlJava = "https://himparivarservices.hp.gov.in/himparivar-dashboard/api/";

export default instance;
