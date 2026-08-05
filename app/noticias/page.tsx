'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Noticia {
  id: string;
  titulo: string;
  resumo: string;
  conteudo?: string;
  imagem_url?: string;
  created_at: string;
}

export default function PaginaNoticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [noticiaSelecionada, setNoticiaSelecionada] = useState<Noticia | null>(null);

  useEffect(() => {
    async function carregarNoticias() {
      const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setNoticias(data);
      if (error) console.error('Erro ao buscar notícias:', error.message);
      setLoading(false);
    }

    carregarNoticias();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 sm:px-8 lg:px-12">
      <div className="max-w-[92rem] mx-auto space-y-12">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <span className="text-xs sm:text-sm font-bold text-[#0D3B66] uppercase tracking-wider">Mural Acadêmico</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0D3B66] mt-2">Mais Notícias e Comunicados</h1>
            <p className="text-slate-600 text-base sm:text-xl mt-2">Fique por dentro das últimas atualizações, projetos e novidades do NOMATI.</p>
          </div>
          <Link 
            href="/" 
            className="bg-slate-100 text-slate-700 px-6 py-3 rounded-2xl text-base font-semibold hover:bg-slate-200 transition shrink-0"
          >
            ← Voltar para a Página Principal
          </Link>
        </div>

        {/* LISTAGEM DE NOTÍCIAS */}
        {loading ? (
          <div className="text-center py-28 text-slate-400 font-medium text-lg">Carregando notícias...</div>
        ) : noticias.length === 0 ? (
          <div className="text-center py-28 bg-white rounded-3xl border border-slate-200 text-slate-500 text-lg">
            Nenhuma notícia cadastrada no momento.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {noticias.map((item) => (
              <article 
                key={item.id} 
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  {item.imagem_url ? (
                    <img 
                      src={item.imagem_url} 
                      alt={item.titulo} 
                      className="w-full h-64 object-cover" 
                    />
                  ) : (
                    <div className="w-full h-64 bg-slate-100 flex items-center justify-center text-slate-400 font-semibold text-base">
                      Sem Imagem
                    </div>
                  )}

                  <div className="p-8 space-y-4">
                    <span className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-wider block">
                      {new Date(item.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    <h2 className="font-bold text-xl sm:text-2xl text-slate-800 line-clamp-2 leading-snug">
                      {item.titulo}
                    </h2>
                    <p className="text-slate-600 text-base line-clamp-3 leading-relaxed">
                      {item.resumo}
                    </p>
                  </div>
                </div>

                <div className="p-8 pt-0">
                  <button 
                    onClick={() => setNoticiaSelecionada(item)}
                    className="w-full text-center bg-slate-100 hover:bg-[#0D3B66] hover:text-white text-[#0D3B66] py-3.5 rounded-2xl text-sm sm:text-base font-bold transition"
                  >
                    Ler Notícia Completa →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* MODAL DE LEITURA DA NOTÍCIA */}
        {noticiaSelecionada && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 sm:p-12 space-y-6 shadow-2xl">
              {noticiaSelecionada.imagem_url && (
                <img 
                  src={noticiaSelecionada.imagem_url} 
                  alt={noticiaSelecionada.titulo} 
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl" 
                />
              )}
              <div>
                <span className="text-sm text-slate-400 font-bold uppercase">
                  {new Date(noticiaSelecionada.created_at).toLocaleDateString('pt-BR')}
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0D3B66] mt-2">{noticiaSelecionada.titulo}</h2>
              </div>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line text-base sm:text-lg">
                {noticiaSelecionada.conteudo || noticiaSelecionada.resumo}
              </p>
              <div className="pt-6 border-t flex justify-end">
                <button 
                  onClick={() => setNoticiaSelecionada(null)}
                  className="bg-[#0D3B66] text-white px-8 py-3.5 rounded-2xl text-base font-bold hover:bg-[#0A2D4F] transition"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}