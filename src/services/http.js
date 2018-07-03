export default class Http {
  constructor(httpClient) {
    this.service = httpClient;
    return this.service;
  }
  get() {
    this.service.get();
  }
  post() {
    this.service.post();
  }
  put() {
    this.service.put();
  }
}
