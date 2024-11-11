import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const getProfile = async () => {
    const response = await axios.get(`${API_URL}/user/profile`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

export const updatePassword = async (newPassword) => {
    await axios.patch(
        `${API_URL}/user/profile`,
        { password: newPassword },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
    );
};

// Assign the object to a variable before exporting
const api = {
    getProfile,
    updatePassword,
};

export default api;
