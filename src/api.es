import axios from 'axios';

export default {
  async getPosts(prefix) {
    const result = await axios.get((prefix || "") + '/api/posts');
    return result.data;
  },
  
  async getContent(path, prefix) {
    const result = await axios.get((prefix || "") + "/api/" + path);
    return result.data;
  }
}
