'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface ConteudoSite {
  id: string | number;
  chave: string;
  titulo?: string;
  conteudo: string;
}

export default function AdminConteudoPage() {
  const [conteudos, setConteudos] = useState<ConteudoSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState('');

  const [novaChave, setNovaChave] = useState('');
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novoValor, setNovoValor] = useState('');
  const [salvandoNovo, setSalvandoNovo] = useState(false);
  const [enviandoFoto, setEnviandoFoto] = useState<string | null>(null);

  useEffect(() => {
    carregarConteudo();
  }, []);

  async function carregarConteudo() {
    setLoading(true);
    setErro(null);

    const { data, error } = await supabase
      .from('conteudos_site')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      setErro('Erro ao carregar do Supabase: ' + error.message);
    } else {
      setConteudos(data || []);
    }
    setLoading(false);
  }

  async function salvarEdicao(id: string | number, novoConteudo: string) {
    const { error } = await supabase
      .from('conteudos_site')
      .update({ conteudo: novoConteudo })
      .eq('id', id);

    if (error) {
      alert('Erro ao salvar alteração: ' + error.message);
    } else {
      setConteudos(conteudos.map(item => item.id === id ? { ...item, conteudo: novoConteudo } : item));
    }
  }

  async function excluirChave(id: string | number, chave: string) {
    if (!confirm(`Tem certeza que deseja excluir a chave "${chave}"?`)) return;

    const { error } = await supabase
      .from('conteudos_site')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Erro ao excluir: ' + error.message);
    } else {
      setConteudos(conteudos.filter(item => item.id !== id));
    }
  }

  async function adicionarConteudo(e: React.FormEvent) {
    e.preventDefault();
    if (!novaChave) return alert('Preencha a chave!');

    setSalvandoNovo(true);
    const { error } = await supabase
      .from('conteudos_site')
      .insert([{ chave: novaChave, titulo: novoTitulo, conteudo: novoValor }]);

    if (error) {
      alert('Erro ao criar: ' + error.message);
    } else {
      alert('Novo conteúdo adicionado com sucesso!');
      setNovaChave('');
      setNovoTitulo('');
      setNovoValor('');
      carregarConteudo();
    }
    setSalvandoNovo(false);
  }

  // Função para lidar com o upload de arquivos de imagem
  async function handleFileUpload(id: string | number, chave: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setEnviandoFoto(String(id));
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${chave}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('imagens')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('imagens')
        .getPublicUrl(filePath);

      const urlPublica = publicUrlData.publicUrl;

      await salvarEdicao(id, urlPublica);
      alert('Imagem enviada e salva com sucesso!');
    } catch (err: any) {
      alert('Erro ao enviar imagem: ' + (err.message || err));
    } finally {
      setEnviandoFoto(null);
    }
  }

  const conteudosFiltrados = conteudos.filter(
    (item) =>
      item.chave.toLowerCase().includes(busca.toLowerCase()) ||
      (item.titulo && item.titulo.toLowerCase().includes(busca.toLowerCase())) ||
      item.conteudo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 sm:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* CABEÇALHO */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0D3B66]">Gestão de Conteúdo</h1>
            <p className="text-slate-600 text-sm">Adicione e edite textos, especialidades, fotos e configurações</p>
          </div>
          <Link href="/admin" className="bg-slate-100 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition">
            ← Voltar
          </Link>
        </div>

        {/* FORMULÁRIO PARA ADICIONAR NOVA CHAVE */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-[#0D3B66] mb-4">➕ Adicionar Novo Conteúdo / Chave</h2>
          <form onSubmit={adicionarConteudo} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Chave (Identificador):</label>
                <input
                  type="text"
                  placeholder="ex: foto_sobre, titulo_banner..."
                  value={novaChave}
                  onChange={(e) => setNovaChave(e.target.value)}
                  className="w-full border border-slate-200 rounded-2xl p-3 text-sm text-slate-700 focus:ring-2 focus:ring-[#0D3B66] outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Título (Opcional):</label>
                <input
                  type="text"
                  placeholder="ex: Foto da seção Sobre"
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                  className="w-full border border-slate-200 rounded-2xl p-3 text-sm text-slate-700 focus:ring-2 focus:ring-[#0D3B66] outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Conteúdo Inicial (Texto ou Link):</label>
              <textarea
                placeholder="Digite o texto inicial..."
                value={novoValor}
                onChange={(e) => setNovoValor(e.target.value)}
                className="w-full border border-slate-200 rounded-2xl p-3 text-sm text-slate-700 h-24 focus:ring-2 focus:ring-[#0D3B66] outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={salvandoNovo}
              className="bg-[#0D3B66] text-white font-bold py-3 px-6 rounded-2xl text-sm hover:bg-[#0A2D4F] transition shadow-md w-full sm:w-auto"
            >
              {salvandoNovo ? 'Salvando...' : 'Salvar Nova Chave'}
            </button>
          </form>
        </div>

        {/* BUSCA */}
        <input
          type="text"
          placeholder="🔍 Pesquisar chave (ex: foto_principal, lista_especialidades)..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full p-4 rounded-2xl shadow-sm border border-slate-200 focus:ring-2 focus:ring-[#0D3B66] outline-none"
        />

        {/* LISTAGEM */}
        <div className="grid gap-6">
          {conteudosFiltrados.map((item) => {
            const isFoto = item.chave.includes('foto') || item.chave.includes('imagem');

            return (
              <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-bold bg-slate-100 text-[#0D3B66] px-3 py-1 rounded-lg">
                    {item.chave}
                  </span>
                  <button onClick={() => excluirChave(item.id, item.chave)} className="text-red-400 text-xs font-bold hover:text-red-600">Excluir 🗑️</button>
                </div>

                {isFoto ? (
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase block">
                      Upload de Arquivo de Imagem:
                    </label>
                    {item.conteudo && (
                      <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border">
                        <img src={item.conteudo} alt="Prévia" className="w-20 h-20 object-cover rounded-xl" />
                        <span className="text-xs text-slate-500 break-all">{item.conteudo}</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(item.id, item.chave, e)}
                      disabled={enviandoFoto === String(item.id)}
                      className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#0D3B66] file:text-white hover:file:bg-[#0A2D4F] cursor-pointer"
                    />
                    {enviandoFoto === String(item.id) && <p className="text-xs text-[#0D3B66] font-bold">Enviando imagem...</p>}
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                      {item.chave === 'lista_especialidades' ? 'Digite uma especialidade por linha:' : 'Conteúdo:'}
                    </label>
                    <textarea
                      className="w-full border border-slate-200 rounded-2xl p-4 text-sm text-slate-700 h-32 focus:ring-2 focus:ring-[#0D3B66] outline-none"
                      defaultValue={item.conteudo}
                      onBlur={(e) => salvarEdicao(item.id, e.target.value)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}