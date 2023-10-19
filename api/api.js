import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.1.4:4000', // If using an emulator, replace 'your_server_ip' accordingly
});

export default api;
