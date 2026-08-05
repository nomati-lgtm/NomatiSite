'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Publicacao {
  id: string;
  titulo: string;
  autores: string;
  ano: number;
  tipo: string;
  link_pdf: string;
}

export default function AdminPublicacoes() {
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);
  const [pubEditando, setPubEditando] = useState<Publicacao | null>(null);

  const [titulo, setTitulo] = useState('');
  const [autores, setAutores] = useState('');
  const [ano, setAno] = useState(new Date().getFullYear());
  const [tipo, setTipo] = useState('Artigo');
  const [linkPdf, setLinkPdf] = useState('');
  const [salvando, setSalvando] = useState(false);

  const carregarPublicacoes = async () => {
    const { data } = await supabase.from('publicacoes').select('*').order('ano', { ascending: false });
    if (data) setPublicacoes(data);
  };

  useEffect(() => {
    carregarPublicacoes();
  }, []);

  const iniciarEdicao = (item: Publicacao) => {
    setPubEditando(item);
    setTitulo(item.titulo || '');
    setAutores(item.autores || '');
    setAno(item.ano || new Date().getFullYear());
    setTipo(item.tipo || 'Artigo');
    setLinkPdf(item.link_pdf || '');
  };

  const limparFormulario = () => {
    setPubEditando(null);
    setTitulo('');
    setAutores('');
    setAno(new Date().getFullYear());
    setTipo('Artigo');
    setLinkPdf('');
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    const payload = { titulo, autores, ano, tipo, link_pdf: linkPdf };

    if (pubEditando) {
      const { error } = await supabase.from('publicacoes').update(payload).eq('id', pubEditando.id);
      if (error) alert('Erro ao atualizar: ' + error.message);
      else {
        alert('Publicação atualizada!');
        limparFormulario();
        carregarPublicacoes();
      }
    } else {
      const { error } = await supabase.from('publicacoes').insert([payload]);
      if (error) alert('Erro ao cadastrar: ' + error.message);
      else {
        alert('Publicação cadastrada!');
        limparFormulario();
        carregarPublicacoes();
      }
    }
    setSalvando(false);
  };

  const handleExcluir = async (id: string) => {
    if (!confirm('Deseja excluir esta publicação?')) return;
    await supabase.from('publicacoes').delete().eq('id', id);
    if (pubEditando?.id === id) limparFormulario();
    carregarPublicacoes();
  };

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 sm:px-8 lg:px-12">
      <div className="max-w-[92rem] mx-auto space-y-12">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <span className="text-xs sm:text-sm font-bold text-[#0D3B66] uppercase tracking-wider">Gestão do Sistema</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0D3B66] mt-2">Gerenciar Publicações</h1>
            <p className="text-slate-600 text-base sm:text-xl mt-2">Cadastre e edite artigos, dissertações e teses</p>
          </div>
          <Link 
            href="/admin" 
            className="bg-slate-100 text-slate-700 px-6 py-3.5 rounded-2xl text-base font-semibold hover:bg-slate-200 transition shrink-0"
          >
            ← Menu Principal
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
          
          {/* Formulário */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                  {pubEditando ? '✏️ Editar Publicação' : '➕ Nova Publicação'}
                </h2>
                {pubEditando && (
                  <button type="button" onClick={limparFormulario} className="text-sm text-slate-500 underline font-semibold hover:text-slate-700">
                    Cancelar Edição
                  </button>
                )}
              </div>

              <form onSubmit={handleSalvar} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Título do Trabalho</label>
                  <input 
                    type="text" 
                    required 
                    value={titulo} 
                    onChange={(e) => setTitulo(e.target.value)} 
                    placeholder="Título do artigo/pesquisa" 
                    className="w-full border border-slate-200 p-4 rounded-2xl text-base focus:outline-none focus:border-[#0D3B66]" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Autores</label>
                  <input 
                    type="text" 
                    required 
                    value={autores} 
                    onChange={(e) => setAutores(e.target.value)} 
                    placeholder="Ex: Silva, J.; Santos, M." 
                    className="w-full border border-slate-200 p-4 rounded-2xl text-base focus:outline-none focus:border-[#0D3B66]" 
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Trabalho</label>
                    <select 
                      value={tipo} 
                      onChange={(e) => setTipo(e.target.value)} 
                      className="w-full border border-slate-200 p-4 rounded-2xl text-base bg-white focus:outline-none focus:border-[#0D3B66]"
                    >
                      <option value="Artigo em Periódico">Artigo em Periódico</option>
                      <option value="Congresso / Evento">Congresso / Evento</option>
                      <option value="Dissertação de Mestrado">Dissertação de Mestrado</option>
                      <option value="Tese de Doutorado">Tese de Doutorado</option>
                      <option value="TCC">TCC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Ano de Publicação</label>
                    <input 
                      type="number" 
                      required 
                      value={ano} 
                      onChange={(e) => setAno(Number(e.target.value))} 
                      className="w-full border border-slate-200 p-4 rounded-2xl text-base focus:outline-none focus:border-[#0D3B66]" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Link do PDF ou DOI</label>
                  <input 
                    type="url" 
                    value={linkPdf} 
                    onChange={(e) => setLinkPdf(e.target.value)} 
                    placeholder="https://doi.org/... ou link do PDF" 
                    className="w-full border border-slate-200 p-4 rounded-2xl text-base focus:outline-none focus:border-[#0D3B66]" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={salvando} 
                  className={`w-full py-4 rounded-2xl font-bold text-base text-white transition ${
                    pubEditando ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#0D3B66] hover:bg-[#0A2D4F]'
                  }`}
                >
                  {salvando ? 'Salvando...' : pubEditando ? 'Salvar Alterações' : 'Cadastrar Publicação'}
                </button>
              </form>
            </div>
          </div>

          {/* Lista */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">Trabalhos Publicados</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {publicacoes.length === 0 ? (
                <div className="text-center py-20 text-slate-400 font-medium text-base">
                  Nenhuma publicação cadastrada.
                </div>
              ) : (
                publicacoes.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-4 sm:p-5 border rounded-2xl flex items-center justify-between gap-4 transition ${
                      pubEditando?.id === item.id ? 'border-amber-500 bg-amber-50/40' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-xl font-bold">
                        {item.tipo} ({item.ano})
                      </span>
                      <p className="font-bold text-base text-slate-800 line-clamp-1 mt-2">{item.titulo}</p>
                      <p className="text-xs sm:text-sm text-slate-500 line-clamp-1 mt-0.5">{item.autores}</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <button onClick={() => iniciarEdicao(item)} className="text-amber-600 text-sm font-bold hover:underline">
                        Editar
                      </button>
                      <button onClick={() => handleExcluir(item.id)} className="text-red-500 text-sm font-bold hover:underline">
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