import React, { useState, useEffect } from 'react';
import { Plus, DoorOpen, Home, AlertCircle, RefreshCw } from 'lucide-react';
import adminService from '../../services/admin.service';
import Input from '../common/Input';
import Button from '../common/Button';
import Loading from '../common/Loading';
import Modal from '../common/Modal';

export const RoomManager = () => {
  const [theaters, setTheaters] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' or 'theaters'
  
  // Modals status
  const [isThOpen, setIsThOpen] = useState(false);
  const [isRmOpen, setIsRmOpen] = useState(false);

  // Forms states
  const [thForm, setThForm] = useState({ name: '', address: '', city: 'Ho Chi Minh', phone: '' });
  const [rmForm, setRmForm] = useState({
    name: '',
    theaterId: '',
    type: '2D',
    capacity: 90,
    standardRows: 5,
    vipRows: 3,
    coupleRows: 1,
    seatsPerRow: 10,
  });
  
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const thRes = await adminService.getTheaters();
      setTheaters(thRes);
      
      const rmRes = await adminService.getRooms();
      setRooms(rmRes);

      if (thRes.length > 0) {
        setRmForm((prev) => ({ ...prev, theaterId: thRes[0]._id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleThChange = (e) => setThForm({ ...thForm, [e.target.name]: e.target.value });
  const handleRmChange = (e) => setRmForm({ ...rmForm, [e.target.name]: e.target.value });

  const handleCreateTheater = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await adminService.createTheater(thForm);
      setIsThOpen(false);
      setThForm({ name: '', address: '', city: 'Ho Chi Minh', phone: '' });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setError('');
    
    const capacitySum =
      (parseInt(rmForm.standardRows) + parseInt(rmForm.vipRows)) * parseInt(rmForm.seatsPerRow) +
      parseInt(rmForm.coupleRows) * Math.floor(parseInt(rmForm.seatsPerRow) / 2);

    const payload = {
      ...rmForm,
      capacity: capacitySum,
      standardRows: parseInt(rmForm.standardRows),
      vipRows: parseInt(rmForm.vipRows),
      coupleRows: parseInt(rmForm.coupleRows),
      seatsPerRow: parseInt(rmForm.seatsPerRow),
    };

    try {
      await adminService.createRoom(payload);
      setIsRmOpen(false);
      setRmForm({
        name: '',
        theaterId: theaters[0]?._id || '',
        type: '2D',
        capacity: 90,
        standardRows: 5,
        vipRows: 3,
        coupleRows: 1,
        seatsPerRow: 10,
      });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-dark-border pb-4 gap-4">
        <div>
          <h3 className="text-lg font-black text-zinc-200">Theaters & Halls</h3>
          <p className="text-xs text-zinc-500 mt-1">Configure cinema complexes and generate physical seating charts.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => setIsThOpen(true)} variant="secondary" className="py-2 px-4 text-sm" icon={<Home size={15} />}>
            Add Complex
          </Button>
          <Button onClick={() => setIsRmOpen(true)} variant="primary" className="py-2 px-4 text-sm" icon={<Plus size={16} />}>
            Add Hall / Room
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-dark-border/40 pb-2">
        <button
          onClick={() => setActiveTab('rooms')}
          className={`pb-2 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'rooms' ? 'border-brand text-brand' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Seated Halls ({rooms.length})
        </button>
        <button
          onClick={() => setActiveTab('theaters')}
          className={`pb-2 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'theaters' ? 'border-brand text-brand' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Theater Complexes ({theaters.length})
        </button>
      </div>

      {/* Halls Grid listing */}
      {activeTab === 'rooms' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {rooms.map((rm) => (
            <div key={rm._id} className="bg-dark-card border border-dark-border p-5 rounded-3xl space-y-3 shadow-sm hover:border-zinc-800 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-zinc-200 text-sm flex items-center gap-2">
                    <DoorOpen size={16} className="text-brand" /> {rm.name}
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase">{rm.theater?.name}</span>
                </div>
                <span className="bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded text-[9px] uppercase font-bold text-zinc-400">
                  {rm.type}
                </span>
              </div>
              <div className="text-xs font-semibold text-zinc-500 border-t border-dark-border/40 pt-2 flex justify-between">
                <span>Capacity Layout</span>
                <span className="text-zinc-300">{rm.capacity} Seats generated</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Theater listing */}
      {activeTab === 'theaters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {theaters.map((th) => (
            <div key={th._id} className="bg-dark-card border border-dark-border p-5 rounded-3xl space-y-3 shadow-sm">
              <div>
                <h4 className="font-bold text-zinc-200 text-sm">{th.name}</h4>
                <p className="text-xs text-zinc-400 mt-1">{th.address}, {th.city}</p>
                <p className="text-[10px] text-zinc-500 font-bold mt-0.5">Phone: {th.phone}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Complex Modal */}
      <Modal isOpen={isThOpen} onClose={() => setIsThOpen(false)} title="Register Cinema Complex" size="md">
        <form onSubmit={handleCreateTheater} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <Input name="name" label="Complex Name" placeholder="Nova Cinema Landmark 81" value={thForm.name} onChange={handleThChange} required />
          <Input name="address" label="Street Address" placeholder="Landmark 81, B1 Floor" value={thForm.address} onChange={handleThChange} required />

          <div className="grid grid-cols-2 gap-4">
            <Input name="city" label="City" value={thForm.city} onChange={handleThChange} required />
            <Input name="phone" label="Phone Hotline" placeholder="028 3822 3111" value={thForm.phone} onChange={handleThChange} required />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-dark-border">
            <Button onClick={() => setIsThOpen(false)} variant="secondary" className="px-5 py-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="px-6 py-2">
              Register
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Hall Modal */}
      <Modal isOpen={isRmOpen} onClose={() => setIsRmOpen(false)} title="Register Hall & Generate Seat Map" size="lg">
        <form onSubmit={handleCreateRoom} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input name="name" label="Hall Name" placeholder="Hall 1 (IMAX)" value={rmForm.name} onChange={handleRmChange} required />
            
            {/* Theater Select */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5 pl-0.5">Theater Complex</label>
              <select
                name="theaterId"
                value={rmForm.theaterId}
                onChange={handleRmChange}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg py-2.5 px-3 focus:border-brand outline-none cursor-pointer"
                required
              >
                {theaters.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Projection Format */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5 pl-0.5">Projection Format</label>
              <select
                name="type"
                value={rmForm.type}
                onChange={handleRmChange}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg py-2.5 px-3 focus:border-brand outline-none cursor-pointer"
              >
                <option value="2D">2D</option>
                <option value="3D">3D</option>
                <option value="IMAX">IMAX</option>
                <option value="GOLDCLASS">GOLDCLASS</option>
              </select>
            </div>

            <Input name="seatsPerRow" type="number" label="Seats per Row" placeholder="10" value={rmForm.seatsPerRow} onChange={handleRmChange} required />
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-dark-border/40 pt-4">
            <Input name="standardRows" type="number" label="Standard Seat Rows" placeholder="5" value={rmForm.standardRows} onChange={handleRmChange} required />
            <Input name="vipRows" type="number" label="VIP Seat Rows" placeholder="3" value={rmForm.vipRows} onChange={handleRmChange} required />
            <Input name="coupleRows" type="number" label="Couple Seat Rows" placeholder="1" value={rmForm.coupleRows} onChange={handleRmChange} required />
          </div>

          <p className="text-[10px] text-zinc-500 font-bold bg-zinc-900/60 p-3 rounded-lg border border-dark-border flex items-center gap-2">
            <RefreshCw size={12} className="animate-spin text-brand shrink-0" />
            <span>Seats will be automatically populated inside database using rows mapping alphabet letters (A-Z) and standard prices offsets.</span>
          </p>

          <div className="flex justify-end gap-3 pt-3 border-t border-dark-border">
            <Button onClick={() => setIsRmOpen(false)} variant="secondary" className="px-5 py-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="px-6 py-2">
              Save & Generate Chart
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RoomManager;
