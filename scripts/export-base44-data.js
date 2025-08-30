import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

async function exportBase44Data() {
  console.log('🔍 Exportando dados do Base44 via aplicação web...\n')
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null 
  })
  
  try {
    const page = await browser.newPage()
    
    // Acessar a aplicação
    await page.goto('http://localhost:5173')
    console.log('✅ Aplicação carregada')
    
    // Aguardar carregamento
    await page.waitForTimeout(3000)
    
    // Navegar para diferentes páginas para coletar dados
    const data = {}
    
    // 1. Cooperados
    console.log('📋 Coletando dados de Cooperados...')
    await page.goto('http://localhost:5173/cooperados')
    await page.waitForTimeout(2000)
    
    // Tentar extrair dados da página
    const cooperadosData = await page.evaluate(() => {
      // Tentar encontrar dados na página
      const elements = document.querySelectorAll('[data-testid*="cooperado"], .cooperado-item, [class*="cooperado"]')
      return Array.from(elements).map(el => {
        return {
          text: el.textContent,
          html: el.innerHTML
        }
      })
    })
    
    data.cooperados = cooperadosData
    console.log(`   Encontrados ${cooperadosData.length} elementos de cooperados`)
    
    // 2. Pagamentos
    console.log('📋 Coletando dados de Pagamentos...')
    await page.goto('http://localhost:5173/pagamentos')
    await page.waitForTimeout(2000)
    
    const pagamentosData = await page.evaluate(() => {
      const elements = document.querySelectorAll('[data-testid*="pagamento"], .pagamento-item, [class*="pagamento"]')
      return Array.from(elements).map(el => {
        return {
          text: el.textContent,
          html: el.innerHTML
        }
      })
    })
    
    data.pagamentos = pagamentosData
    console.log(`   Encontrados ${pagamentosData.length} elementos de pagamentos`)
    
    // 3. Projetos
    console.log('📋 Coletando dados de Projetos...')
    await page.goto('http://localhost:5173/projetos')
    await page.waitForTimeout(2000)
    
    const projetosData = await page.evaluate(() => {
      const elements = document.querySelectorAll('[data-testid*="projeto"], .projeto-item, [class*="projeto"]')
      return Array.from(elements).map(el => {
        return {
          text: el.textContent,
          html: el.innerHTML
        }
      })
    })
    
    data.projetos = projetosData
    console.log(`   Encontrados ${projetosData.length} elementos de projetos`)
    
    // Salvar dados coletados
    const exportPath = path.join(process.cwd(), 'base44-export.json')
    fs.writeFileSync(exportPath, JSON.stringify(data, null, 2))
    
    console.log(`\n✅ Dados exportados para: ${exportPath}`)
    console.log('📊 Resumo dos dados coletados:')
    Object.entries(data).forEach(([key, value]) => {
      console.log(`   ${key}: ${value.length} elementos`)
    })
    
  } catch (error) {
    console.error('❌ Erro durante exportação:', error.message)
  } finally {
    await browser.close()
  }
}

exportBase44Data()
