import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5001/api/register', form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-slate-50 font-['Public Sans','Noto Sans',sans-serif]"
    >
      <header className="flex items-center justify-between border-b border-[#e7edf3] px-10 py-3">
        <div className="flex items-center gap-4 text-[#0e141b]">
          <div className="size-4">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold">BudgetTracker</h2>
        </div>
      </header>

      <main className="flex flex-1 justify-center items-start px-4 py-6">
        <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-6">
          <h2 className="text-[28px] font-bold text-[#0e141b] text-center pb-3 pt-5">
            Create your account
          </h2>

          {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4 max-w-[480px] mx-auto">
            <div>
              <label className="block text-base font-medium text-[#0e141b] mb-2">Username</label>
              <input
                name="name"
                placeholder="Enter your username"
                value={form.name}
                onChange={handleChange}
                className="w-full h-14 p-[15px] rounded-lg bg-slate-50 border border-[#d0dbe7] placeholder:text-[#4e7097] text-[#0e141b] focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-[#0e141b] mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="w-full h-14 p-[15px] rounded-lg bg-slate-50 border border-[#d0dbe7] placeholder:text-[#4e7097] text-[#0e141b] focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-[#0e141b] mb-2">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="w-full h-14 p-[15px] rounded-lg bg-slate-50 border border-[#d0dbe7] placeholder:text-[#4e7097] text-[#0e141b] focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#1978e5] hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition"
            >
              Register
            </button>
          </form>

          <p className="text-[#4e7097] text-sm text-center mt-4 underline">
            Already have an account? <Link to="/" className="hover:text-blue-600">Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Register;
