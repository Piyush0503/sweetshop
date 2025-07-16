import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/sweets',
});

export default API;
