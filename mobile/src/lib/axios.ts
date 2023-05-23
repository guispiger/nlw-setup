import axios from "axios";

export const api = axios.create({
// caso nao definido o host no server fastfy    baseURL: 'http://10.0.2.2:3333'
    baseURL: 'http://192.168.0.106:3333'
});