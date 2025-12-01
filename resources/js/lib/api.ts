import axios from 'axios';

const api = axios.create({
    withCredentials: true,
});

api.interceptors.request.use(async (config) => {
    const method = config.method?.toUpperCase();

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method!)) {
        await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
    }

    return config;
});

export default api;
