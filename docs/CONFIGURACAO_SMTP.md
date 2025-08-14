# Configuração SMTP - Sistema de Cobranças

## 📧 Visão Geral

O sistema de cobranças utiliza a integração `SendEmail` do base44 para enviar emails. O sistema agora oferece **configuração automática** que detecta e configura automaticamente o SMTP, eliminando a necessidade de configuração manual na maioria dos casos.

## ⚡ Configuração Automática (Recomendado)

### **Como Funciona:**
1. **Detecção Automática**: O sistema detecta automaticamente se a integração `SendEmail` está disponível
2. **Configuração Instantânea**: Clica em "Configurar Automaticamente" para ativar
3. **Teste Automático**: O sistema testa a configuração enviando um email de verificação
4. **Pronto para Uso**: Se bem-sucedido, o sistema está pronto para enviar cobranças

### **Vantagens:**
- ✅ **Zero Configuração**: Não precisa configurar servidor, porta, email ou senha
- ✅ **Segurança**: Usa as configurações seguras do base44
- ✅ **Confiabilidade**: Configuração gerenciada pelo sistema
- ✅ **Simplicidade**: Um clique para ativar

### **Como Ativar:**
1. Acesse a página `/Cobrancas`
2. Na seção "Configuração SMTP", clique em **"Configurar Automaticamente"**
3. Aguarde o teste de configuração
4. Se bem-sucedido, o sistema está pronto para uso

## 🔧 Configuração Manual (Alternativa)

Se a configuração automática não estiver disponível ou falhar, você pode configurar manualmente:

### 1. **Gmail (Recomendado)**

#### Passos para Configurar Gmail:

1. **Ativar Verificação em Duas Etapas**
   - Acesse sua conta Google
   - Vá em "Segurança" → "Verificação em duas etapas"
   - Ative a verificação em duas etapas

2. **Gerar Senha de App**
   - Ainda em "Segurança"
   - Clique em "Senhas de app"
   - Selecione "Email" como aplicativo
   - Copie a senha gerada (16 caracteres)

3. **Configuração no Sistema**
   - **Servidor:** `smtp.gmail.com`
   - **Porta:** `587`
   - **Email:** Seu email Gmail
   - **Senha:** A senha de app gerada (não sua senha normal)
   - **Nome do Remetente:** `CoopHabitat`

### 2. **Outlook/Hotmail**

#### Configuração:
- **Servidor:** `smtp-mail.outlook.com`
- **Porta:** `587`
- **Email:** Seu email Outlook
- **Senha:** Sua senha normal
- **Nome do Remetente:** `CoopHabitat`

### 3. **Outros Provedores**

#### Yahoo:
- **Servidor:** `smtp.mail.yahoo.com`
- **Porta:** `587` ou `465`

#### Provedores Corporativos:
- Consulte o administrador de TI para obter as configurações SMTP

## 🧪 Testando a Configuração

### 1. **Teste de Configuração Automática**
- Clique em "Configurar Automaticamente"
- Verifique se recebe o email de teste
- Confirme que o status mostra "✅ Sistema Configurado"

### 2. **Teste de Conexão SMTP (Manual)**
- Preencha os campos de configuração manual
- Clique em "Testar Conexão SMTP"
- Verifique se recebe o email de teste

### 3. **Teste de Email de Cobrança**
- Clique em "Testar Email de Cobrança"
- Verifique se recebe o email com template de cobrança

### 4. **Teste de Simulação**
- Use os botões de simulação na seção "Simulação de Cobranças"
- Teste cada tipo de cobrança individualmente

## 📊 Status do Sistema

### **Indicadores Visuais:**
- 🟢 **Verde**: Sistema configurado e pronto
- 🔴 **Vermelho**: Sistema não configurado
- 🟡 **Amarelo**: Configuração em progresso

### **Badges de Status:**
- `Configurado`: Sistema pronto para envio
- `Não Configurado`: Configuração necessária
- `Configurando...`: Processo em andamento

## ⚠️ Problemas Comuns

### **Erro: "Sistema de email não configurado"**
- Clique em "Configurar Automaticamente"
- Se falhar, configure manualmente
- Verifique se a integração `SendEmail` está disponível

