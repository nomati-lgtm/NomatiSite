'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checarAutenticacao() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/admin/login');
      } else {
        setUser(session.user);
      }
      setLoading(false);
    }

    checarAutenticacao();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium text-lg">
        Verificando credenciais...
      </div>
    );
  }

  const modulos = [
    {
      titulo: 'Textos, Estilos e Power BI',
      rota: '/admin/conteudo', // ou /admin se você unificou tudo na mesma página
      descricao: 'Editar todo o conteúdo textual do site, seções e o link de incorporação do painel Power BI.',
      icone: '🎨',
      cor: 'border-indigo-500/20 hover:border-indigo-500',
    },
    {
      titulo: 'Notícias',
      rota: '/admin/noticias',
      descricao: 'Cadastrar, editar e excluir notícias publicadas no site.',
      icone: '📰',
      cor: 'border-blue-500/20 hover:border-blue-500',
    },
    {
      titulo: 'Professores / Equipe',
      rota: '/admin/professores',
      descricao: 'Gerenciar membros da equipe, fotos de perfil e links.',
      icone: '👨‍🏫',
      cor: 'border-emerald-500/20 hover:border-emerald-500',
    },
    {
      titulo: 'Documentos',
      rota: '/admin/documentos',
      descricao: 'Fazer upload de PDFs, formulários, normas e regulamentos.',
      icone: '📁',
      cor: 'border-amber-500/20 hover:border-amber-500',
    },
    {
      titulo: 'Publicações',
      rota: '/admin/publicacoes',
      descricao: 'Adicionar trabalhos acadêmicos (Graduação, Mestrado e Doutorado).',
      icone: '🎓',
      cor: 'border-purple-500/20 hover:border-purple-500',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 sm:px-8 lg:px-12">
      <div className="max-w-[92rem] mx-auto space-y-12">
        
        {/* CABEÇALHO DO PAINEL */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <span className="text-xs sm:text-sm font-bold text-[#0D3B66] uppercase tracking-wider">Gestão do Sistema</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0D3B66] mt-2">Painel Administrativo</h1>
            <p className="text-slate-600 text-base sm:text-xl mt-2">
              Logado como: <span className="font-semibold text-slate-800">{user?.email}</span>
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="bg-slate-100 text-slate-700 px-6 py-3.5 rounded-2xl text-base font-bold hover:bg-slate-200 transition"
            >
              Ver Site ↗
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-50 text-red-600 px-6 py-3.5 rounded-2xl text-base font-bold hover:bg-red-100 transition"
            >
              Sair da Conta
            </button>
          </div>
        </div>

        {/* MÓDULOS DE GERENCIAMENTO */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modulos.map((mod) => (
            <Link
              key={mod.rota}
              href={mod.rota}
              className={`bg-white p-8 sm:p-10 rounded-3xl shadow-sm border ${mod.cor} transition-all duration-200 hover:shadow-lg group flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl sm:text-5xl">{mod.icone}</span>
                  <span className="text-slate-400 group-hover:text-[#0D3B66] group-hover:translate-x-1 transition-transform font-bold text-xl">
                    →
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0D3B66] group-hover:underline">
                  {mod.titulo}
                </h2>
                <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
                  {mod.descricao}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-sm sm:text-base font-bold text-[#0D3B66]">
                <span>Acessar módulo</span>
                <span className="underline">Gerenciar</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}