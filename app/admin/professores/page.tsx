'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Professor {
  id: string;
  nome: string;
  cargo: string;
  email: string;
  biografia: string;
  lattes_url: string;
  scholar_url: string;
  foto_url: string;
}

export default function AdminProfessores() {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [profEditando, setProfEditando] = useState<Professor | null>(null);

  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [email, setEmail] = useState('');
  const [biografia, setBiografia] = useState('');
  const [lattesUrl, setLattesUrl] = useState('');
  const [scholarUrl, setScholarUrl] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [salvando, setSalvando] = useState(false);

  const carregarProfessores = async () => {
    const { data } = await supabase.from('professores').select('*').order('nome');
    if (data) setProfessores(data);
  };

  useEffect(() => {
    carregarProfessores();
  }, []);

  const iniciarEdicao = (item: Professor) => {
    setProfEditando(item);
    setNome(item.nome || '');
    setCargo(item.cargo || '');
    setEmail(item.email || '');
    setBiografia(item.biografia || '');
    setLattesUrl(item.lattes_url || '');
    setScholarUrl(item.scholar_url || '');
    setFotoFile(null);
  };

  const limparFormulario = () => {
    setProfEditando(null);
    setNome('');
    setCargo('');
    setEmail('');
    setBiografia('');
    setLattesUrl('');
    setScholarUrl('');
    setFotoFile(null);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    let foto_url = profEditando ? profEditando.foto_url : '';

    if (fotoFile) {
      const fileName = `${Date.now()}-${fotoFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { error: uploadError } = await supabase.storage
        .from('professores')
        .upload(fileName, fotoFile);

      if (uploadError) {
        alert('Erro no envio da foto: ' + uploadError.message);
        setSalvando(false);
        return;
      }
      const { data } = supabase.storage.from('professores').getPublicUrl(fileName);
      foto_url = data.publicUrl;
    }

    const payload = {
      nome,
      cargo,
      email,
      biografia,
      lattes_url: lattesUrl,
      scholar_url: scholarUrl,
      foto_url,
    };

    if (profEditando) {
      const { error } = await supabase.from('professores').update(payload).eq('id', profEditando.id);
      if (error) alert('Erro ao atualizar: ' + error.message);
      else {
        alert('Professor atualizado com sucesso!');
        limparFormulario();
        carregarProfessores();
      }
    } else {
      const { error } = await supabase.from('professores').insert([payload]);
      if (error) alert('Erro ao cadastrar: ' + error.message);
      else {
        alert('Professor cadastrado com sucesso!');
        limparFormulario();
        carregarProfessores();
      }
    }
    setSalvando(false);
  };

  const handleExcluir = async (id: string) => {
    if (!confirm('Deseja excluir este professor?')) return;
    await supabase.from('professores').delete().eq('id', id);
    if (profEditando?.id === id) limparFormulario();
    carregarProfessores();
  };

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 sm:px-8 lg:px-12">
      <div className="max-w-[92rem] mx-auto space-y-12">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <span className="text-xs sm:text-sm font-bold text-[#0D3B66] uppercase tracking-wider">Gestão do Sistema</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0D3B66] mt-2">Gerenciar Professores</h1>
            <p className="text-slate-600 text-base sm:text-xl mt-2">Cadastre e edite membros do corpo docente</p>
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
                  {profEditando ? '✏️ Editar Professor' : '➕ Novo Professor'}
                </h2>
                {profEditando && (
                  <button type="button" onClick={limparFormulario} className="text-sm text-slate-500 underline font-semibold hover:text-slate-700">
                    Cancelar Edição
                  </button>
                )}
              </div>

              <form onSubmit={handleSalvar} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nome Completo</label>
                  <input 
                    type="text" 
                    required 
                    value={nome} 
                    onChange={(e) => setNome(e.target.value)} 
                    placeholder="Ex: Nome do Professor" 
                    className="w-full border border-slate-200 p-4 rounded-2xl text-base focus:outline-none focus:border-[#0D3B66]" 
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Cargo / Titulação</label>
                    <input 
                      type="text" 
                      required 
                      value={cargo} 
                      onChange={(e) => setCargo(e.target.value)} 
                      placeholder="Ex: Prof. Doutor" 
                      className="w-full border border-slate-200 p-4 rounded-2xl text-base focus:outline-none focus:border-[#0D3B66]" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">E-mail</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="email@unifei.edu.br" 
                      className="w-full border border-slate-200 p-4 rounded-2xl text-base focus:outline-none focus:border-[#0D3B66]" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {profEditando ? 'Substituir Foto de Perfil (Opcional)' : 'Foto de Perfil'}
                  </label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setFotoFile(e.target.files?.[0] || null)} 
                    className="w-full border border-slate-200 p-3 rounded-2xl text-base file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" 
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Link Currículo Lattes</label>
                    <input 
                      type="url" 
                      value={lattesUrl} 
                      onChange={(e) => setLattesUrl(e.target.value)} 
                      placeholder="https://lattes.cnpq.br/..." 
                      className="w-full border border-slate-200 p-4 rounded-2xl text-base focus:outline-none focus:border-[#0D3B66]" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Google Scholar</label>
                    <input 
                      type="url" 
                      value={scholarUrl} 
                      onChange={(e) => setScholarUrl(e.target.value)} 
                      placeholder="https://scholar.google..." 
                      className="w-full border border-slate-200 p-4 rounded-2xl text-base focus:outline-none focus:border-[#0D3B66]" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Biografia / Apresentação</label>
                  <textarea 
                    rows={4} 
                    value={biografia} 
                    onChange={(e) => setBiografia(e.target.value)} 
                    placeholder="Breve biografia do professor..." 
                    className="w-full border border-slate-200 p-4 rounded-2xl text-base focus:outline-none focus:border-[#0D3B66]" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={salvando} 
                  className={`w-full py-4 rounded-2xl font-bold text-base text-white transition ${
                    profEditando ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#0D3B66] hover:bg-[#0A2D4F]'
                  }`}
                >
                  {salvando ? 'Salvando...' : profEditando ? 'Salvar Alterações' : 'Cadastrar Professor'}
                </button>
              </form>
            </div>
          </div>

          {/* Lista */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">Professores Cadastrados</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {professores.length === 0 ? (
                <div className="text-center py-20 text-slate-400 font-medium text-base">
                  Nenhum professor cadastrado.
                </div>
              ) : (
                professores.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-4 sm:p-5 border rounded-2xl flex items-center justify-between gap-4 transition ${
                      profEditando?.id === item.id ? 'border-amber-500 bg-amber-50/40' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {item.foto_url ? (
                        <img src={item.foto_url} className="w-16 h-16 rounded-full object-cover border border-slate-200 shrink-0" alt="" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-400 font-bold shrink-0">
                          Sem Foto
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-base text-slate-800 line-clamp-1">{item.nome}</p>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 line-clamp-1">{item.cargo}</p>
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