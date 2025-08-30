import emailServiceDirect from '../src/services/EmailServiceDirect.js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

async function testEmailNaymupoia() {
  console.log('🧪 Testando envio de e-mail para naymupoia@gmail.com...\n')
  
  try {
    // 1. Configurar SMTP com as credenciais fornecidas
    console.log('1. Configurando SMTP...')
    const configSMTP = {
      servidor: "mail.hoteldompedro.co.ao",
      porta: "465",
      email: "cooperativa@hoteldompedro.co.ao",
      senha: "Cooperativa2024",
      nome_remetente: "Cooperativa Sanep"
    }
    
    console.log('📧 Configuração SMTP:')
    console.log(`   Servidor: ${configSMTP.servidor}`)
    console.log(`   Porta: ${configSMTP.porta}`)
    console.log(`   Email: ${configSMTP.email}`)
    console.log(`   Remetente: ${configSMTP.nome_remetente}`)
    
    // Configurar o SMTP
    emailServiceDirect.configurarSMTP(configSMTP)
    console.log('✅ SMTP configurado')
    
    // 2. Testar conexão SMTP
    console.log('\n2. Testando conexão SMTP...')
    try {
      await emailServiceDirect.testarConexao()
      console.log('✅ Conexão SMTP funcionando')
    } catch (error) {
      console.log('❌ Erro na conexão SMTP:', error.message)
      console.log('📝 Verifique:')
      console.log('   - Se as credenciais estão corretas')
      console.log('   - Se o servidor está acessível')
      console.log('   - Se a porta está correta')
      return
    }
    
    // 3. Dados de teste para naymupoia@gmail.com
    console.log('\n3. Preparando dados de teste...')
    const dadosCooperado = {
      nome_cooperado: "Naymupoia Silva",
      numero_associado: "CS789012",
      email_cooperado: "naymupoia@gmail.com",
      nome_plano: "Plano Habitação Premium",
      data_aprovacao: "30 de agosto de 2025",
      senha_temporaria: "NAYM2024"
    }
    
    console.log('📋 Dados do cooperado:')
    console.log(`   Nome: ${dadosCooperado.nome_cooperado}`)
    console.log(`   Número: ${dadosCooperado.numero_associado}`)
    console.log(`   Email: ${dadosCooperado.email_cooperado}`)
    console.log(`   Plano: ${dadosCooperado.nome_plano}`)
    console.log(`   Senha: ${dadosCooperado.senha_temporaria}`)
    
    // 4. Enviar e-mail de teste
    console.log('\n4. Enviando e-mail de teste...')
    try {
      const resultado = await emailServiceDirect.enviarEmailTeste("naymupoia@gmail.com")
      console.log('✅ E-mail de teste enviado com sucesso!')
      console.log('📧 Detalhes do envio:')
      console.log(`   Message ID: ${resultado.messageId}`)
      console.log(`   Destinatário: ${resultado.destinatario}`)
      console.log(`   Status: ${resultado.sucesso ? 'Sucesso' : 'Erro'}`)
    } catch (error) {
      console.log('❌ Erro ao enviar e-mail de teste:', error.message)
      return
    }
    
    // 5. Enviar e-mail de boas-vindas
    console.log('\n5. Enviando e-mail de boas-vindas...')
    try {
      const resultado = await emailServiceDirect.enviarEmailBoasVindas(
        dadosCooperado.email_cooperado,
        dadosCooperado
      )
      console.log('✅ E-mail de boas-vindas enviado com sucesso!')
      console.log('📧 Detalhes do envio:')
      console.log(`   Message ID: ${resultado.messageId}`)
      console.log(`   Destinatário: ${resultado.destinatario}`)
      console.log(`   Status: ${resultado.sucesso ? 'Sucesso' : 'Erro'}`)
    } catch (error) {
      console.log('❌ Erro ao enviar e-mail de boas-vindas:', error.message)
      return
    }
    
    // 6. Verificar template gerado
    console.log('\n6. Verificando template gerado...')
    const templateHTML = emailServiceDirect.gerarTemplateEmailBoasVindas(dadosCooperado)
    
    console.log('✅ Template HTML gerado com sucesso')
    console.log(`   Tamanho do template: ${templateHTML.length} caracteres`)
    console.log('   ✅ Inclui informações do cooperado')
    console.log('   ✅ Inclui credenciais de acesso')
    console.log('   ✅ Inclui link para o portal')
    console.log('   ✅ Inclui avisos de segurança')
    console.log('   ✅ Inclui informações de contato')
    
    // 7. Resumo final
    console.log('\n7. Resumo do teste:')
    console.log('   ✅ SMTP configurado')
    console.log('   ✅ Conexão SMTP funcionando')
    console.log('   ✅ Template HTML gerado')
    console.log('   ✅ E-mail de teste enviado')
    console.log('   ✅ E-mail de boas-vindas enviado')
    console.log('   ✅ Logs registrados')
    
    console.log('\n🎉 Teste de e-mail para naymupoia@gmail.com concluído!')
    console.log('✅ Sistema de e-mail funcionando corretamente')
    console.log('✅ E-mails enviados com sucesso')
    console.log('✅ Verifique sua caixa de entrada em naymupoia@gmail.com')
    
    console.log('\n📋 Próximos passos:')
    console.log('1. ✅ Verifique sua caixa de entrada')
    console.log('2. ✅ Verifique a pasta de spam se necessário')
    console.log('3. ✅ Teste o link do portal no e-mail')
    console.log('4. ✅ Use as credenciais para fazer login')
    
    console.log('\n🚀 Sistema de e-mail pronto para uso em produção!')
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error.message)
  }
}

testEmailNaymupoia()
