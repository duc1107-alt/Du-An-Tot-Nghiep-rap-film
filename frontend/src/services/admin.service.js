import api from './api';

// Movie Management
const createMovie = async (movieData) => {
  const response = await api.post('/admin/movies', movieData);
  return response.data;
};

const updateMovie = async (id, movieData) => {
  const response = await api.put(`/admin/movies/${id}`, movieData);
  return response.data;
};

const deleteMovie = async (id) => {
  const response = await api.delete(`/admin/movies/${id}`);
  return response.data;
};

// Theater & Room Management
const getTheaters = async () => {
  const response = await api.get('/admin/theaters');
  return response.data;
};

const createTheater = async (theaterData) => {
  const response = await api.post('/admin/theaters', theaterData);
  return response.data;
};

const getRooms = async (theaterId = '') => {
  const response = await api.get('/admin/rooms', {
    params: theaterId ? { theaterId } : {},
  });
  return response.data;
};

const createRoom = async (roomData) => {
  const response = await api.post('/admin/rooms', roomData);
  return response.data;
};

// Showtime Management
const createShowtime = async (showtimeData) => {
  const response = await api.post('/admin/showtimes', showtimeData);
  return response.data;
};

const updateShowtime = async (id, showtimeData) => {
  const response = await api.put(`/admin/showtimes/${id}`, showtimeData);
  return response.data;
};

const deleteShowtime = async (id) => {
  const response = await api.delete(`/admin/showtimes/${id}`);
  return response.data;
};

// Concessions
const getConcessions = async () => {
  const response = await api.get('/admin/concessions');
  return response.data;
};

const createConcession = async (concessionData) => {
  const response = await api.post('/admin/concessions', concessionData);
  return response.data;
};

const updateConcession = async (id, concessionData) => {
  const response = await api.put(`/admin/concessions/${id}`, concessionData);
  return response.data;
};

// Dashboard Stats & Revenue Reports
const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard/stats');
  return response.data;
};

const getRevenueReport = async () => {
  const response = await api.get('/admin/dashboard/revenue');
  return response.data;
};

const adminService = {
  createMovie,
  updateMovie,
  deleteMovie,
  getTheaters,
  createTheater,
  getRooms,
  createRoom,
  createShowtime,
  updateShowtime,
  deleteShowtime,
  getConcessions,
  createConcession,
  updateConcession,
  getDashboardStats,
  getRevenueReport,
};

export default adminService;
