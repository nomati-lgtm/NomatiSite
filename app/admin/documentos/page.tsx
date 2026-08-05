'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Documento {
  id: string;
  titulo: string;
  categoria: string;
  arquivo_url: string;
  created_at: string;
}

export default function AdminDocumentos() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [docEditando, setDocEditando] = useState<Documento | null>(null);

  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Geral');
  const [arquivoFile, setArquivoFile] = useState<File | null>(null);
  const [salvando, setSalvando] = useState(false);

  const carregarDocumentos = async () => {
    const { data } = await supabase.from('documentos').select('*').order('created_at', { ascending: false });
    if (data) setDocumentos(data);
  };

  useEffect(() => {
    carregarDocumentos();
  }, []);

  const iniciarEdicao = (item: Documento) => {
    setDocEditando(item);
    setTitulo(item.titulo || '');
    setCategoria(item.categoria || 'Geral');
    setArquivoFile(null);
  };

  const limparFormulario = () => {
    setDocEditando(null);
    setTitulo('');
    setCategoria('Geral');
    setArquivoFile(null);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    let arquivo_url = docEditando ? docEditando.arquivo_url : '';

    if (arquivoFile) {
      const fileName = `${Date.now()}-${arquivoFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(fileName, arquivoFile);

      if (uploadError) {
        alert('Erro no envio do documento: ' + uploadError.message);
        setSalvando(false);
        return;
      }
      const { data } = supabase.storage.from('documentos').getPublicUrl(fileName);
      arquivo_url = data.publicUrl;
    }

    if (!arquivo_url) {
      alert('Selecione um arquivo PDF para upload!');
      setSalvando(false);
      return;
    }

    const payload = { titulo, categoria, arquivo_url };

    if (docEditando) {
      const { error } = await supabase.from('documentos').update(payload).eq('id', docEditando.id);
      if (error) alert('Erro ao atualizar: ' + error.message);
      else {
        alert('Documento atualizado!');
        limparFormulario();
        carregarDocumentos();
      }
    } else {
      const { error } = await supabase.from('documentos').insert([payload]);
      if (error) alert('Erro ao cadastrar: ' + error.message);
      else {
        alert('Documento publicado!');
        limparFormulario();
        carregarDocumentos();
      }
    }
    setSalvando(false);
  };

  const handleExcluir = async (id: string) => {
    if (!confirm('Deseja excluir este documento?')) return;
    await supabase.from('documentos').delete().eq('id', id);
    if (docEditando?.id === id) limparFormulario();
    carregarDocumentos();
  };

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 sm:px-8 lg:px-12">
      <div className="max-w-[92rem] mx-auto space-y-12">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <span className="text-xs sm:text-sm font-bold text-[#0D3B66] uppercase tracking-wider">Gestão do Sistema</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0D3B66] mt-2">Gerenciar Documentos</h1>
            <p className="text-slate-600 text-base sm:text-xl mt-2">Upload de PDFs, formulários e regulamentos</p>
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
                  {docEditando ? '✏️ Editar Documento' : '➕ Novo Documento'}
                </h2>
                {docEditando && (
                  <button type="button" onClick={limparFormulario} className="text-sm text-slate-500 underline font-semibold hover:text-slate-700">
                    Cancelar Edição
                  </button>
                )}
              </div>

              <form onSubmit={handleSalvar} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Título do Documento</label>
                  <input 
                    type="text" 
                    required 
                    value={titulo} 
                    onChange={(e) => setTitulo(e.target.value)} 
                    placeholder="Ex: Formulario de Estagio.pdf" 
                    className="w-full border border-slate-200 p-4 rounded-2xl text-base focus:outline-none focus:border-[#0D3B66]" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Categoria</label>
                  <select 
                    value={categoria} 
                    onChange={(e) => setCategoria(e.target.value)} 
                    className="w-full border border-slate-200 p-4 rounded-2xl text-base bg-white focus:outline-none focus:border-[#0D3B66]"
                  >
                    <option value="Formulários">Formulários</option>
                    <option value="Normas e Regulamentos">Normas e Regulamentos</option>
                    <option value="Modelos de Trabalhos">Modelos de Trabalhos</option>
                    <option value="Geral">Geral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {docEditando ? 'Substituir Arquivo (PDF) - Opcional' : 'Arquivo (PDF, DOCX)'}
                  </label>
                  <input 
                    type="file" 
                    onChange={(e) => setArquivoFile(e.target.files?.[0] || null)} 
                    className="w-full border border-slate-200 p-3 rounded-2xl text-base file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={salvando} 
                  className={`w-full py-4 rounded-2xl font-bold text-base text-white transition ${docEditando ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#0D3B66] hover:bg-[#0A2D4F]'}`}
                >
                  {salvando ? 'Enviando...' : docEditando ? 'Salvar Alterações' : 'Publicar Documento'}
                </button>
              </form>
            </div>
          </div>

          {/* Lista */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">Documentos Publicados</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {documentos.length === 0 ? (
                <div className="text-center py-20 text-slate-400 font-medium text-base">
                  Nenhum documento cadastrado.
                </div>
              ) : (
                documentos.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-4 sm:p-5 border rounded-2xl flex items-center justify-between gap-4 transition ${docEditando?.id === item.id ? 'border-amber-500 bg-amber-50/40' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold shrink-0 text-sm">
                        PDF
                      </div>
                      <div>
                        <p className="font-bold text-base text-slate-800 line-clamp-1">{item.titulo}</p>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{item.categoria}</p>
                      </div>
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