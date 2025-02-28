import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notifications';

const notificationService = {
  getNotifications: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/${notificationId}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

export default notificationService;