import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Database, 
  Settings, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Copy,
  ExternalLink
} from 'lucide-react'
import { getBackendInfo, migrateEntityData } from '@/api/entities-hybrid'

export default function MigrationConfig() {
  const [backendInfo, setBackendInfo] = useState(null)
  const [useSupabase, setUseSupabase] = useState(false)
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseKey, setSupabaseKey] = useState('')
  const [migrating, setMigrating] = useState(false)
  const [migrationStatus, setMigrationStatus] = useState({})
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const info = getBackendInfo()
    setBackendInfo(info)
    setUseSupabase(info.useSupabase)
    
    // Carregar configurações salvas
    const savedUrl = localStorage.getItem('supabase_url') || ''
    const savedKey = localStorage.getItem('supabase_key') || ''
    setSupabaseUrl(savedUrl)
    setSupabaseKey(savedKey)
  }, [])

  const handleBackendToggle = () => {
    const newUseSupabase = !useSupabase
    setUseSupabase(newUseSupabase)
    
    // Atualizar variável de ambiente (simulado)
    if (newUseSupabase) {
      localStorage.setItem('VITE_USE_SUPABASE', 'true')
    } else {
      localStorage.setItem('VITE_USE_SUPABASE', 'false')
    }
    
    // Recarregar página para aplicar mudanças
    window.location.reload()
  }

  const saveConfig = () => {
    localStorage.setItem('supabase_url', supabaseUrl)
    localStorage.setItem('supabase_key', supabaseKey)
    
    // Criar arquivo .env temporário
    const envContent = `VITE_SUPABASE_URL=${supabaseUrl}\nVITE_SUPABASE_ANON_KEY=${supabaseKey}\nVITE_USE_SUPABASE=${useSupabase}`
    
    const blob = new Blob([envContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '.env'
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyEnvContent = () => {
    const envContent = `VITE_SUPABASE_URL=${supabaseUrl}\nVITE_SUPABASE_ANON_KEY=${supabaseKey}\nVITE_USE_SUPABASE=${useSupabase}`
    navigator.clipboard.writeText(envContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const migrateAllData = async () => {
    setMigrating(true)
    setMigrationStatus({})
    
    const entities = [
      'Cooperado',
      'AssinaturaPlano', 
      'Projeto',
      'Pagamento',
      'CooperadoAuth',
      'CooperadoNotificacao',
      'CooperadoSupporte',
      'Inscricao',
      'InscricaoPublica',
      'EmailLog',
      'EmailTemplate',
      'EmailQueue',
      'CrmUser',
      'CrmNotificacao'
    ]
    
    for (const entity of entities) {
      try {
        setMigrationStatus(prev => ({ ...prev, [entity]: 'migrating' }))
        await migrateEntityData(entity, 'base44', 'supabase')
        setMigrationStatus(prev => ({ ...prev, [entity]: 'success' }))
      } catch (error) {
        setMigrationStatus(prev => ({ ...prev, [entity]: 'error' }))
        console.error(`Erro na migração de ${entity}:`, error)
      }
    }
    
    setMigrating(false)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'migrating':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return null
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'success':
        return 'Migrado'
      case 'error':
        return 'Erro'
      case 'migrating':
        return 'Migrando...'
      default:
        return 'Pendente'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuração de Migração</h1>
          <p className="text-muted-foreground">
            Migre do Base44 para o Supabase de forma segura
          </p>
        </div>
        <Badge variant={backendInfo?.useSupabase ? "default" : "secondary"}>
          <Database className="h-4 w-4 mr-2" />
          {backendInfo?.backend}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuração do Backend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuração do Backend
            </CardTitle>
            <CardDescription>
              Escolha qual backend usar e configure as credenciais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="backend-toggle">Usar Supabase</Label>
                <p className="text-sm text-muted-foreground">
                  Ative para usar o Supabase em vez do Base44
                </p>
              </div>
              <Switch
                id="backend-toggle"
                checked={useSupabase}
                onCheckedChange={handleBackendToggle}
              />
            </div>

            {useSupabase && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="supabase-url">URL do Supabase</Label>
                    <Input
                      id="supabase-url"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      placeholder="https://your-project.supabase.co"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="supabase-key">Chave Anônima</Label>
                    <Input
                      id="supabase-key"
                      type="password"
                      value={supabaseKey}
                      onChange={(e) => setSupabaseKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={saveConfig} className="flex-1">
                      Salvar Configuração
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={copyEnvContent}
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      {copied ? 'Copiado!' : 'Copiar .env'}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Status da Migração */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Status da Migração
            </CardTitle>
            <CardDescription>
              Monitore o progresso da migração dos dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!useSupabase ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Ative o Supabase para iniciar a migração
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <Button 
                  onClick={migrateAllData} 
                  disabled={migrating || !supabaseUrl || !supabaseKey}
                  className="w-full"
                >
                  {migrating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Migrando Dados...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Iniciar Migração Completa
                    </>
                  )}
                </Button>

                <div className="space-y-2">
                  {[
                    'Cooperado',
                    'AssinaturaPlano',
                    'Projeto', 
                    'Pagamento',
                    'CooperadoAuth',
                    'CooperadoNotificacao',
                    'CooperadoSupporte',
                    'Inscricao',
                    'InscricaoPublica',
                    'EmailLog',
                    'EmailTemplate',
                    'EmailQueue',
                    'CrmUser',
                    'CrmNotificacao'
                  ].map((entity) => (
                    <div key={entity} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm font-medium">{entity}</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(migrationStatus[entity])}
                        <span className="text-xs">
                          {getStatusText(migrationStatus[entity])}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instruções */}
      <Card>
        <CardHeader>
          <CardTitle>Instruções de Migração</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">1. Configurar Supabase</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Crie um projeto no <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Supabase</a></li>
              <li>Execute o script SQL em <code className="bg-muted px-1 rounded">supabase-migration.sql</code></li>
              <li>Copie a URL e chave anônima do projeto</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">2. Configurar Variáveis de Ambiente</h4>
            <p className="text-sm text-muted-foreground">
              Crie um arquivo <code className="bg-muted px-1 rounded">.env</code> na raiz do projeto com as variáveis do Supabase
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">3. Migrar Dados</h4>
            <p className="text-sm text-muted-foreground">
              Use o botão "Iniciar Migração Completa" para transferir todos os dados do Base44 para o Supabase
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">4. Testar e Validar</h4>
            <p className="text-sm text-muted-foreground">
              Verifique se todos os dados foram migrados corretamente antes de desativar o Base44
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
