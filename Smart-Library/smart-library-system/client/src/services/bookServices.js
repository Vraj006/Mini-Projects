import axios from 'axios';

const API_URL = 'http://localhost:5000/api/books';

const bookService = {
  getAllBooks: async () => {
    try {
      const response = await axios.get(API_URL);
      return response;
    } catch (error) {
      throw error;
    }
  },

  searchBooks: async (query) => {
    try {
      const response = await axios.get(`${API_URL}/search?query=${query}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  borrowBook: async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/${bookId}/borrow`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  reserveBook: async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/${bookId}/reserve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  getBookById: async (bookId) => {
    const response = await axios.get(`${API_URL}/${bookId}`);
    return response;
  },

  returnBook: async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/${bookId}/return`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default bookService;
