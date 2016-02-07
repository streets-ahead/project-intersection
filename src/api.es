import axios from 'axios';

export default {
  async getIndex(prefix) {
    const result = await axios.get((prefix || "") + '/index.json');
    return result.data;
  },
  
  async getContent(path, prefix) {
    const result = await axios.get((prefix || "") + "/" + path + '.json');
    return result.data;
  }
}
