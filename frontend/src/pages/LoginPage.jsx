import React, { useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Film } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import LoginForm from '../components/Auth/LoginForm';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, reset } = useAuth();
  
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    // If user is already logged in, redirect immediately
    if (isAuthenticated) {
      navigate(redirect);
    }
    return () => reset(); // Reset errors on exit
  }, [isAuthenticated, navigate, redirect]);

  const handleLoginSuccess = () => {
    navigate(redirect);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-dark-card border border-dark-border p-8 rounded-3xl shadow-xl space-y-6">
        {/* Visual Brand Icon */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="bg-brand p-3 rounded-2xl shadow-[0_0_20px_rgba(229,9,20,0.5)]">
            <Film className="text-white" size={28} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider text-center">
            Đăng nhập vào <span className="text-brand">Nova Cinematic</span>
          </h2>
          <p className="text-xs text-zinc-500 text-center">Chọn ghế ngồi ưng ý và thanh toán chỉ trong vài giây.</p>
        </div>

        {/* Form */}
        <LoginForm onSuccess={handleLoginSuccess} />

        <div className="text-center text-xs font-semibold text-zinc-500 border-t border-dark-border/40 pt-4">
          <span>Chưa có tài khoản Nova Cinematic? </span>
          <Link
            to={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="text-brand font-black hover:underline"
          >
            Tạo tài khoản
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;