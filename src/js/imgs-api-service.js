import axios from 'axios';

export default class NewApiService {
  constructor() {
    this.searchQuery = '';
    const API_KEY = '37001308-90f28619d2b1daf4121817c5e';
    const BASE_URL = 'https://pixabay.com/api/';
  }

  async fetchImg() {
    try {
      const response = await axios(
        `${this.BASE_URL}?key=${this.API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=1`
      );
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
