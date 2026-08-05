'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Noticia {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  imagem_url: string;
  created_at: string;
}

export default function AdminNoticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [noticiaEditando, setNoticiaEditando] = useState<Noticia | null>(null);

  // Form states
  const [titulo, setTitulo] = useState('');
  const [resumo, setResumo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [salvando, setSalvando] = useState(false);

  const carregarNoticias = async () => {
    const { data, error } = await supabase
      .from('noticias')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setNoticias(data);
    if (error) console.error("Erro ao carregar:", error.message);
  };

  useEffect(() => {
    carregarNoticias();
  }, []);

  const iniciarEdicao = (item: Noticia) => {
    setNoticiaEditando(item);
    setTitulo(item.titulo);
    setResumo(item.resumo);
    setConteudo(item.conteudo || '');
    setImagemFile(null);
  };

  const limparFormulario = () => {
    setNoticiaEditando(null);
    setTitulo('');
    setResumo('');
    setConteudo('');
    setImagemFile(null);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    let imagem_url = noticiaEditando ? noticiaEditando.imagem_url : '';

    if (imagemFile) {
      const fileName = `${Date.now()}-${imagemFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { error: uploadError } = await supabase.storage
        .from('noticias')
        .upload(fileName, imagemFile);

      if (uploadError) {
        alert('Erro no envio da imagem: ' + uploadError.message);
        setSalvando(false);
        return;
      }

      const { data } = supabase.storage.from('noticias').getPublicUrl(fileName);
      imagem_url = data.publicUrl;
    }

    if (noticiaEditando) {
      const { error } = await supabase
        .from('noticias')
        .update({
          titulo,
          resumo,
          conteudo,
          imagem_url,
        })
        .eq('id', noticiaEditando.id);

      if (error) {
        alert('Erro ao atualizar notícia: ' + error.message);
      } else {
        alert('Notícia atualizada com sucesso!');
        limparFormulario();
        carregarNoticias();
      }
    } else {
      const { error } = await supabase.from('noticias').insert([
        { titulo, resumo, conteudo, imagem_url }
      ]);

      if (error) {
        alert('Erro ao salvar notícia: ' + error.message);
      } else {
        alert('Notícia publicada com sucesso!');
        limparFormulario();
        carregarNoticias();
      }
    }

    setSalvando(false);
  };

  const handleExcluir = async (id: string) => {
    if (!confirm('Deseja excluir esta notícia?')) return;
    await supabase.from('noticias').delete().eq('id', id);

    if (noticiaEditando?.id === id) {
      limparFormulario();
    }
    carregarNoticias();
  };

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 sm:px-8 lg:px-12">
      <div className="max-w-[92rem] mx-auto space-y-12">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <span className="text-xs sm:text-sm font-bold text-[#0D3B66] uppercase tracking-wider">Gestão do Sistema</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0D3B66] mt-2">Gerenciar Notícias</h1>
            <p className="text-slate-600 text-base sm:text-xl mt-2">Publique, edite e remova avisos e novidades</p>
          </div>
          <Link 
            href="/admin" 
            className="bg-slate-100 text-slate-700 px-6 py-3.5 rounded-2xl text-base font-semibold hover:bg-slate-200 transition shrink-0"
          >
            ← Menu Principal
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
          
          {/* Formulário (Criar / Editar) */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                  {noticiaEditando ? '✏️ Editar Notícia' : '➕ Nova Notícia'}
                </h2>
                {noticiaEditando && (
                  <button
                    type="button"
                    onClick={limparFormulario}
                    className="text-sm text-slate-500 underline font-semibold hover:text-slate-700"
                  >
                    Cancelar Edição
                  </button>
                )}
              </div>

              <form onSubmit={handleSalvar} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Título</label>
                  <input 
                    type="text" 
                    required 
                    value={titulo} 
                    onChange={(e) => setTitulo(e.target.value)} 
                    placeholder="Ex: Abertura das inscrições para o projeto" 
                    className="w-full border border-slate-200 p-4 rounded-2xl text-base focus:outline-none focus:border-[#0D3B66]" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Resumo (Chamada rápida)</label>
                  <input 
                    type="text" 
                    required 
                    value={resumo} 
                    onChange={(e) => setResumo(e.target.value)} 
                    placeholder="Breve resumo em poucas palavras..." 
                    className="w-full border border-slate-200 p-4 rounded-2xl text-base focus:outline-none focus:border-[#0D3B66]" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {noticiaEditando ? 'Substituir Imagem de Capa (Opcional)' : 'Imagem de Capa'}
                  </label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setImagemFile(e.target.files?.[0] || null)} 
                    className="w-full border border-slate-200 p-3 rounded-2xl text-base file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Conteúdo Completo</label>
                  <textarea 
                    rows={6}
                    value={conteudo} 
                    onChange={(e) => setConteudo(e.target.value)} 
                    placeholder="Escreva o texto completo da notícia..." 
                    className="w-full border border-slate-200 p-4 rounded-2xl text-base focus:outline-none focus:border-[#0D3B66]" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={salvando} 
                  className={`w-full py-4 rounded-2xl font-bold text-base text-white transition ${
                    noticiaEditando 
                      ? 'bg-amber-600 hover:bg-amber-700' 
                      : 'bg-[#0D3B66] hover:bg-[#0A2D4F]'
                  }`}
                >
                  {salvando 
                    ? 'Salvando...' 
                    : noticiaEditando 
                    ? 'Salvar Alterações' 
                    : 'Publicar Notícia'
                  }
                </button>
              </form>
            </div>
          </div>

          {/* Lista de Notícias */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">Notícias Publicadas</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {noticias.length === 0 ? (
                <div className="text-center py-20 text-slate-400 font-medium text-base">
                  Nenhuma notícia cadastrada.
                </div>
              ) : (
                noticias.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-4 sm:p-5 border rounded-2xl flex items-center justify-between gap-4 transition ${
                      noticiaEditando?.id === item.id ? 'border-amber-500 bg-amber-50/40' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {item.imagem_url ? (
                        <img src={item.imagem_url} className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0" alt="" />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-xs text-slate-400 font-bold shrink-0">
                          Sem Foto
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-base text-slate-800 line-clamp-1">{item.titulo}</p>
                        <p className="text-xs sm:text-sm text-slate-500 line-clamp-1 mt-0.5">{item.resumo}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <button 
                        onClick={() => iniciarEdicao(item)} 
                        className="text-amber-600 text-sm font-bold hover:underline"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleExcluir(item.id)} 
                        className="text-red-500 text-sm font-bold hover:underline"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}