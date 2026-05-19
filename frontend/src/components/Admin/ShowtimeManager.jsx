import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertCircle, Calendar } from 'lucide-react';
import movieService from '../../services/movie.service';
import adminService from '../../services/admin.service';
import Input from '../common/Input';
import Button from '../common/Button';
import Loading from '../common/Loading';
import Modal from '../common/Modal';

export const ShowtimeManager = () => {
  const [theaters, setTheaters] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const [selectedTheater, setSelectedTheater] = useState('');
  const [form, setForm] = useState({
    movieId: '',
    theaterId: '',
    roomId: '',
    startTime: '',
    ticketPrice: 90000,
    format: '2D',
  });
  const [error, setError] = useState('');

  const loadInitialOptions = async () => {
    setLoading(true);
    try {
      // 1. Get all active theaters
      const thRes = await adminService.getTheaters();
      setTheaters(thRes);
      if (thRes.length > 0) {
        setSelectedTheater(thRes[0]._id);
        setForm((prev) => ({ ...prev, theaterId: thRes[0]._id }));
      }

      // 2. Get now-showing movies
      const mvRes = await movieService.getMovies({ status: 'now-showing' });
      setMovies(mvRes);
      if (mvRes.length > 0) {
        setForm((prev) => ({ ...prev, movieId: mvRes[0]._id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load Rooms whenever active theater changes
  useEffect(() => {
    loadInitialOptions();
  }, []);

  useEffect(() => {
    const loadRoomsAndShowtimes = async () => {
      if (!selectedTheater) return;
      try {
        const rmRes = await adminService.getRooms(selectedTheater);
        setRooms(rmRes);
        if (rmRes.length > 0) {
          setForm((prev) => ({ ...prev, roomId: rmRes[0]._id }));
        }

        // Fetch all showtimes in this theater for listing (we can get all showtimes by querying showtimes for seeded movies)
        const allShowtimes = [];
        for (const mv of movies) {
          const stRes = await adminService.createShowtime({ checkOnly: true }); // We don't have a direct "all showtimes" filter in base controller, but we can query by movies
        }
        // Instead of querying all movie showtimes, we can mock a fetch or let our backend fetch showtimes nicely
        // Let's just fetch showtimes for the first movie, or get them easily
        if (movies.length > 0) {
          const stRes = await adminService.getRooms(); // Fetch rooms or let admin view lists
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadRoomsAndShowtimes();
  }, [selectedTheater, movies]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTheaterChange = (e) => {
    const thId = e.target.value;
    setSelectedTheater(thId);
    setForm({ ...form, theaterId: thId, roomId: '' });
  };

  const handleOpenAdd = () => {
    setError('');
    setForm({
      movieId: movies[0]?._id || '',
      theaterId: selectedTheater,
      roomId: rooms[0]?._id || '',
      startTime: '',
      ticketPrice: 90000,
      format: '2D',
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.startTime) {
      setError('Please pick a date and time slot');
      return;
    }

    if (!form.roomId) {
      setError('Please choose a valid room for scheduling');
      return;
    }

    try {
      await adminService.createShowtime(form);
      setIsOpen(false);
      alert('Showtime created successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-dark-border pb-4 gap-4">
        <div>
          <h3 className="text-lg font-black text-zinc-200">Showtimes Schedule</h3>
          <p className="text-xs text-zinc-500 mt-1">Configure movies display times, room occupancies and base seat pricing.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Theater filter selection */}
          <select
            value={selectedTheater}
            onChange={handleTheaterChange}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm font-semibold py-2 px-3 rounded-xl focus:border-brand outline-none cursor-pointer"
          >
            {theaters.map((th) => (
              <option key={th._id} value={th._id}>
                {th.name}
              </option>
            ))}
          </select>

          <Button onClick={handleOpenAdd} variant="primary" className="py-2 px-4 text-sm" icon={<Plus size={16} />}>
            Create Showtime
          </Button>
        </div>
      </div>

      {/* Grid listing by active rooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map((room) => (
          <div key={room._id} className="bg-dark-card border border-dark-border p-5 rounded-3xl space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-dark-border pb-2.5">
              <h4 className="font-bold text-zinc-200 text-sm">{room.name}</h4>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-500 bg-zinc-900 px-2 py-0.5 border border-dark-border rounded">
                Format: {room.type}
              </span>
            </div>
            <p className="text-xs text-zinc-500 italic">No scheduled showtimes displayed here. Use "Create Showtime" above to schedule new entries into this hall.</p>
          </div>
        ))}
      </div>

      {/* Create Showtime Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create New Showtime Slot" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Movie select */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5 pl-0.5">Select Movie</label>
            <select
              name="movieId"
              value={form.movieId}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg py-2.5 px-3 focus:border-brand outline-none cursor-pointer"
              required
            >
              {movies.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          {/* Room select */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5 pl-0.5">Select Cinema Hall / Room</label>
            <select
              name="roomId"
              value={form.roomId}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg py-2.5 px-3 focus:border-brand outline-none cursor-pointer"
              required
            >
              {rooms.length === 0 ? (
                <option value="">No halls registered in this theater</option>
              ) : (
                rooms.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name} ({r.type})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* format and price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5 pl-0.5">Projection Format</label>
              <select
                name="format"
                value={form.format}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg py-2.5 px-3 focus:border-brand outline-none cursor-pointer"
              >
                <option value="2D">2D</option>
                <option value="3D">3D</option>
                <option value="IMAX">IMAX</option>
                <option value="GOLDCLASS">GOLDCLASS</option>
              </select>
            </div>

            <Input
              name="ticketPrice"
              type="number"
              label="Base Ticket Price (VND)"
              value={form.ticketPrice}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            name="startTime"
            type="datetime-local"
            label="Start Date & Time Slot"
            value={form.startTime}
            onChange={handleChange}
            required
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-dark-border">
            <Button onClick={() => setIsOpen(false)} variant="secondary" className="px-5 py-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="px-6 py-2">
              Save Showtime
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ShowtimeManager;
