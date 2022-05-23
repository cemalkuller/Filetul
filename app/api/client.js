import { API_URL } from "@env"
import axios from 'axios';

export default axios.create({ baseURL: `${API_URL}/api/` });
export const jwt = (token) => axios.create({
     baseURL: `${API_URL}/api/`,
    headers: {'Authorization': 'Bearer '+token}
  });