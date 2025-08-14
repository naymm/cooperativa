import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Mail, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Download,
  Play,
  Pause,
  TestTube,
  Zap,
  Settings
} from "lucide-react";
import { toast } from "sonner";
import CobrancaService from "@/services/CobrancaService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function GerenciadorCobrancas() {
  console.log("[GerenciadorCobrancas] Componente carregado");
  
  const [loading, setLoading] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [simulando, setSimulando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [cooperadosEmAtraso, setCooperadosEmAtraso] = useState([]);
  const [relatorio, setRelatorio] = useState(null);
  const [resultadoEnvio, setResultadoEnvio] = useState(null);
  const [resultadoSimulacao, setResultadoSimulacao] = useState(null);
  const [sistemaConfigurado, setSistemaConfigurado] = useState(false);

  // Email para simulação
  const EMAIL_SIMULACAO = "gruposanep21@gmail.com";

  // Carregar dados iniciais
  useEffect(() => {
    console.log("[GerenciadorCobrancas] useEffect executado");
    verificarConfiguracao();
    carregarDados();
  }, []);

  const verificarConfiguracao = () => {
    const configurado = CobrancaService.isSistemaConfigurado();
    setSistemaConfigurado(configurado);
    console.log("[GerenciadorCobrancas] Sistema configurado:", configurado);
  };

  const carregarDados = async () => {
    console.log("[GerenciadorCobrancas] Carregando dados...");
    setLoading(true);
    try {
      const cooperados = await CobrancaService.buscarCooperadosEmAtraso();
      console.log("[GerenciadorCobrancas] Cooperados em atraso:", cooperados);
      setCooperadosEmAtraso(cooperados);
      
      const relatorioData = await CobrancaService.gerarRelatorioCobrancas();
      console.log("[GerenciadorCobrancas] Relatório:", relatorioData);
      setRelatorio(relatorioData);
      
    } catch (error) {
      console.error("[GerenciadorCobrancas] Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados de cobrança");
    } finally {
      setLoading(false);
    }
  };

  const enviarCobrancasEmLote = async () => {
    if (!sistemaConfigurado) {
      toast.error("Sistema de email não configurado. Configure o SMTP primeiro.");
      return;
    }

    if (cooperadosEmAtraso.length === 0) {
      toast.warning("Não há cooperados em atraso para cobrar");
      return;
    }

    setEnviando(true);
    setProgresso(0);
    setResultadoEnvio(null);

    try {
      toast.info("Iniciando envio de cobranças...");
      
      const resultado = await CobrancaService.enviarCobrancasEmLote();
      setResultadoEnvio(resultado);
      
      if (resultado.enviados > 0) {
        toast.success(`${resultado.enviados} emails de cobrança enviados com sucesso!`);
      }
      
      if (resultado.falhas > 0) {
        toast.error(`${resultado.falhas} emails falharam no envio`);
      }
      
      // Recarregar dados após envio
      await carregarDados();
      
    } catch (error) {
      console.error("Erro ao enviar cobranças:", error);
      toast.error("Erro ao enviar cobranças");
    } finally {
      setEnviando(false);
      setProgresso(100);
    }
  };

  const enviarCobrancaIndividual = async (cooperadoData) => {
    if (!sistemaConfigurado) {
      toast.error("Sistema de email não configurado. Configure o SMTP primeiro.");
      return;
    }

    try {
      toast.info(`Enviando cobrança para ${cooperadoData.cooperado.nome_completo}...`);
      
      const resultado = await CobrancaService.enviarEmailCobranca(cooperadoData);
      
      if (resultado.sucesso) {
        toast.success(`Cobrança enviada para ${resultado.cooperado}`);
      } else {
        toast.error(`Falha ao enviar cobrança para ${resultado.cooperado}: ${resultado.erro}`);
      }
      
      // Recarregar dados
      await carregarDados();
      
    } catch (error) {
      console.error("Erro ao enviar cobrança individual:", error);
      toast.error("Erro ao enviar cobrança individual");
    }
  };

  const simularCobranca = async (tipoCobranca) => {
    if (!sistemaConfigurado) {
      toast.error("Sistema de email não configurado. Configure o SMTP primeiro.");
      return;
    }

    setSimulando(true);
    setResultadoSimulacao(null);

    try {
      toast.info(`Simulando cobrança ${tipoCobranca} para ${EMAIL_SIMULACAO}...`);
      
      const resultado = await CobrancaService.simularCobranca(EMAIL_SIMULACAO, tipoCobranca);
      setResultadoSimulacao(resultado);
      
      if (resultado.sucesso) {
        toast.success(`Cobrança ${tipoCobranca} simulada e enviada para ${EMAIL_SIMULACAO}!`);
      } else {
        toast.error(`Falha ao simular cobrança: ${resultado.erro}`);
      }
      
    } catch (error) {
      console.error("Erro ao simular cobrança:", error);
      toast.error("Erro ao simular cobrança");
    } finally {
      setSimulando(false);
    }
  };

  const simularTodosTipos = async () => {
    if (!sistemaConfigurado) {
      toast.error("Sistema de email não configurado. Configure o SMTP primeiro.");
      return;
    }

    setSimulando(true);
    setResultadoSimulacao(null);

    try {
      toast.info(`Simulando todos os tipos de cobrança para ${EMAIL_SIMULACAO}...`);
      
      const resultado = await CobrancaService.simularTodosTiposCobranca(EMAIL_SIMULACAO);
      setResultadoSimulacao(resultado);
      
      if (resultado.enviados > 0) {
        toast.success(`${resultado.enviados} emails de simulação enviados para ${EMAIL_SIMULACAO}!`);
      }
      
      if (resultado.falhas > 0) {
        toast.error(`${resultado.falhas} simulações falharam`);
      }
      
    } catch (error) {
      console.error("Erro ao simular todos os tipos:", error);
      toast.error("Erro ao simular cobranças");
    } finally {
      setSimulando(false);
    }
  };

  const exportarRelatorio = () => {
    if (!relatorio) return;
    
    const dados = relatorio.cooperados.map(coop => ({
      'Nome': coop.nome,
      'Número de Associado': coop.numeroAssociado,
      'Email': coop.email,
      'Valor em Atraso': `${coop.valor?.toLocaleString()} Kz`,
      'Dias em Atraso': coop.diasEmAtraso,
      'Data de Vencimento': format(new Date(coop.dataVencimento), 'dd/MM/yyyy'),
      'Mês de Referência': coop.mesReferencia,
      'Última Cobrança': coop.ultimaCobranca ? format(new Date(coop.ultimaCobranca), 'dd/MM/yyyy HH:mm') : 'Nunca',
      'Tentativas de Cobrança': coop.tentativasCobranca
    }));
    
    const csv = [
      Object.keys(dados[0]).join(','),
      ...dados.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_cobrancas_${format(new Date(), 'dd-MM-yyyy')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("Relatório exportado com sucesso!");
  };

  const getTipoCobranca = (diasEmAtraso) => {
    if (diasEmAtraso >= 30) return { tipo: 'grave', label: 'Crítico', cor: 'destructive' };
    if (diasEmAtraso >= 15) return { tipo: 'medio', label: 'Urgente', cor: 'secondary' };
    return { tipo: 'inicial', label: 'Atraso', cor: 'default' };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <CardTitle>Gerenciador de Cobranças</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status da Configuração */}
      <Alert className={sistemaConfigurado ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
        {sistemaConfigurado ? (
          <CheckCircle className="w-4 h-4 text-green-600" />
        ) : (
          <XCircle className="w-4 h-4 text-red-600" />
        )}
        <AlertDescription>
          <strong>
            {sistemaConfigurado ? "✅ Sistema Configurado" : "❌ Sistema Não Configurado"}
          </strong>
          <br />
          {sistemaConfigurado 
            ? "O sistema de email está configurado e pronto para enviar cobranças."
            : "Configure o SMTP na seção de configuração para enviar emails de cobrança."
          }
        </AlertDescription>
      </Alert>

      {/* Cabeçalho com estatísticas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <CardTitle>Gerenciador de Cobranças</CardTitle>
              <Badge variant={sistemaConfigurado ? "default" : "secondary"}>
                {sistemaConfigurado ? "Configurado" : "Não Configurado"}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { verificarConfiguracao(); carregarDados(); }}
                disabled={enviando || simulando}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportarRelatorio}
                disabled={!relatorio}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{relatorio?.totalCooperados || 0}</div>
              <div className="text-sm text-blue-800">Cooperados em Atraso</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {(relatorio?.totalEmAtraso || 0).toLocaleString()} Kz
              </div>
              <div className="text-sm text-orange-800">Total em Atraso</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {cooperadosEmAtraso.filter(c => c.diasEmAtraso >= 30).length}
              </div>
              <div className="text-sm text-red-800">Críticos (30+ dias)</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {resultadoEnvio?.enviados || 0}
              </div>
              <div className="text-sm text-green-800">Emails Enviados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulação de Cobranças */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5 text-purple-600" />
            Simulação de Cobranças
            <Badge variant="outline" className="ml-2">
              {EMAIL_SIMULACAO}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Button
              onClick={() => simularCobranca('cobranca_atraso')}
              disabled={simulando || !sistemaConfigurado}
              variant="outline"
              size="sm"
            >
              {simulando ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Simulando...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Cobrança Inicial
                </>
              )}
            </Button>
            
            <Button
              onClick={() => simularCobranca('cobranca_atraso_medio')}
              disabled={simulando || !sistemaConfigurado}
              variant="outline"
              size="sm"
            >
              {simulando ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Simulando...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Cobrança Urgente
                </>
              )}
            </Button>
            
            <Button
              onClick={() => simularCobranca('cobranca_atraso_grave')}
              disabled={simulando || !sistemaConfigurado}
              variant="outline"
              size="sm"
            >
              {simulando ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Simulando...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Cobrança Crítica
                </>
              )}
            </Button>
            
            <Button
              onClick={simularTodosTipos}
              disabled={simulando || !sistemaConfigurado}
              variant="default"
              size="sm"
            >
              {simulando ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Simulando Todos...
                </>
              ) : (
                <>
                  <TestTube className="w-4 h-4 mr-2" />
                  Simular Todos
                </>
              )}
            </Button>
          </div>

          {resultadoSimulacao && (
            <Alert className={resultadoSimulacao.falhas > 0 ? "border-orange-200 bg-orange-50" : "border-green-200 bg-green-50"}>
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>
                <strong>Resultado da Simulação:</strong><br />
                {resultadoSimulacao.total ? (
                  <>
                    ✅ {resultadoSimulacao.enviados} emails simulados enviados<br />
                    {resultadoSimulacao.falhas > 0 && (
                      <>
                        ❌ {resultadoSimulacao.falhas} simulações falharam<br />
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm">Ver detalhes dos erros</summary>
                          <div className="mt-2 text-xs space-y-1">
                            {resultadoSimulacao.resultados
                              ?.filter(r => !r.sucesso)
                              .map((r, i) => (
                                <div key={i} className="text-red-600">
                                  {r.tipoCobranca}: {r.erro}
                                </div>
                              ))}
                          </div>
                        </details>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {resultadoSimulacao.sucesso ? (
                      `✅ Email de cobrança ${resultadoSimulacao.tipoCobranca} enviado para ${EMAIL_SIMULACAO}`
                    ) : (
                      `❌ Falha ao enviar simulação: ${resultadoSimulacao.erro}`
                    )}
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Controles de envio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-green-600" />
            Envio de Cobranças
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {enviando && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Enviando cobranças...</span>
                <span>{progresso}%</span>
              </div>
              <Progress value={progresso} className="w-full" />
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              onClick={enviarCobrancasEmLote}
              disabled={enviando || simulando || cooperadosEmAtraso.length === 0 || !sistemaConfigurado}
              className="flex-1"
            >
              {enviando ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Todas as Cobranças ({cooperadosEmAtraso.length})
                </>
              )}
            </Button>
          </div>

          {resultadoEnvio && (
            <Alert className={resultadoEnvio.falhas > 0 ? "border-orange-200 bg-orange-50" : "border-green-200 bg-green-50"}>
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>
                <strong>Resumo do Envio:</strong><br />
                ✅ {resultadoEnvio.enviados} emails enviados com sucesso<br />
                {resultadoEnvio.falhas > 0 && (
                  <>
                    ❌ {resultadoEnvio.falhas} emails falharam<br />
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm">Ver detalhes dos erros</summary>
                      <div className="mt-2 text-xs space-y-1">
                        {resultadoEnvio.resultados
                          .filter(r => !r.sucesso)
                          .map((r, i) => (
                            <div key={i} className="text-red-600">
                              {r.cooperado}: {r.erro}
                            </div>
                          ))}
                      </div>
                    </details>
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Lista de cooperados em atraso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Cooperados em Atraso
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cooperadosEmAtraso.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p>Nenhum cooperado em atraso encontrado!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cooperadosEmAtraso.map((cooperadoData, index) => {
                const tipoCobranca = getTipoCobranca(cooperadoData.diasEmAtraso);
                const { cooperado, pagamento, diasEmAtraso, dataVencimento } = cooperadoData;
                
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      tipoCobranca.tipo === 'grave'
                        ? 'bg-red-50 border-red-500'
                        : tipoCobranca.tipo === 'medio'
                        ? 'bg-orange-50 border-orange-500'
                        : 'bg-yellow-50 border-yellow-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={tipoCobranca.cor}>
                            {tipoCobranca.label}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {diasEmAtraso} dias em atraso
                          </span>
                        </div>
                        
                        <h4 className="font-semibold text-gray-900">
                          {cooperado.nome_completo}
                        </h4>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Número:</strong> {cooperado.numero_associado}</p>
                          <p><strong>Email:</strong> {cooperado.email}</p>
                          <p><strong>Valor:</strong> {pagamento.valor?.toLocaleString()} Kz</p>
                          <p><strong>Vencimento:</strong> {format(dataVencimento, 'dd/MM/yyyy')}</p>
                          <p><strong>Mês:</strong> {pagamento.mes_referencia}</p>
                        </div>
                        
                        {pagamento.ultima_cobranca && (
                          <p className="text-xs text-gray-500 mt-2">
                            Última cobrança: {format(new Date(pagamento.ultima_cobranca), 'dd/MM/yyyy HH:mm')}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => enviarCobrancaIndividual(cooperadoData)}
                          disabled={enviando || simulando || !sistemaConfigurado}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Enviar Cobrança
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 