'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { 
  LogOut, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit, 
  FileText, 
  Loader2, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  

  // Exemplo de carregamento de dados e verificação de autenticação
  useEffect(() => {
    async function loadAdminData() {
      try {
        // Simulação de requisição para buscar dados do painel ou verificar sessão
        setTimeout(() => {
          setItems([
            { id: 1, title: 'Item Exemplo 1', category: 'Tecnologia', date: '2026-08-01' },
            { id: 2, title: 'Item Exemplo 2', category: 'Engenharia', date: '2026-08-03' },
          ]);
          setLoading(false);
        }, 800);
      } catch (error) {
        setActionMessage({ type: 'error', text: 'Erro ao carregar dados do painel.' });
        setLoading(false);
      }
    }

    loadAdminData();
  }, []);

  const handleLogout = async () => {
    // Insira aqui a lógica real de encerramento de sessão (ex: Supabase signOut)
    router.push('/');
  };

  const handleDelete = (id: number) => {
    setItems(items.filter(item => item.id !== id));
    setActionMessage({ type: 'success', text: 'Item removido com sucesso!' });
    setTimeout(() => setActionMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#0D3B66] animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Carregando painel administrativo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Cabeçalho do Painel */}
      <header className="bg-white border-b border-slate-200 px-6 lg:px-12 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-[#0D3B66] text-white p-2.5 rounded-xl">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-[#0D3B66]">Painel Administrativo</h1>
            <p className="text-sm text-slate-500">Gerenciamento completo do sistema</p>
          </div>
        </div>

       <div className="bg-white p-6 rounded-2xl shadow-sm border mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
  <div>
    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">GESTÃO DO SISTEMA</p>
    <h1 className="text-3xl font-bold text-[#0D3B66]">Painel Administrativo</h1>
    <p className="text-sm text-slate-600">Logado como: nomati@unifei.edu.br</p>
  </div>

  {/* Container que mantém os dois botões lado a lado */}
  <div className="flex items-center gap-3">
    {/* Botão para ver a página principal sem precisar sair */}
    <Link
      href="localhost:3000/admin"
      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium transition text-sm flex items-center gap-2"
    >
      Ver Página Principal
    </Link>

    {/* Botão de Sair da Conta existente */}
    <button 
      onClick={handleLogout}
      className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-xl font-medium transition text-sm"
    >
      Sair da Conta
    </button>
  </div>
</div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-8">
        {/* Mensagens de Feedback */}
        {actionMessage && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            actionMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {actionMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* Bloco de Ações e Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total de Registros</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{items.length}</h3>
            </div>
            <div className="bg-blue-50 text-blue-600 p-4 rounded-xl">
              <FileText size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm md:col-span-2 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Ações Rápidas</h3>
              <p className="text-sm text-slate-500">Adicione novos registros ou gerencie o conteúdo existente.</p>
            </div>
            <button 
              onClick={() => alert('Função de adicionar novo item')}
              className="flex items-center gap-2 bg-[#0D3B66] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#092a4b] transition shadow-sm text-sm"
            >
              <Plus size={18} />
              <span>Novo Registro</span>
            </button>
          </div>
        </div>

        {/* Tabela de Dados / Conteúdo */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <h3 className="font-bold text-slate-800 text-lg">Itens Cadastrados</h3>
          </div>

          {items.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p>Nenhum registro encontrado no momento.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Título</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 font-medium text-slate-900">#{item.id}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{item.title}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{item.date}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => alert(`Editar item #${item.id}`)}
                          className="inline-flex items-center justify-center p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}