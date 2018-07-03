import axios from 'axios';

const API_BASE = localStorage.getItem('API_BASE');

class Axios {
  constructor() {
    this.axios = axios.create({});
    this.axios.interceptors.request.use((config) => {
      const configOptions = config;
      configOptions.headers.common['Content-Type'] = 'application/json';
      configOptions.baseURL = API_BASE;
      return configOptions;
    });
    return this.axios;
  }
  get(path) {
    console.log('path: ', path);
    console.log('params: ', params);
    return this.axios.request({
      method: 'GET',
      url: path,
      headers: {
      },
    });
  }
  post(path, payload) {
    return this.axios.request({
      method: 'POST',
      url: path,
      responseType: 'json',
      data: payload,
      headers: {
      },
    });
  }
  put(path, payload) {
    return this.axios.request({
      method: 'PUT',
      url: path,
      responseType: 'json',
      data: payload,
      headers: {
      },
    });
  }
}

export default new Axios();
