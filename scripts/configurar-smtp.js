import emailServiceDirect from '../src/services/EmailServiceDirect.js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

async function configurarSMTP() {
  console.log('🔧 Configurando SMTP para envio de e-mails...\n')
  
  try {
    // 1. Configuração SMTP (exemplo com Gmail)
    console.log('1. Configurando SMTP...')
    const configSMTP = {
      servidor: "mail.hoteldompedro.co.ao ",
      porta: "465",
      email: "cooperativa@hoteldompedro.co.ao", // Substitua pelo e-mail real
      senha: "Cooperativa2024", // Substitua pela senha de app real
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
    
    // 2. Testar conexão
    console.log('\n2. Testando conexão SMTP...')
    try {
      await emailServiceDirect.testarConexao()
      console.log('✅ Conexão SMTP funcionando')
    } catch (error) {
      console.log('❌ Erro na conexão SMTP:', error.message)
      console.log('📝 Verifique:')
      console.log('   - Se as credenciais estão corretas')
      console.log('   - Se a senha de app está habilitada (para Gmail)')
      console.log('   - Se o 2FA está configurado (para Gmail)')
      return
    }
    
    // 3. Enviar e-mail de teste
    console.log('\n3. Enviando e-mail de teste...')
    try {
      const resultado = await emailServiceDirect.enviarEmailTeste("teste@email.com")
      console.log('✅ E-mail de teste enviado com sucesso!')
      console.log(`   Message ID: ${resultado.messageId}`)
    } catch (error) {
      console.log('❌ Erro ao enviar e-mail de teste:', error.message)
      return
    }
    
    // 4. Testar e-mail de boas-vindas
    console.log('\n4. Testando e-mail de boas-vindas...')
    const dadosCooperado = {
      nome_cooperado: "João Silva Santos",
      numero_associado: "CS123456",
      email_cooperado: "joao.silva@email.com",
      nome_plano: "Plano Habitação Premium",
      data_aprovacao: "30 de agosto de 2025",
      senha_temporaria: "ABC12345"
    }
    
    try {
      const resultado = await emailServiceDirect.enviarEmailBoasVindas(
        dadosCooperado.email_cooperado,
        dadosCooperado
      )
      console.log('✅ E-mail de boas-vindas enviado com sucesso!')
      console.log(`   Message ID: ${resultado.messageId}`)
    } catch (error) {
      console.log('❌ Erro ao enviar e-mail de boas-vindas:', error.message)
      return
    }
    
    // 5. Resumo final
    console.log('\n🎉 Configuração SMTP concluída com sucesso!')
    console.log('✅ SMTP configurado e funcionando')
    console.log('✅ E-mails de teste enviados')
    console.log('✅ Sistema pronto para envio automático')
    
    console.log('\n📋 Próximos passos:')
    console.log('1. ✅ SMTP configurado')
    console.log('2. ✅ E-mails de teste funcionando')
    console.log('3. 🔄 Aprovar inscrições para enviar e-mails automáticos')
    console.log('4. 📊 Monitorar logs de envio')
    console.log('5. 📧 Verificar e-mails recebidos pelos cooperados')
    
    console.log('\n🚀 Sistema de e-mail pronto para uso!')
    
  } catch (error) {
    console.error('❌ Erro durante configuração:', error.message)
  }
}

configurarSMTP()
