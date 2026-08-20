'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Professor {
  id: string;
  nome: string;
  sala: string;
  foto_url: string;
  site: string;
  lattes: string;
  linkedin: string;
  biografia: string;
}

export default function AdminProfessores() {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [profEditando, setProfEditando] = useState<Professor | null>(null);

  const [nome, setNome] = useState('');
  const [sala, setSala] = useState('');
  const [site, setSite] = useState('');
  const [lattes, setLattes] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [biografia, setBiografia] = useState('');
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
    setSala(item.sala || '');
    setSite(item.site || '');
    setLattes(item.lattes || '');
    setLinkedin(item.linkedin || '');
    setBiografia(item.biografia || '');
    setFotoFile(null);
  };

  const limparFormulario = () => {
    setProfEditando(null);
    setNome('');
    setSala('');
    setSite('');
    setLattes('');
    setLinkedin('');
    setBiografia('');
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
      sala,
      site,
      lattes,
      linkedin,
      biografia,
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
    <main className="min-h-screen bg-slate-50 py-16 px-4 sm:px-8 lg:px-12 w-full">
      {/* Aumentado o limite de largura para preencher melhor monitores grandes */}
      <div className="max-w-[105rem] mx-auto space-y-12 w-full">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <span className="text-xs sm:text-sm font-bold text-[#0D3B66] uppercase tracking-wider">Gestão do Sistema</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0D3B66] mt-2">Gerenciar Professores</h1>
            <p className="text-slate-600 text-base sm:text-xl mt-2">Cadastre e edite membros do corpo docente</p>
          </div>
          <Link 
            href="/admin" 
            className="bg-slate-100 text-slate-700 px-6 py-3.5 rounded-2xl text-base font-semibold hover:bg-slate-200 transition shrink-0 text-center"
          >
            ← Menu Principal
          </Link>
        </div>

        {/* LAYOUT PRINCIPAL: Grid otimizado para dar mais espaço de largura */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Formulário (Ocupa mais colunas para alargar a caixa de biografia) */}
          <div className="xl:col-span-7 bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-200">
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
                  <label className="block text-sm font-bold text-slate-700 mb-2">Sala (Opcional)</label>
                  <input 
                    type="text" 
                    value={sala} 
                    onChange={(e) => setSala(e.target.value)} 
                    placeholder="Ex: Sala 204 - Bloco B" 
                    className="w-full border border-slate-200 p-4 rounded-2xl text-base focus:outline-none focus:border-[#0D3B66]" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Site Pessoal (Opcional)</label>
                  <input 
                    type="url" 
                    value={site} 
                    onChange={(e) => setSite(e.target.value)} 
                    placeholder="https://..." 
                    className="w-full border border-slate-200 p-4 rounded-2xl text-base focus:outline-none focus:border-[#0D3B66]" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {profEditando ? 'Substituir Foto de Perfil (Opcional)' : 'Foto de Perfil (Opcional)'}
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
                  <label className="block text-sm font-bold text-slate-700 mb-2">Currículo Lattes (Opcional)</label>
                  <input 
                    type="url" 
                    value={lattes} 
                    onChange={(e) => setLattes(e.target.value)} 
                    placeholder="https://lattes.cnpq.br/..." 
                    className="w-full border border-slate-200 p-4 rounded-2xl text-base focus:outline-none focus:border-[#0D3B66]" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">LinkedIn (Opcional)</label>
                  <input 
                    type="url" 
                    value={linkedin} 
                    onChange={(e) => setLinkedin(e.target.value)} 
                    placeholder="https://linkedin.com/in/..." 
                    className="w-full border border-slate-200 p-4 rounded-2xl text-base focus:outline-none focus:border-[#0D3B66]" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Biografia / Apresentação (Sem limite de caracteres)</label>
                {/* Altura inicial maior e resize ativado para permitir esticar à vontade */}
                <textarea 
                  rows={8} 
                  value={biografia} 
                  onChange={(e) => setBiografia(e.target.value)} 
                  placeholder="Escreva a biografia completa do professor..." 
                  className="w-full border border-slate-200 p-4 rounded-2xl text-base focus:outline-none focus:border-[#0D3B66] resize-y" 
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

          {/* Lista de Professores (Ocupa as colunas restantes) */}
          <div className="xl:col-span-5 bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">Professores Cadastrados</h2>
            <div className="space-y-4 max-h-[750px] overflow-y-auto pr-2">
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
                    <div className="flex items-center gap-4 min-w-0">
                      {item.foto_url ? (
                        <img src={item.foto_url} className="w-16 h-16 rounded-full object-cover border border-slate-200 shrink-0" alt="" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-400 font-bold shrink-0">
                          Sem Foto
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-base text-slate-800 truncate">{item.nome}</p>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">{item.sala || 'Sala não informada'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
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