### **Erro: "Falha na autenticação" (Manual)**
- Verifique se a verificação em duas etapas está ativada (Gmail)
- Use a senha de app, não a senha normal
- Verifique se o email e senha estão corretos

### **Erro: "Conexão recusada" (Manual)**
- Verifique se o servidor e porta estão corretos
- Verifique se o firewall não está bloqueando
- Tente usar porta 465 com SSL

### **Erro: "Limite de envio excedido"**
- Gmail: 500 emails/dia para contas normais
- Outlook: 300 emails/dia
- Aguarde 24 horas ou use conta corporativa

## 🔒 Segurança

### **Configuração Automática:**
- ✅ Configuração gerenciada pelo base44
- ✅ Credenciais seguras
- ✅ Sem exposição de senhas
- ✅ Atualizações automáticas

### **Configuração Manual:**
- ✅ Use sempre TLS/SSL (porta 587 ou 465)
- ✅ Nunca compartilhe senhas de app
- ✅ Use contas dedicadas para envio
- ✅ Monitore logs de envio

## 📊 Monitoramento

### **Logs de Envio:**
- Todos os envios são registrados na tabela `EmailLog`
- Verifique status: "enviado", "falha", "pendente"
- Monitore tentativas de reenvio

### **Relatórios:**
- Use a funcionalidade de exportação CSV
- Monitore taxa de entrega
- Verifique emails rejeitados

## 🚀 Configuração Avançada

### **Variáveis de Ambiente (Opcional):**
```bash
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
SMTP_FROM=CoopHabitat
```

### **Configuração de Templates:**
- Templates são carregados de `src/templates/emailTemplates.js`
- Pode ser personalizado por cooperativa
- Suporte a HTML responsivo

## ✅ Checklist de Configuração

### **Configuração Automática:**
- [ ] Acessar página de Cobranças
- [ ] Clicar em "Configurar Automaticamente"
- [ ] Verificar email de teste
- [ ] Confirmar status "✅ Sistema Configurado"
- [ ] Testar simulação de cobrança

### **Configuração Manual (se necessário):**
- [ ] Verificação em duas etapas ativada (Gmail)
- [ ] Senha de app gerada
- [ ] Configuração SMTP preenchida
- [ ] Teste de conexão realizado
- [ ] Teste de email de cobrança realizado
- [ ] Simulação de cobranças testada
- [ ] Logs de envio verificados

## 📞 Suporte

### **Em caso de problemas:**
1. **Primeiro**: Tente a configuração automática
2. **Segundo**: Configure manualmente se necessário
3. **Terceiro**: Verifique os logs no console do navegador
4. **Quarto**: Consulte a documentação do provedor de email

### **Logs Úteis:**
```javascript
[EmailService] Processando evento: cobranca_atraso
[EmailService] Enviando email real para: email@exemplo.com
[EmailService] Email enviado com sucesso para: email@exemplo.com
[ConfiguracaoSMTP] Configuração automática ativada com sucesso!
```

### **Status da Integração:**
```javascript
[ConfiguracaoSMTP] Integração SendEmail disponível: true
[CobrancaService] Sistema configurado: true
```

---

## 🎯 **Resumo: Configuração Automática vs Manual**

| Aspecto | Configuração Automática | Configuração Manual |
|---------|------------------------|-------------------|
| **Facilidade** | ⭐⭐⭐⭐⭐ Um clique | ⭐⭐⭐ Múltiplos passos |
| **Segurança** | ⭐⭐⭐⭐⭐ Gerenciada pelo sistema | ⭐⭐⭐⭐ Configuração manual |
| **Confiabilidade** | ⭐⭐⭐⭐⭐ Alta | ⭐⭐⭐ Média |
| **Manutenção** | ⭐⭐⭐⭐⭐ Automática | ⭐⭐ Manual |
| **Recomendação** | ✅ **PREFERIDA** | ⚠️ Alternativa |

**Nota:** A configuração automática é a opção recomendada e deve ser usada sempre que possível. A configuração manual é uma alternativa quando a automática não está disponível. 