import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

const userService = {
  getUserBooks: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/books`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('User books response:', response.data); // Debug log
      return response;
    } catch (error) {
      console.error('Error fetching user books:', error);
      throw error;
    }
  },

  returnBook: async (bookId) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/books/${bookId}/return`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  cancelReservation: async (bookId) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/books/${bookId}/cancel-reservation`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response;
  }
};

export default userService;
