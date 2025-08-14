
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

// --- Dummy Models/Components (replace with actual imports in a real project) ---
// These are placeholders to make the file runnable and demonstrate functionality.
// In a real application, these would be imported from your backend service or component library.

const CooperadoNotificacao = {
  list: async (orderBy) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("Simulating API call: CooperadoNotificacao.list with order:", orderBy);
    // Return sample data for demonstration
    return [
      { id: 'notif_001', cooperado_id: '123', titulo: 'Nova Mensagem Importante', mensagem: 'Por favor, verifique seu extrato bancário atualizado.', tipo: 'info', created_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), lida: false },
      { id: 'notif_002', cooperado_id: '456', titulo: 'Assembleia Anual', mensagem: 'Lembrete: A assembleia ocorrerá na próxima terça-feira.', tipo: 'warning', created_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), lida: false },
      { id: 'notif_003', cooperado_id: '123', titulo: 'Nova Mensagem Importante', mensagem: 'Por favor, verifique seu extrato bancário atualizado.', tipo: 'info', created_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), lida: true }, // Group with notif_001
      { id: 'notif_004', cooperado_id: '789', titulo: 'Pagamento Confirmado', mensagem: 'Seu pagamento de R$ 500,00 foi processado com sucesso.', tipo: 'success', created_date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), lida: false },
      { id: 'notif_005', cooperado_id: '101', titulo: 'Erro de Login', mensagem: 'Detectamos um login incomum em sua conta. Contate o suporte.', tipo: 'error', created_date: new Date(Date.now() - 1000 * 60 * 10).toISOString(), lida: false },
      { id: 'notif_006', cooperado_id: '123', titulo: 'Oferta Especial', mensagem: 'Não perca nossa nova linha de crédito com taxas reduzidas!', tipo: 'info', created_date: new Date(Date.now() - 1000 * 60 * 5).toISOString(), lida: false, link_acao: 'https://example.com/oferta' },
    ];
  },
  create: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log("Simulating API call: Creating notification:", data);
    return { ...data, id: `new_notif_${Date.now()}`, created_date: new Date().toISOString(), lida: false };
  },
  update: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Simulating API call: Updating notification ${id}:`, data);
    return { id, ...data };
  },
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log("Simulating API call: Deleting notification:", id);
    return true;
  }
};

const Cooperado = {
  list: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log("Simulating API call: Cooperado.list");
    return [
      { numero_associado: '123', nome: 'João Silva' },
      { numero_associado: '456', nome: 'Maria Souza' },
      { numero_associado: '789', nome: 'Carlos Mendes' },
      { numero_associado: '101', nome: 'Ana Costa' },
      { numero_associado: '202', nome: 'Pedro Almeida' },
      { numero_associado: '303', nome: 'Sofia Pereira' },
    ];
  }
};

const NotificacaoCard = ({ notificacao, cooperado, isGrupo, quantidade, onViewDetails, onEdit }) => {
  const cardBorderColor = notificacao.tipo === 'info' ? 'border-blue-400' :
                          notificacao.tipo === 'warning' ? 'border-yellow-400' :
                          notificacao.tipo === 'success' ? 'border-green-400' :
                          notificacao.tipo === 'error' ? 'border-red-400' : 'border-gray-300';
  const bgColor = notificacao.lida ? 'bg-gray-50' : 'bg-white';

  return (
    <div className={`p-4 border rounded-lg shadow-sm ${bgColor} ${cardBorderColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{notificacao.titulo}</h3>
          <p className="text-sm text-gray-600">{notificacao.mensagem}</p>
          <p className="text-xs text-gray-500 mt-1">
            {isGrupo 
              ? `Grupo: Enviado para ${quantidade} cooperado(s)` 
              : `Para: ${cooperado ? cooperado.nome : `Cooperado ${notificacao.cooperado_id} (Desconhecido)`}`
            }
          </p>
          <p className="text-xs text-gray-500">
            Criado em: {new Date(notificacao.created_date).toLocaleString()}
          </p>
          {notificacao.link_acao && (
            <a href={notificacao.link_acao} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs mt-1 block">
              Ver Detalhes/Ação
            </a>
          )}
        </div>
        <div className="flex space-x-2">
          <button onClick={onViewDetails} className="text-blue-600 hover:underline text-sm">Detalhes</button>
          {!isGrupo && (
            <button onClick={onEdit} className="text-indigo-600 hover:underline text-sm">Editar</button>
          )}
        </div>
      </div>
    </div>
  );
};

