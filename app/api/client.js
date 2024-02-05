import { API_URL , REMOTE_IP } from "@env"
import axios from 'axios';
axios.interceptors.request.use(request => {
  console.log('Starting Request', JSON.stringify(request, null, 2))
  return request
})

axios.interceptors.response.use(response => {
  console.log('Response:', JSON.stringify(response, null, 2))
  return response
})

export default axios.create({ baseURL: `${REMOTE_IP}` });


export const jwt = (token) => axios.create({
     baseURL: `${REMOTE_IP}`,
    headers: {'Authorization': 'Bearer '+token}
  });

  export const remote =  axios.create({ baseURL: `${REMOTE_IP}` });

  