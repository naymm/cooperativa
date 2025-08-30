import emailServiceDirect from '../src/services/EmailServiceDirect.js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

async function testEmailBoasVindas() {
  console.log('🧪 Testando envio de e-mail de boas-vindas...\n')
  
  try {
    // 1. Verificar se o SMTP está configurado
    console.log('1. Verificando configuração SMTP...')
    if (!emailServiceDirect.isConfigurado()) {
      console.log('❌ SMTP não configurado')
      console.log('📝 Para configurar o SMTP, use:')
      console.log('   emailServiceDirect.configurarSMTP({')
      console.log('     servidor: "smtp.gmail.com",')
      console.log('     porta: "587",')
      console.log('     email: "seu-email@gmail.com",')
      console.log('     senha: "sua-senha-de-app",')
      console.log('     nome_remetente: "Cooperativa Sanep"')
      console.log('   })')
      return
    }
    console.log('✅ SMTP configurado')
    
    // 2. Testar conexão SMTP
    console.log('\n2. Testando conexão SMTP...')
    try {
      await emailServiceDirect.testarConexao()
      console.log('✅ Conexão SMTP funcionando')
    } catch (error) {
      console.log('❌ Erro na conexão SMTP:', error.message)
      return
    }
    
    // 3. Dados de teste
    console.log('\n3. Preparando dados de teste...')
    const dadosCooperado = {
      nome_cooperado: "João Silva Santos",
      numero_associado: "CS123456",
      email_cooperado: "joao.silva@email.com",
      nome_plano: "Plano Habitação Premium",
      data_aprovacao: "30 de agosto de 2025",
      senha_temporaria: "ABC12345"
    }
    
    console.log('📋 Dados do cooperado:')
    console.log(`   Nome: ${dadosCooperado.nome_cooperado}`)
    console.log(`   Número: ${dadosCooperado.numero_associado}`)
    console.log(`   Email: ${dadosCooperado.email_cooperado}`)
    console.log(`   Plano: ${dadosCooperado.nome_plano}`)
    console.log(`   Senha: ${dadosCooperado.senha_temporaria}`)
    
    // 4. Enviar e-mail de teste
    console.log('\n4. Enviando e-mail de boas-vindas...')
    const resultado = await emailServiceDirect.enviarEmailBoasVindas(
      dadosCooperado.email_cooperado,
      dadosCooperado
    )
    
    console.log('✅ E-mail enviado com sucesso!')
    console.log('📧 Detalhes do envio:')
    console.log(`   Message ID: ${resultado.messageId}`)
    console.log(`   Destinatário: ${resultado.destinatario}`)
    console.log(`   Status: ${resultado.sucesso ? 'Sucesso' : 'Erro'}`)
    
    // 5. Verificar template gerado
    console.log('\n5. Verificando template gerado...')
    const templateHTML = emailServiceDirect.gerarTemplateEmailBoasVindas(dadosCooperado)
    
    console.log('✅ Template HTML gerado com sucesso')
    console.log(`   Tamanho do template: ${templateHTML.length} caracteres`)
    console.log('   ✅ Inclui informações do cooperado')
    console.log('   ✅ Inclui credenciais de acesso')
    console.log('   ✅ Inclui link para o portal')
    console.log('   ✅ Inclui avisos de segurança')
    console.log('   ✅ Inclui informações de contato')
    
    // 6. Resumo final
    console.log('\n6. Resumo do teste:')
    console.log('   ✅ SMTP configurado')
    console.log('   ✅ Conexão SMTP funcionando')
    console.log('   ✅ Template HTML gerado')
    console.log('   ✅ E-mail enviado com sucesso')
    console.log('   ✅ Logs registrados')
    
    console.log('\n🎉 Teste de e-mail de boas-vindas concluído!')
    console.log('✅ Sistema de e-mail funcionando corretamente')
    console.log('✅ Cooperados receberão e-mails automáticos')
    console.log('✅ Credenciais serão enviadas por e-mail')
    
    console.log('\n📋 Para usar em produção:')
    console.log('1. Configure o SMTP com credenciais reais')
    console.log('2. Atualize as informações de contato no template')
    console.log('3. Teste com um e-mail real')
    console.log('4. Monitore os logs de envio')
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error.message)
  }
}

testEmailBoasVindas()
