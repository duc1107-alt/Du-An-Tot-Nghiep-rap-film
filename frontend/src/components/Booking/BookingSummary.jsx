import React from 'react';
import { Ticket, Popcorn, CreditCard } from 'lucide-react';
import Button from '../common/Button';

export const BookingSummary = ({
  showtime,
  selectedSeats = [],
  selectedConcessions = {},
  concessionsList = [],
  pricing,
  onProceed,
  proceedText = 'Tiến hành thanh toán',
  disabled = false,
  loading = false,
}) => {
  if (!showtime) return null;

  const movie = showtime.movie || {};
  const theater = showtime.theater || {};
  const room = showtime.room || {};

  const timeString = new Date(showtime.startTime).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const dateString = new Date(showtime.startTime).toLocaleDateString('vi-VN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-dark-card border border-dark-border p-6 rounded-3xl space-y-6 shadow-xl sticky top-24">
      {/* Hóa đơn chi tiết phim */}
      <div className="space-y-2 border-b border-dark-border pb-4">
        <span className="text-[10px] font-black bg-brand px-2 py-0.5 rounded text-white tracking-wide uppercase">
          {movie.rating}
        </span>
        <h3 className="text-xl font-black text-zinc-100 leading-snug">{movie.title}</h3>
        <p className="text-xs text-zinc-400 font-semibold uppercase">
          {theater.name} &bull; {room.name} ({showtime.format})
        </p>
        <p className="text-xs text-zinc-500 font-bold">
          {dateString} &bull; {timeString}
        </p>
      </div>

      {/* Chi tiết đơn giá */}
      <div className="space-y-4 text-xs font-semibold">
        {/* Vé / Ghế */}
        {selectedSeats.length > 0 ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Ticket size={14} className="text-brand" />
              <span>Ghế: {selectedSeats.join(', ')}</span>
            </div>
            <div className="flex justify-between pl-5 text-zinc-500">
              <span>{selectedSeats.length} Vé</span>
              <span className="text-zinc-300 font-bold">{pricing.seatsTotal.toLocaleString('vi-VN')} VNĐ</span>
            </div>
          </div>
        ) : (
          <p className="text-zinc-500 italic">Chưa có ghế nào được chọn.</p>
        )}

        {/* Bắp nước */}
        {Object.keys(selectedConcessions).length > 0 && (
          <div className="space-y-1.5 border-t border-zinc-900 pt-3">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Popcorn size={14} className="text-brand" />
              <span>Bắp nước đã chọn</span>
            </div>
            <div className="space-y-1 pl-5">
              {Object.keys(selectedConcessions).map((id) => {
                const qty = selectedConcessions[id];
                const item = concessionsList.find((c) => c._id === id);
                if (!item) return null;
                return (
                  <div key={id} className="flex justify-between text-zinc-500">
                    <span>
                      {item.name} x {qty}
                    </span>
                    <span className="text-zinc-400">{(item.price * qty).toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                );
              })}
              <div className="flex justify-between pl-0 pt-1 text-zinc-500 border-t border-zinc-900/40">
                <span>Tổng tiền bắp nước</span>
                <span className="text-zinc-300 font-bold">{pricing.concessionsTotal.toLocaleString('vi-VN')} VNĐ</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tổng cộng */}
      <div className="border-t-2 border-dashed border-dark-border pt-4 flex items-center justify-between">
        <span className="text-sm font-black text-zinc-300">Số tiền thanh toán</span>
        <span className="text-xl font-black text-brand tracking-tight">
          {pricing.grandTotal.toLocaleString('vi-VN')} VNĐ
        </span>
      </div>

      {/* Nút hành động */}
      {onProceed && (
        <Button
          onClick={onProceed}
          disabled={disabled || selectedSeats.length === 0}
          loading={loading}
          variant="primary"
          className="w-full py-3"
          icon={<CreditCard size={18} />}
        >
          {proceedText}
        </Button>
      )}
    </div>
  );
};

export default BookingSummary;