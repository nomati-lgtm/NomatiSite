'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert('Erro ao entrar: ' + error.message);
      } else if (data.user) {
        router.push('/admin');
      }
    } catch (err: any) {
      alert('Ocorreu um erro inesperado: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center py-16 px-4 sm:px-8">
      <div className="bg-white p-10 sm:p-12 rounded-3xl shadow-xl border border-slate-200 w-full max-w-lg">
        <div className="text-center mb-8">
          <span className="text-xs sm:text-sm font-bold text-[#0D3B66] uppercase tracking-wider">NOMATI</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0D3B66] mt-2">Acesso Restrito</h1>
          <p className="text-slate-600 text-base mt-2">Painel Administrativo do Sistema</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu-email@exemplo.com"
              className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-slate-800 text-base focus:outline-none focus:border-[#0D3B66]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-slate-800 text-base focus:outline-none focus:border-[#0D3B66]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0D3B66] text-white py-4 rounded-2xl font-bold hover:bg-[#0A2D4F] transition text-base shadow-md"
          >
            {loading ? 'Entrando...' : 'Entrar no Painel'}
          </button>
        </form>
      </div>
    </main>
  );
}