import React, { useState, useEffect } from "react";
import { Cooperado, EmailQueue, EmailTemplate, User } from "@/api/entities";
import EmailService from "../components/comunicacao/EmailService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, History, Send, Settings, Copy, Eye } from "lucide-react";
import { format } from "date-fns";

export default function Comunicacao() {
  const [cooperados, setCooperados] = useState([]);
  const [emailQueue, setEmailQueue] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const [currentUser, setCurrentUser] = useState(null);
  const [destinatarios, setDestinatarios] = useState([]);
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [remetente, setRemetente] = useState("CoopHabitat");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cooperadosData, queueData, templatesData, userData] = await Promise.all([
        Cooperado.list(),
        EmailQueue.list("-created_date"),
        EmailTemplate.list(),
        User.me().catch(() => null)
      ]);
      
      setCooperados(cooperadosData.filter(c => c.status === 'ativo'));
      setEmailQueue(queueData);
      setTemplates(templatesData);
      setCurrentUser(userData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Falha ao carregar dados da página.");
    } finally {
      setLoading(false);
    }
  };

  const enviarMensagemPersonalizada = async () => {
    if (!assunto.trim() || !mensagem.trim() || destinatarios.length === 0) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setSending(true);
    try {
      const promises = destinatarios.map(async (cooperadoId) => {
        const cooperado = cooperados.find(c => c.numero_associado === cooperadoId);
        if (!cooperado) return;

        return EmailService.enviarPorEvento("mensagem_admin", {
          email: cooperado.email,
          nome_completo: cooperado.nome_completo
        }, {
          nome_cooperado: cooperado.nome_completo,
          titulo_mensagem: assunto,
          conteudo_mensagem: mensagem.replace(/\n/g, '<br>'),
          assunto_personalizado: assunto,
          remetente_nome: currentUser?.full_name || remetente
        });
      });

      await Promise.all(promises);
      toast.success(`Mensagem enviada para ${destinatarios.length} cooperado(s)!`);
      
      // Limpar formulário
      setDestinatarios([]);
      setAssunto("");
      setMensagem("");
      
      loadData(); // Recarregar dados para mostrar os novos e-mails na fila
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem.");
    } finally {
      setSending(false);
    }
  };

  const processarFilaEmails = async () => {
    setSending(true);
    try {
      await EmailService.processarFila();
      toast.success("Fila de e-mails processada!");
      loadData();
    } catch (error) {
      console.error("Erro ao processar fila:", error);
      toast.error("Erro ao processar fila de e-mails.");
    } finally {
      setSending(false);
    }
  };

  const copiarEmail = (email) => {
    const texto = `Para: ${email.destinatario_email}
Assunto: ${email.assunto}

${email.corpo_texto || email.corpo_html.replace(/<[^>]*>/g, '')}`;
    
    navigator.clipboard.writeText(texto);
    toast.success("E-mail copiado para área de transferência!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Centro de Comunicação</h1>
        <Button onClick={processarFilaEmails} disabled={sending} className="bg-blue-600 hover:bg-blue-700">
          <Send className="w-4 h-4 mr-2" />
          {sending ? "Processando..." : "Processar Fila"}
        </Button>
      </div>

      <Tabs defaultValue="enviar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="enviar">
            <Mail className="w-4 h-4 mr-2" />
            Enviar Mensagem
          </TabsTrigger>
          <TabsTrigger value="fila">
            <Settings className="w-4 h-4 mr-2" />
            Fila de E-mails
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Eye className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enviar">
          <Card>
            <CardHeader>
              <CardTitle>Enviar Mensagem Personalizada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Destinatários</label>
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (value === "todos") {
                      setDestinatarios(cooperados.map(c => c.numero_associado));
                    } else if (!destinatarios.includes(value)) {
                      setDestinatarios([...destinatarios, value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar cooperados..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">📧 Todos os Cooperados Ativos</SelectItem>
                    {cooperados.map(cooperado => (
                      <SelectItem key={cooperado.numero_associado} value={cooperado.numero_associado}>
                        {cooperado.nome_completo} ({cooperado.numero_associado})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {destinatarios.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-slate-600">
                      {destinatarios.length} destinatário(s) selecionado(s):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {destinatarios.map(id => {
                        const cooperado = cooperados.find(c => c.numero_associado === id);
                        return (
                          <Badge key={id} variant="secondary" className="cursor-pointer" 
                                 onClick={() => setDestinatarios(destinatarios.filter(d => d !== id))}>
                            {cooperado?.nome_completo || id} ✕
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Assunto</label>
                <Input
                  placeholder="Assunto da mensagem..."
                  value={assunto}
                  onChange={(e) => setAssunto(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mensagem</label>
                <Textarea
                  placeholder="Digite sua mensagem aqui..."
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  rows={8}
                />
              </div>

              <Button 
                onClick={enviarMensagemPersonalizada} 
                disabled={sending || !assunto.trim() || !mensagem.trim() || destinatarios.length === 0}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Send className="w-4 h-4 mr-2" />
                {sending ? "Enviando..." : `Enviar para ${destinatarios.length} cooperado(s)`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fila">
          <Card>
            <CardHeader>
              <CardTitle>Fila de E-mails ({emailQueue.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Carregando fila de e-mails...</p>
              ) : emailQueue.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum e-mail na fila</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                  {emailQueue.map(email => (
                    <div key={email.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={
                              email.status === 'enviado' ? 'default' : 
                              email.status === 'pendente' ? 'secondary' :
                              email.status === 'falhou' ? 'destructive' : 'outline'
                            }>
                              {email.status}
                            </Badge>
                            <span className="text-sm text-slate-500">{email.evento}</span>
                          </div>
                          <p className="font-semibold">{email.assunto}</p>
                          <p className="text-sm text-slate-600">Para: {email.destinatario_email}</p>
                          <p className="text-xs text-slate-500">
                            {format(new Date(email.created_date), "dd/MM/yyyy 'às' HH:mm")}
                          </p>
                          {email.erro_mensagem && (
                            <p className="text-xs text-red-500 mt-1">Erro: {email.erro_mensagem}</p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copiarEmail(email)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Templates de E-mail ({templates.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Carregando templates...</p>
              ) : (
                <div className="grid gap-4">
                  {templates.map(template => (
                    <div key={template.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{template.nome}</h3>
                          <p className="text-sm text-slate-600">{template.assunto}</p>
                          <Badge variant="outline" className="mt-1">
                            {template.evento}
                          </Badge>
                        </div>
                        <Badge variant={template.ativo ? "default" : "secondary"}>
                          {template.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      {template.variaveis && template.variaveis.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-slate-500">Variáveis disponíveis:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {template.variaveis.map(variavel => (
                              <code key={variavel} className="text-xs bg-slate-100 px-1 rounded">
                                {variavel}
                              </code>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}