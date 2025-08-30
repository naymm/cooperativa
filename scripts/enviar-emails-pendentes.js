#!/usr/bin/env node

import { EmailQueue, EmailLog } from '../src/api/entities-hybrid.js';
import EmailServiceDirect from '../src/services/EmailServiceDirect.js';

console.log('📧 Enviando e-mails pendentes...');

async function enviarEmailsPendentes() {
  try {
    // Configurar SMTP
    console.log('1. Configurando SMTP...');
    emailServiceDirect.configurarSMTP({
      servidor: "mail.hoteldompedro.co.ao",
      porta: "465",
      email: "cooperativa@hoteldompedro.co.ao",
      senha: "Cooperativa2024",
      nome_remetente: "Cooperativa Sanep"
    });

    // Testar conexão
    console.log('2. Testando conexão SMTP...');
    await emailServiceDirect.testarConexao();
    console.log('✅ Conexão SMTP OK');

    // Buscar e-mails pendentes
    console.log('3. Buscando e-mails pendentes...');
    const emailsPendentes = await EmailQueue.list();
    const pendentes = emailsPendentes.filter(email => email.status === 'pendente');
    
    console.log(`📋 Encontrados ${pendentes.length} e-mails pendentes`);

    if (pendentes.length === 0) {
      console.log('✅ Nenhum e-mail pendente encontrado');
      return;
    }

    // Enviar cada e-mail pendente
    for (const email of pendentes) {
      try {
        console.log(`\n📤 Enviando e-mail para: ${email.destinatario_email}`);
        console.log(`📧 Assunto: ${email.assunto}`);
        
        const resultado = await emailServiceDirect.enviarEmail(
          email.destinatario_email,
          email.assunto,
          email.corpo_html
        );

        if (resultado && resultado.sucesso) {
          // Atualizar status para enviado
          await EmailQueue.update(email.id, {
            status: "enviado",
            data_envio: new Date().toISOString(),
            tentativas: (email.tentativas || 0) + 1
          });

          // Log do envio
          await EmailLog.create({
            destinatario: email.destinatario_email,
            assunto: email.assunto,
            tipo: email.evento,
            status: "enviado",
            dados: {
              messageId: resultado.messageId,
              metodo: "EmailServiceDirect"
            },
            created_at: new Date().toISOString()
          });

          console.log(`✅ E-mail enviado com sucesso para: ${email.destinatario_email}`);
        } else {
          throw new Error("Falha no envio");
        }

      } catch (error) {
        console.error(`❌ Erro ao enviar e-mail para ${email.destinatario_email}:`, error.message);
        
        // Atualizar tentativas
        await EmailQueue.update(email.id, {
          tentativas: (email.tentativas || 0) + 1,
          status: "erro"
        });

        // Log do erro
        await EmailLog.create({
          destinatario: email.destinatario_email,
          assunto: email.assunto,
          tipo: email.evento,
          status: "erro",
          dados: { 
            erro: error.message,
            metodo: "EmailServiceDirect"
          },
          created_at: new Date().toISOString()
        });
      }
    }

    console.log('\n✅ Processo de envio concluído!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar o script
enviarEmailsPendentes();
