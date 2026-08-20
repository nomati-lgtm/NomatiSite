'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// --- TIPAGENS ---
interface Professor {
  id?: string | number;
  nome: string;
  email?: string; // Alterado de 'sala' para 'email'
  foto?: string;
  foto_url?: string;
  biografia?: string;
  site?: string;
  lattes?: string;
  linkedin?: string;
}

interface Noticia {
  id: string | number;
  titulo: string;
  resumo: string;
  conteudo?: string;
  imagem_url?: string;
}

interface Documento {
  id: string | number;
  titulo: string;
  categoria: string;
  descricao?: string;
  arquivo_url: string;
}

interface Publicacao {
  id: string | number;
  titulo: string;
  tipo: string;
  resumo?: string;
  link_ou_arquivo: string;
}

export default function Home() {
  const [listaProfessores, setListaProfessores] = useState<Professor[]>([]);
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);
  const [textosSite, setTextosSite] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Estados dos Modais / Filtros
  const [categoriaDocAtiva, setCategoriaDocAtiva] = useState<string | null>(null);
  const [tipoPubAtivo, setTipoPubAtivo] = useState<string | null>(null);

  // Modais de Detalhes
  const [noticiaSelecionada, setNoticiaSelecionada] = useState<Noticia | null>(null);
  const [professorSelecionado, setProfessorSelecionado] = useState<Professor | null>(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
       
        const [profRes, notRes, docRes, pubRes, conteudoRes] = await Promise.all([
          supabase.from('professores').select('*'),
          supabase.from('noticias').select('*').order('id', { ascending: false }).limit(3),
          supabase.from('documentos').select('*'),
          supabase.from('publicacoes').select('*'),
          supabase.from('conteudos_site').select('*'),
        ]);

        if (profRes.data) setListaProfessores(profRes.data);
        if (notRes.data) setNoticias(notRes.data);
        if (docRes.data) setDocumentos(docRes.data);
        if (pubRes.data) setPublicacoes(pubRes.data);
       
        if (conteudoRes.data) {
          const mapaTextos = conteudoRes.data.reduce((acc: Record<string, string>, curr: any) => {
            acc[curr.chave] = curr.conteudo;
            return acc;
          }, {});
          setTextosSite(mapaTextos);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do Supabase:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  const parseLista = (chave: string, valorPadrao: string[]) => {
    try {
      if (textosSite[chave]) {
        return JSON.parse(textosSite[chave]);
      }
    } catch {
      if (textosSite[chave]) {
        return textosSite[chave].split('\n').filter(Boolean);
      }
    }
    return valorPadrao;
  };

  const listaObjetivos = parseLista('lista_objetivos', [
    "Integração entre grupos de pesquisa do IEPG, promovendo trabalhos interdisciplinares e colaborativos.",
    "Estímulo à inovação, através de pesquisas voltadas ao desenvolvimento de produtos e processos industriais inteligentes.",
    "Ampliação da participação da UNIFEI em projetos cooperativos de P&D&I (Pesquisa, Desenvolvimento e Inovação).",
    "Promoção de estudos avançados em IA e Machine Learning, aplicados à manufatura, otimização de processos e análise preditiva.",
    "Criação de eventos científicos e técnicos voltados para as áreas de atuação do núcleo.",
    "Prestação de serviços especializados para empresas, incluindo consultorias e desenvolvimento de soluções inovadoras.",
    "Apoio à pré-incubação e incubação de startups de base tecnológica, fornecendo expertise em otimização, automação e tecnologias emergentes."
  ]);

  const listaEspec = parseLista('lista_especialidades', [
    "Pesquisa Operacional",
    "Otimização",
    "Inteligência Artificial",
    "Machine Learning",
    "Indústria 4.0",
    "Simulação"
  ]);

  return (
    <main className="bg-slate-50 min-h-screen">

      {/* HERO & NOTÍCIAS */}
      <section className="w-full max-w-[92rem] mx-auto px-4 sm:px-8 lg:px-12 py-16">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <img
              src={textosSite.foto_principal || ""}
              alt="NOMATI"
              className="w-full h-[450px] object-cover rounded-3xl shadow-xl"
            />
            <div className="mt-6 text-center space-y-2">
              <p className="text-xl font-medium text-slate-700">
                {textosSite.endereco_rua || 'Av. BPS, 1303, bairro Pinheirinho'}
              </p>
              <p className="text-xl font-medium text-slate-700">
                {textosSite.endereco_cep || 'Itajubá/MG – CEP 37500-903'}
              </p>
            </div>
          </div>

          <div>
            <div className="bg-white h-full rounded-3xl shadow-xl p-8 sm:p-10 border flex flex-col justify-between">
              <div>
                <h2 className="text-4xl font-bold text-center text-[#0D3B66] mb-8">
                  {textosSite.titulo_noticias || 'NOTÍCIAS'}
                </h2>

                <div className="space-y-6">
                  {loading ? (
                    <p className="text-slate-400 text-center">Carregando notícias...</p>
                  ) : noticias.length === 0 ? (
                    <p className="text-slate-400 text-center">Nenhuma notícia encontrada.</p>
                  ) : (
                    noticias.map((item) => (
                      <div key={item.id} className="border-b pb-4 flex gap-4 items-start">
                        {item.imagem_url && (
                          <img
                            src={item.imagem_url}
                            alt={item.titulo}
                            className="w-20 h-20 object-cover rounded-xl flex-shrink-0 cursor-pointer"
                            onClick={() => setNoticiaSelecionada(item)}
                          />
                        )}
                        <div className="flex-1">
                          <button
                            onClick={() => setNoticiaSelecionada(item)}
                            className="text-left font-semibold text-lg text-slate-800 hover:text-[#0D3B66] transition"
                          >
                            {item.titulo}
                          </button>
                          <p className="text-slate-600 text-sm mt-1 line-clamp-2">{item.resumo}</p>
                          <button
                            onClick={() => setNoticiaSelecionada(item)}
                            className="text-xs text-[#0D3B66] font-bold mt-2 hover:underline"
                          >
                            Ler notícia completa →
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="text-right mt-6">
                <Link
                  href="/noticias"
                  className="inline-block bg-[#0D3B66] text-white px-5 py-3 rounded-xl hover:bg-[#0A2D4F] transition font-medium"
                >
                  Todas as Notícias →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE NÓS */}
      <section id="sobre" className="w-full max-w-[92rem] mx-auto px-4 sm:px-8 lg:px-12 py-16">
        <h2 className="text-4xl font-bold text-[#0D3B66] mb-8">{textosSite.titulo_sobre || 'Sobre Nós'}</h2>
        <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-10 space-y-12 text-slate-600">
          <div className="space-y-4">
            <p
              className="text-lg leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: textosSite.sobre_p1 || 'O <strong class="text-slate-800">Núcleo de Otimização da Manufatura e de Tecnologia da Inovação (NOMATI)</strong> desenvolve pesquisas aplicadas nas áreas de sistemas de manufatura, projeto e desenvolvimento de produtos, gestão da inovação e gestão da qualidade.'
              }}
            />
            <p
              className="text-lg leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: textosSite.sobre_p2 || 'Com um enfoque multidisciplinar, o grupo também atua fortemente em <strong class="text-slate-800">Inteligência Artificial (IA) e Machine Learning (ML)</strong>, explorando técnicas avançadas para otimização de processos industriais, predição de variáveis críticas e automação inteligente.'
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 sm:p-10 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="text-xl font-bold text-[#0D3B66] mb-2">{textosSite.sobre_card1_titulo || 'Foco Regional e Parcerias'}</h3>
              <p className="text-base leading-relaxed">
                {textosSite.sobre_card1_texto || 'Por meio de parcerias estratégicas com empresas e instituições públicas e privadas, o NOMATI busca ser um agente de desenvolvimento e inovação, contribuindo para o avanço do conhecimento dentro da UNIFEI, no município e na região.'}
              </p>
            </div>
            <div className="p-8 sm:p-10 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="text-xl font-bold text-[#0D3B66] mb-2">{textosSite.sobre_card2_titulo || 'Pesquisa Aplicada'}</h3>
              <p className="text-base leading-relaxed">
                {textosSite.sobre_card2_texto || 'O grupo realiza pesquisas aplicadas voltadas para a redução de desperdício de materiais, automação de processos produtivos, análise preditiva em manufatura e otimização de processos decisórios por meio de IA.'}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#0D3B66]">{textosSite.titulo_objetivos || 'Os objetivos do grupo incluem:'}</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0">
              {listaObjetivos.map((objetivo: string, index: number) => (
                <li key={index} className="flex items-start space-x-3 text-base">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0D3B66]/10 text-[#0D3B66] flex items-center justify-center font-bold text-xs mt-1">
                    ✓
                  </span>
                  <span>{objetivo}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 bg-[#0D3B66] text-white rounded-2xl shadow-inner space-y-3">
            <h3 className="text-xl font-bold">{textosSite.infra_titulo || 'Infraestrutura Laboratorial'}</h3>
            <p className="text-base leading-relaxed opacity-90">
              {textosSite.infra_texto || 'O NOMATI conta com infraestrutura laboratorial moderna, incluindo laboratórios de usinagem, soldagem e Inovação de Produtos (LIP), que dispõem de máquina de prototipagem rápida, Scanner 3D e outras tecnologias voltadas para pesquisa e inovação.'}
            </p>
          </div>

          <p className="text-center text-lg italic text-slate-500 font-medium pt-6 border-t border-slate-100">
            {textosSite.citacao_rodape || '"Com sua atuação em modelagem matemática, otimização e inteligência computacional, o grupo se consolida como referência na aplicação de IA e Machine Learning na indústria e na inovação tecnológica, impactando positivamente o setor produtivo e a sociedade."'}
          </p>
        </div>
      </section>

      {/* EQUIPE */}
      <section id="equipe" className="w-full max-w-[92rem] mx-auto px-4 sm:px-8 lg:px-12 py-16">
        <h2 className="text-4xl font-bold text-[#0D3B66] mb-10">Nossa Equipe</h2>

        {loading ? (
          <p className="text-center text-slate-400">Carregando professores...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listaProfessores.map((prof, index) => (
              <div
                key={prof.id || index}
                onClick={() => setProfessorSelecionado(prof)}
                className="bg-white rounded-3xl shadow-lg p-8 sm:p-10 text-center hover:-translate-y-2 transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <img
                    src={prof.foto_url || prof.foto || '/placeholder.png'}
                    alt={prof.nome}
                    className="w-40 h-40 rounded-full object-cover mx-auto border-4 border-[#0D3B66]"
                  />
                  <h3 className="mt-5 text-xl font-bold text-[#0D3B66]">
                    {prof.nome}
                  </h3>
                  {prof.email && (
                    <a
                      href={`mailto:${prof.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-500 mt-2 block hover:text-[#0D3B66] transition text-sm"
                    >
                      {prof.email}
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-5">
                  {prof.site && (
                    <a
                      href={prof.site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#0D3B66] text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Site
                    </a>
                  )}
                  {prof.lattes && (
                    <a
                      href={prof.lattes}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#0D3B66] text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Lattes
                    </a>
                  )}
                  {prof.linkedin && (
                    <a
                      href={prof.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#0D3B66] text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ESPECIALIDADES */}
      <section id="especialidades" className="bg-white py-16">
        <div className="w-full max-w-[92rem] mx-auto px-4 sm:px-8 lg:px-12">
          <h2 className="text-4xl font-bold text-[#0D3B66] mb-10">Especialidades</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listaEspec.map((item: string) => (
              <div
                key={item}
                className="bg-slate-50 rounded-3xl p-8 sm:p-10 shadow-lg font-bold text-xl text-[#0D3B66] text-center"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PUBLICAÇÕES */}
      <section id="publicacoes" className="w-full max-w-[92rem] mx-auto px-4 sm:px-8 lg:px-12 py-16">
        <h2 className="text-4xl font-bold text-[#0D3B66] mb-10">Publicações</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {['graduacao', 'mestrado', 'doutorado'].map((tipo) => (
            <button
              key={tipo}
              onClick={() => setTipoPubAtivo(tipoPubAtivo === tipo ? null : tipo)}
              className="bg-white rounded-3xl shadow-lg p-8 sm:p-10 text-left hover:border-2 hover:border-[#0D3B66] transition capitalize font-bold text-2xl text-[#0D3B66] flex justify-between items-center"
            >
              <span>{tipo}</span>
              <span>→</span>
            </button>
          ))}
        </div>

        {tipoPubAtivo && (
          <div className="mt-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold capitalize text-[#0D3B66]">
                Publicações: {tipoPubAtivo}
              </h3>
              <button
                onClick={() => setTipoPubAtivo(null)}
                className="text-red-500 font-bold hover:underline"
              >
                Fechar ✕
              </button>
            </div>
            <div className="space-y-3">
              {publicacoes.filter((p) => p.tipo?.toLowerCase() === tipoPubAtivo).length === 0 ? (
                <p className="text-slate-400">Nenhuma publicação encontrada para esta categoria.</p>
              ) : (
                publicacoes
                  .filter((p) => p.tipo?.toLowerCase() === tipoPubAtivo)
                  .map((pub) => (
                    <div key={pub.id} className="p-4 border rounded-xl flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-slate-700 block">{pub.titulo}</span>
                        {pub.resumo && <p className="text-xs text-slate-500 mt-1">{pub.resumo}</p>}
                      </div>
                      <a
                        href={pub.link_ou_arquivo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#0D3B66] text-white px-4 py-2 rounded-lg text-sm flex-shrink-0"
                      >
                        Acessar
                      </a>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </section>

      {/* DOCUMENTOS */}
      <section id="documentos" className="bg-white py-16">
        <div className="w-full max-w-[92rem] mx-auto px-4 sm:px-8 lg:px-12">
          <h2 className="text-4xl font-bold text-[#0D3B66] mb-10">Documentos</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {['templates', 'formularios', 'normas', 'regulamentos'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaDocAtiva(categoriaDocAtiva === cat ? null : cat)}
                className="bg-slate-50 p-8 sm:p-10 rounded-3xl shadow hover:bg-[#0D3B66] hover:text-white transition font-bold text-xl capitalize text-left"
              >
                {cat}
              </button>
            ))}
          </div>

          {categoriaDocAtiva && (
            <div className="mt-8 bg-slate-100 p-8 sm:p-10 rounded-3xl border">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold capitalize text-[#0D3B66]">
                  Categoria: {categoriaDocAtiva}
                </h3>
                <button
                  onClick={() => setCategoriaDocAtiva(null)}
                  className="text-red-500 font-bold hover:underline"
                >
                  Fechar ✕
                </button>
              </div>
              <div className="space-y-3">
                {documentos.filter((d) => d.categoria?.toLowerCase() === categoriaDocAtiva).length === 0 ? (
                  <p className="text-slate-400">Nenhum documento cadastrado nesta categoria.</p>
                ) : (
                  documentos
                    .filter((d) => d.categoria?.toLowerCase() === categoriaDocAtiva)
                    .map((doc) => (
                      <div key={doc.id} className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm">
                        <div>
                          <span className="font-semibold text-slate-700 block">{doc.titulo}</span>
                          {doc.descricao && <p className="text-xs text-slate-500 mt-1">{doc.descricao}</p>}
                        </div>
                        <a
                          href={doc.arquivo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#0D3B66] text-white px-4 py-2 rounded-lg text-sm flex-shrink-0"
                        >
                          Baixar PDF
                        </a>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* EM NÚMEROS */}
      <section id="numeros" className="w-full max-w-[92rem] mx-auto px-4 sm:px-8 lg:px-12 py-16">
        <h2 className="text-4xl font-bold text-[#0D3B66] mb-10">Em Números</h2>
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 text-center">
          <h3 className="text-2xl font-semibold text-[#0D3B66]">Power BI</h3>
          <p className="mt-4 text-slate-500">
            O painel Power BI será incorporado aqui.
          </p>
        </div>
      </section>

      {/* --- MODAL DE NOTÍCIA COMPLETA --- */}
      {noticiaSelecionada && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl relative">
            <button
              onClick={() => setNoticiaSelecionada(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 text-2xl font-bold"
            >
              ✕
            </button>

            {noticiaSelecionada.imagem_url && (
              <img
                src={noticiaSelecionada.imagem_url}
                alt={noticiaSelecionada.titulo}
                className="w-full h-64 object-cover rounded-2xl mb-6"
              />
            )}

            <h3 className="text-3xl font-bold text-[#0D3B66] mb-3">
              {noticiaSelecionada.titulo}
            </h3>

            <p className="text-slate-600 font-medium italic mb-6 border-l-4 border-[#0D3B66] pl-4">
              {noticiaSelecionada.resumo}
            </p>

            <div className="text-slate-700 leading-relaxed space-y-4 whitespace-pre-line border-t pt-4">
              {noticiaSelecionada.conteudo || noticiaSelecionada.resumo}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DE DETALHES DO PROFESSOR ( COM SCROLL E ALTURA MÁXIMA ) --- */}
      {professorSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Cabeçalho do Modal */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-xl font-extrabold text-[#0D3B66]">
                {professorSelecionado.nome}
              </h3>
              <button
                onClick={() => setProfessorSelecionado(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-xl px-2 py-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Conteúdo com Rolagem (Scroll) */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-left">
              <div className="flex items-center gap-4">
                <img
                  src={professorSelecionado.foto_url || professorSelecionado.foto || '/placeholder.png'}
                  alt={professorSelecionado.nome}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#0D3B66] shrink-0"
                />
                <div>
                  {professorSelecionado.email ? (
                    <a
                      href={`mailto:${professorSelecionado.email}`}
                      className="text-sm font-semibold text-slate-600 hover:text-[#0D3B66] transition block"
                    >
                      E-mail: {professorSelecionado.email}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-slate-400">E-mail não informado</p>
                  )}
                </div>
              </div>

              {professorSelecionado.biografia && (
                <div>
                  <h4 className="text-sm font-bold text-[#0D3B66] uppercase tracking-wider mb-2">Biografia</h4>
                  <p className="text-slate-700 leading-relaxed text-base whitespace-pre-line break-words">
                    {professorSelecionado.biografia}
                  </p>
                </div>
              )}
            </div>

            {/* Rodapé com Botões de Links e Fechar */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                {professorSelecionado.site && (
                  <a
                    href={professorSelecionado.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0D3B66] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#0A2D4F] transition"
                  >
                    Site
                  </a>
                )}
                {professorSelecionado.lattes && (
                  <a
                    href={professorSelecionado.lattes}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0D3B66] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#0A2D4F] transition"
                  >
                    Lattes
                  </a>
                )}
                {professorSelecionado.linkedin && (
                  <a
                    href={professorSelecionado.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0D3B66] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#0A2D4F] transition"
                  >
                    LinkedIn
                  </a>
                )}
              </div>

              <button
                onClick={() => setProfessorSelecionado(null)}
                className="bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-300 transition text-sm ml-auto"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}