const NotificacaoDetailsModal = ({ notificacao, cooperado, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
      <h2 className="text-xl font-bold mb-4">Detalhes da Notificação</h2>
      <div className="space-y-2 text-gray-700">
        <p><strong>Título:</strong> {notificacao.titulo}</p>
        <p><strong>Mensagem:</strong> {notificacao.mensagem}</p>
        <p><strong>Tipo:</strong> {notificacao.tipo.charAt(0).toUpperCase() + notificacao.tipo.slice(1)}</p>
        {notificacao.link_acao && <p><strong>Link de Ação:</strong> <a href={notificacao.link_acao} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{notificacao.link_acao}</a></p>}
        <p><strong>Destinatário:</strong> {cooperado ? cooperado.nome : `Cooperado ${notificacao.cooperado_id} (Desconhecido)`}</p>
        {notificacao.isGrupo && <p><strong>Quantidade no Grupo:</strong> {notificacao.quantidade} cooperados</p>}
        <p><strong>Status:</strong> {notificacao.lida ? 'Lida' : 'Não Lida'}</p>
        <p><strong>Criada em:</strong> {new Date(notificacao.created_date).toLocaleString()}</p>
      </div>
      <div className="mt-6 text-right">
        <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Fechar</button>
      </div>
    </div>
  </div>
);

const NotificacaoFormModal = ({ cooperados, editingNotificacao, onClose, onSave }) => {
  const [form, setForm] = useState({
    titulo: '',
    mensagem: '',
    tipo: 'info',
    link_acao: '',
    cooperado_id: '',
    destinatarios: [], // For multiple selection
    sendToAll: false,
  });

  useEffect(() => {
    if (editingNotificacao) {
      setForm({
        titulo: editingNotificacao.titulo,
        mensagem: editingNotificacao.mensagem,
        tipo: editingNotificacao.tipo,
        link_acao: editingNotificacao.link_acao || '',
        cooperado_id: editingNotificacao.cooperado_id || '',
        destinatarios: [], // Editing implies single, not bulk send
        sendToAll: false,
      });
    } else {
      setForm({
        titulo: '',
        mensagem: '',
        tipo: 'info',
        link_acao: '',
        cooperado_id: '',
        destinatarios: [],
        sendToAll: false,
      });
    }
  }, [editingNotificacao]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'destinatarios') {
      const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
      setForm(prev => ({ ...prev, destinatarios: selectedOptions }));
    } else {
      setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingNotificacao) {
      // Editing existing notification
      onSave({
        titulo: form.titulo,
        mensagem: form.mensagem,
        tipo: form.tipo,
        link_acao: form.link_acao,
        cooperado_id: editingNotificacao.cooperado_id // Keep original cooperado_id for editing
      });
    } else {
      // Creating new notification
      if (form.sendToAll) {
        onSave({
          titulo: form.titulo,
          mensagem: form.mensagem,
          tipo: form.tipo,
          link_acao: form.link_acao,
          destinatarios: cooperados.map(c => c.numero_associado) // Send to all available cooperados
        });
      } else if (form.destinatarios.length > 0) {
        onSave({
          titulo: form.titulo,
          mensagem: form.mensagem,
          tipo: form.tipo,
          link_acao: form.link_acao,
          destinatarios: form.destinatarios
        });
      } else {
        toast({ title: 'Erro', description: 'Selecione um ou mais cooperados, ou marque para enviar para todos.', variant: 'destructive' });
        return;
      }
    }
    onClose(); // Close on successful save
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">{editingNotificacao ? "Editar Notificação" : "Enviar Nova Notificação"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título</label>
            <input type="text" id="titulo" name="titulo" value={form.titulo} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div>
            <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700">Mensagem</label>
            <textarea id="mensagem" name="mensagem" value={form.mensagem} onChange={handleChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required></textarea>
          </div>
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Tipo</label>
            <select id="tipo" name="tipo" value={form.tipo} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="info">Informação</option>
              <option value="warning">Aviso</option>
              <option value="success">Sucesso</option>
              <option value="error">Erro</option>
            </select>
          </div>
          <div>
            <label htmlFor="link_acao" className="block text-sm font-medium text-gray-700">Link de Ação (Opcional)</label>
            <input type="url" id="link_acao" name="link_acao" value={form.link_acao} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="https://exemplo.com/acao" />
          </div>
          {!editingNotificacao && (
            <>
              <div className="flex items-center">
                <input type="checkbox" id="sendToAll" name="sendToAll" checked={form.sendToAll} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="sendToAll" className="ml-2 block text-sm text-gray-900">Enviar para todos os cooperados</label>
              </div>
              {!form.sendToAll && (
                <div>
                  <label htmlFor="destinatarios" className="block text-sm font-medium text-gray-700">Destinatário(s)</label>
                  <select
                    id="destinatarios"
                    name="destinatarios"
                    multiple // Allow multiple selection
                    value={form.destinatarios}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-32 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {cooperados.map(c => (
                      <option key={c.numero_associado} value={c.numero_associado}>{c.nome} ({c.numero_associado})</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Selecione um ou mais cooperados (Ctrl/Cmd + clique para selecionar múltiplos)</p>
                </div>
              )}
            </>
          )}
          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};
// --- End Dummy Models/Components ---


export default function NotificacoesCooperados() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [filteredNotificacoes, setFilteredNotificacoes] = useState([]);
  const [cooperados, setCooperados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotificacao, setSelectedNotificacao] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingNotificacao, setEditingNotificacao] = useState(null);
  const [filters, setFilters] = useState({
    tipo: "all",
    lida: "all",
    cooperado: "all"
  });

  const loadData = async () => {
    try {
      setLoading(true); // Ensure loading is true when starting data load
      const [notificacoesData, cooperadosData] = await Promise.all([
        CooperadoNotificacao.list("-created_date"),
        Cooperado.list()
      ]);
      
      // Agrupar notificações que foram enviadas em massa
      const notificacoesAgrupadas = agruparNotificacoes(notificacoesData || []);
      setNotificacoes(notificacoesAgrupadas);
      setCooperados(cooperadosData || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({ title: 'Erro', description: 'Erro ao carregar notificações', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const agruparNotificacoes = (notificacoes) => {
    const grupos = {};
    const notificacoesAgrupadasResult = [];
    
    notificacoes.forEach(notif => {
      // Criar uma chave baseada no título, mensagem e horário (aproximado)
      const timestamp = new Date(notif.created_date).getTime();
      const timestampRounded = Math.floor(timestamp / (5 * 60 * 1000)) * (5 * 60 * 1000); // Agrupar por 5 minutos
      const chave = `${notif.titulo}_${notif.mensagem}_${notif.tipo}_${timestampRounded}`;
      
      if (grupos[chave]) {
        grupos[chave].destinatarios.push(notif.cooperado_id);
        grupos[chave].quantidade++;
        // Manter o status "não lida" se pelo menos uma não foi lida
        if (!notif.lida) {
          grupos[chave].algumaNaoLida = true;
        }
      } else {
        grupos[chave] = {
          ...notif,
          destinatarios: [notif.cooperado_id],
          quantidade: 1,
          algumaNaoLida: !notif.lida,
          isGrupo: false // Temporarily false, will be set to true if quantity > 1
        };
      }
    });

    // Converter grupos em array e marcar os que são grupos
    Object.values(grupos).forEach(grupo => {
      if (grupo.quantidade > 1) {
        grupo.isGrupo = true;
        grupo.lida = !grupo.algumaNaoLida; // Se alguma não foi lida, o grupo é "não lido"
      }
      notificacoesAgrupadasResult.push(grupo);
    });

    return notificacoesAgrupadasResult.sort((a, b) => 
      new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
    );
  };

  const filterNotificacoes = useCallback(() => {
    let currentFiltered = notificacoes;

    // Search term filter
    if (searchTerm) {
      currentFiltered = currentFiltered.filter(notif =>
        notif.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notif.mensagem.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (notif.isGrupo ? 'grupo' : (cooperados.find(c => c.numero_associado === notif.cooperado_id)?.nome || '')).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filters.tipo !== "all") {
      currentFiltered = currentFiltered.filter(notif => notif.tipo === filters.tipo);
    }

    // Read status filter
    if (filters.lida === "read") {
      currentFiltered = currentFiltered.filter(notif => notif.lida);
    } else if (filters.lida === "unread") {
      currentFiltered = currentFiltered.filter(notif => !notif.lida);
    }

    // Cooperado filter
    if (filters.cooperado !== "all") {
      currentFiltered = currentFiltered.filter(notif => 
        notif.isGrupo ? notif.destinatarios.includes(filters.cooperado) : notif.cooperado_id === filters.cooperado
      );
    }

    setFilteredNotificacoes(currentFiltered);
  }, [notificacoes, searchTerm, filters, cooperados]);

  useEffect(() => {
    loadData();
  }, []); // Load data only once on mount

  useEffect(() => {
    filterNotificacoes();
  }, [notificacoes, searchTerm, filters, filterNotificacoes]); // Re-filter when dependencies change

  const handleSaveNotificacao = async (notificacaoData) => {
    try {
      if (editingNotificacao) {
        await CooperadoNotificacao.update(editingNotificacao.id, notificacaoData);
        toast({ title: 'Sucesso', description: 'Notificação atualizada com sucesso!' });
      } else {
        if (notificacaoData.destinatarios && notificacaoData.destinatarios.length > 0) {
          // Enviar para múltiplos cooperados
          const promises = notificacaoData.destinatarios.map(cooperadoId =>
            CooperadoNotificacao.create({
              cooperado_id: cooperadoId,
              titulo: notificacaoData.titulo,
              mensagem: notificacaoData.mensagem,
              tipo: notificacaoData.tipo,
              link_acao: notificacaoData.link_acao
            })
          );
          await Promise.all(promises);
          toast({ title: 'Sucesso', description: `Notificação enviada para ${notificacaoData.destinatarios.length} cooperados!` });
        } else {
          // Fallback, though current form design ensures either destinatarios or editingNotificacao
          await CooperadoNotificacao.create(notificacaoData);
          toast({ title: 'Sucesso', description: 'Notificação criada com sucesso!' });
        }
      }
      
      loadData();
      setShowForm(false);
      setEditingNotificacao(null);
    } catch (error) {
      console.error("Erro ao salvar notificação:", error);
      toast({ title: 'Erro', description: 'Erro ao salvar notificação', variant: 'destructive' });
    }
  };

  const handleEnviarNotificacaoGeral = () => {
    setEditingNotificacao(null); // Ensure no notification is being edited
    setShowForm(true); // Open the form for a new notification
  };

  const stats = {
    total: notificacoes.length,
    naoLidas: notificacoes.filter(n => !n.lida).length,
    info: notificacoes.filter(n => n.tipo === 'info').length,
    warning: notificacoes.filter(n => n.tipo === 'warning').length,
    success: notificacoes.filter(n => n.tipo === 'success').length,
    error: notificacoes.filter(n => n.tipo === 'error').length
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Notificações dos Cooperados</h1>
        <button
          onClick={handleEnviarNotificacaoGeral}
          className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
        >
          Enviar Nova Notificação
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-500">Não Lidas</p>
          <p className="text-2xl font-bold text-red-500">{stats.naoLidas}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-500">Informação</p>
          <p className="text-2xl font-bold text-blue-500">{stats.info}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-500">Aviso</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.warning}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-500">Sucesso</p>
          <p className="text-2xl font-bold text-green-500">{stats.success}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-grow">
          <label htmlFor="search" className="sr-only">Pesquisar</label>
          <input
            type="text"
            id="search"
            placeholder="Pesquisar por título, mensagem ou cooperado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="filterTipo" className="sr-only">Filtrar por Tipo</label>
          <select
            id="filterTipo"
            value={filters.tipo}
            onChange={(e) => setFilters(prev => ({ ...prev, tipo: e.target.value }))}
            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos os Tipos</option>
            <option value="info">Informação</option>
            <option value="warning">Aviso</option>
            <option value="success">Sucesso</option>
            <option value="error">Erro</option>
          </select>
        </div>
        <div>
          <label htmlFor="filterLida" className="sr-only">Filtrar por Status</label>
          <select
            id="filterLida"
            value={filters.lida}
            onChange={(e) => setFilters(prev => ({ ...prev, lida: e.target.value }))}
            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos os Status</option>
            <option value="read">Lidas</option>
            <option value="unread">Não Lidas</option>
          </select>
        </div>
        <div>
          <label htmlFor="filterCooperado" className="sr-only">Filtrar por Cooperado</label>
          <select
            id="filterCooperado"
            value={filters.cooperado}
            onChange={(e) => setFilters(prev => ({ ...prev, cooperado: e.target.value }))}
            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos os Cooperados</option>
            {cooperados.map(c => (
              <option key={c.numero_associado} value={c.numero_associado}>{c.nome}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Notificações */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8 text-gray-600">Carregando notificações...</div>
        ) : filteredNotificacoes.length > 0 ? (
          filteredNotificacoes.map((notificacao) => {
            // For grouped notifications, the cooperado_id on the group object itself might be arbitrary
            // but for single notifications, it's specific. We pass the first recipient for group
            // or the single recipient for individual, so `NotificacaoCard` can display a name.
            const displayCooperadoId = notificacao.isGrupo ? notificacao.destinatarios[0] : notificacao.cooperado_id;
            const cooperado = cooperados.find(c => c.numero_associado === displayCooperadoId);
            return (
              <NotificacaoCard
                key={notificacao.id || `${notificacao.titulo}-${notificacao.created_date}-${notificacao.destinatarios.join(',')}`} /* Unique key for grouped */
                notificacao={notificacao}
                cooperado={cooperado}
                isGrupo={notificacao.isGrupo}
                quantidade={notificacao.quantidade}
                onViewDetails={() => {
                  setSelectedNotificacao(notificacao);
                  setShowDetails(true);
                }}
                onEdit={() => {
                  if (!notificacao.isGrupo) {
                    setEditingNotificacao(notificacao);
                    setShowForm(true);
                  } else {
                    toast({ title: 'Aviso', description: 'Não é possível editar notificações em grupo diretamente. Crie uma nova notificação.' });
                  }
                }}
              />
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhuma notificação encontrada com os critérios selecionados.
          </div>
        )}
      </div>

      {/* Modals */}
      {showDetails && selectedNotificacao && (
        <NotificacaoDetailsModal
          notificacao={selectedNotificacao}
          cooperado={cooperados.find(c => c.numero_associado === selectedNotificacao.cooperado_id || (selectedNotificacao.isGrupo && selectedNotificacao.destinatarios[0] === c.numero_associado))}
          onClose={() => setShowDetails(false)}
        />
      )}

      {showForm && (
        <NotificacaoFormModal
          cooperados={cooperados}
          editingNotificacao={editingNotificacao}
          onClose={() => {
            setShowForm(false);
            setEditingNotificacao(null);
          }}
          onSave={handleSaveNotificacao}
        />
      )}
    </div>
  );
}
