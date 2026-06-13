import React, { useState } from 'react';
import { User } from '../types';
import { motion } from 'motion/react';
import { BookOpen, UserCheck, Key, Smile, Sparkles, GraduationCap } from 'lucide-react';
import { speakVietnamese } from '../utils/speechSynthesis';

interface AuthProps {
  onLoginSuccess: (user: User) => void;
}

export function Auth({ onLoginSuccess }: AuthProps) {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const getStoredUsers = (): User[] => {
    const raw = localStorage.getItem('english_l3_users');
    return raw ? JSON.parse(raw) : [];
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ Tên đăng nhập và Mật khẩu nhé!');
      speakVietnamese('Vui lòng điền đầy đủ thông tin con nhé!');
      return;
    }

    if (isRegister && !fullName.trim()) {
      setError('Vui lòng cho cô biết Họ và Tên của con nha!');
      speakVietnamese('Vui lòng điền họ và tên của con nha!');
      return;
    }

    const users = getStoredUsers();
    const existing = users.find(u => u.username.toLowerCase() === username.toLowerCase().trim());

    if (isRegister) {
      if (existing) {
        setError('Tên đăng nhập này đã có bạn dùng rồi. Con hãy chọn tên khác nhé!');
        speakVietnamese('Tên đăng nhập đã tồn tại con ơi.');
        return;
      }

      const newUser: User = {
        username: username.trim(),
        fullName: fullName.trim(),
        password: password, // Simple plain text for demo as requested
        lessonsCompleted: [],
        scoreVocabulary: 0,
        scoreSentence: 0,
        scorePronunciation: 0,
        practiceHistory: [],
        totalScore: 0,
        lastActive: new Date().toLocaleDateString('vi-VN')
      };

      users.push(newUser);
      localStorage.setItem('english_l3_users', JSON.stringify(users));
      setSuccess('Đăng ký thành công rồi! Bây giờ hãy đăng nhập để học cùng cô Lucy nhé! 🎉');
      speakVietnamese('Đăng ký thành công rồi! Chúc mừng con!');
      setIsRegister(false);
      setUsername(newUser.username);
      setPassword('');
    } else {
      if (!existing || existing.password !== password) {
        setError('Tên đăng nhập hoặc mật khẩu chưa đúng rồi. Con kiểm tra lại nhé! 🧐');
        speakVietnamese('Sai mật khẩu rồi con ơi.');
        return;
      }

      // Update last active
      existing.lastActive = new Date().toLocaleDateString('vi-VN');
      const updatedUsers = users.map(u => u.username === existing.username ? existing : u);
      localStorage.setItem('english_l3_users', JSON.stringify(updatedUsers));

      speakVietnamese(`Chào mừng ${existing.fullName} đến với lớp học tiếng anh nhé!`);
      onLoginSuccess(existing);
    }
  };

  return (
    <div id="auth-screen" className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      {/* Background Ornaments */}
      <div className="absolute top-10 left-10 text-6xl animate-bounce duration-1000 select-none opacity-20">☁️</div>
      <div className="absolute top-20 right-10 text-5xl animate-pulse select-none opacity-20">⭐</div>
      <div className="absolute bottom-10 left-16 text-6xl select-none opacity-20">🌈</div>
      <div className="absolute bottom-20 right-20 text-5xl select-none opacity-20">✏️</div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-full max-w-md bg-white rounded-[40px] border-b-8 border-slate-200 shadow-xl p-8 relative overflow-hidden"
      >
        {/* Banner with Cute Bear or graduation cap */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-3xl mb-3 shadow-md">
            🌈
          </div>
          <h1 id="app-title-auth" className="text-3xl font-black text-center text-sky-600 tracking-tight uppercase">
            Bé Vui Học Tiếng Anh
          </h1>
          <span className="bg-[#E0F2FE] text-sky-600 font-bold px-3 py-1 rounded-full text-xs mt-2 flex items-center gap-1">
            LỚP 3 <Sparkles size={12} />
          </span>
        </div>

        <div className="mb-6 flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          <button
            id="tab-login"
            onClick={() => { setIsRegister(false); setError(''); setSuccess(''); }}
            className={`flex-1 py-3 text-center rounded-xl font-bold transition-all text-sm ${!isRegister ? 'bg-sky-500 text-white shadow-md shadow-sky-100' : 'text-slate-500 hover:text-sky-500'}`}
          >
            Đăng Nhập
          </button>
          <button
            id="tab-register"
            onClick={() => { setIsRegister(true); setError(''); setSuccess(''); }}
            className={`flex-1 py-3 text-center rounded-xl font-bold transition-all text-sm ${isRegister ? 'bg-sky-500 text-white shadow-md shadow-sky-100' : 'text-slate-500 hover:text-sky-500'}`}
          >
            Đăng Ký Mới
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isRegister && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1.5"
            >
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Họ và Tên của Bé:
              </label>
              <input
                id="input-fullname"
                type="text"
                placeholder="Ví dụ: Nguyễn Minh Nam"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:border-sky-500 outline-none transition-all font-bold text-base text-slate-700 bg-slate-50/50"
              />
            </motion.div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tên đăng nhập:
            </label>
            <input
              id="input-username"
              type="text"
              placeholder="Nhập tên đăng nhập viết liền"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:border-sky-500 outline-none transition-all font-bold text-base text-slate-700 bg-slate-50/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Mật khẩu:
            </label>
            <input
              id="input-password"
              type="password"
              placeholder="Nhập mật khẩu của bé"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:border-sky-500 outline-none transition-all font-bold text-base text-slate-700 bg-slate-50/50"
            />
          </div>

          {error && (
            <div id="auth-error" className="p-3 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold animate-shake text-center">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div id="auth-success" className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-xs font-bold text-center">
              🎉 {success}
            </div>
          )}

          <button
            id="btn-submit-auth"
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold text-base py-4 px-6 rounded-2xl shadow-lg shadow-sky-200 transform active:scale-95 transition-all mt-4 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isRegister ? 'Bắt Đầu Đăng Ký! 🚀' : 'Vào Học Thôi Nào! 🎒'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs font-bold text-slate-400">
          {isRegister ? (
            <p>Học tập vui nhộn, hoàn toàn miễn phí!</p>
          ) : (
            <p>Luyện phát âm chuẩn cùng cô Lucy 🐱</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
