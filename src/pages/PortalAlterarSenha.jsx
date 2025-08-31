import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CooperadoAuth } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Eye, EyeOff, AlertTriangle, Loader2, Shield, CheckCircle } from "lucide-react";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";

export default function PortalAlterarSenha() {
  const [formData, setFormData] = useState({
    senha_atual: "",
    nova_senha: "",
    confirmar_senha: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    senha_atual: false,
    nova_senha: false,
    confirmar_senha: false,
  });
  const [cooperadoData, setCooperadoData] = useState(null);
  const [debugInfo, setDebugInfo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔍 PortalAlterarSenha: Iniciando verificação de dados...");
    
    // Verificar se o cooperado está logado
    const cooperadoDataStr = localStorage.getItem('loggedInCooperadoData');
    const cooperadoId = localStorage.getItem('loggedInCooperadoId');
    
    console.log("📋 Dados encontrados no localStorage:");
    console.log("- cooperadoDataStr:", cooperadoDataStr);
    console.log("- cooperadoId:", cooperadoId);
    
    if (!cooperadoDataStr || !cooperadoId) {
      console.log("❌ Dados não encontrados, redirecionando para login");
      navigate(createPageUrl("PortalLogin"));
      return;
    }

    try {
      const data = JSON.parse(cooperadoDataStr);
      console.log("✅ Dados do cooperado carregados:", data);
      setCooperadoData(data);
      setDebugInfo(`Cooperado: ${data.nome_completo} (ID: ${data.id})`);

      // Se não for primeiro login, redirecionar para dashboard
      if (!data.isFirstLogin) {
        console.log("ℹ️ Não é primeiro login, redirecionando para dashboard");
        navigate(createPageUrl("PortalDashboard"));
      } else {
        console.log("✅ É primeiro login, mantendo na página de alteração");
      }
    } catch (err) {
      console.error("❌ Erro ao parsear dados do cooperado:", err);
      setError("Erro ao carregar dados do cooperado");
      navigate(createPageUrl("PortalLogin"));
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) {
      errors.push(`Mínimo de ${minLength} caracteres`);
    }
    if (!hasUpperCase) {
      errors.push("Pelo menos uma letra maiúscula");
    }
    if (!hasLowerCase) {
      errors.push("Pelo menos uma letra minúscula");
    }
    if (!hasNumbers) {
      errors.push("Pelo menos um número");
    }
    if (!hasSpecialChar) {
      errors.push("Pelo menos um caractere especial");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("🔐 Iniciando alteração de senha...");
    console.log("📋 Dados do formulário:", formData);
    console.log("👤 Dados do cooperado:", cooperadoData);

    // Validações
    if (!formData.senha_atual || !formData.nova_senha || !formData.confirmar_senha) {
      setError("Todos os campos são obrigatórios.");
      setLoading(false);
      return;
    }

    if (formData.nova_senha !== formData.confirmar_senha) {
      setError("A nova senha e a confirmação não coincidem.");
      setLoading(false);
      return;
    }

    if (formData.senha_atual === formData.nova_senha) {
      setError("A nova senha deve ser diferente da senha atual.");
      setLoading(false);
      return;
    }

    // Validar força da senha
    const passwordErrors = validatePassword(formData.nova_senha);
    if (passwordErrors.length > 0) {
      setError(`A nova senha deve conter: ${passwordErrors.join(", ")}`);
      setLoading(false);
      return;
    }

    try {
      console.log("🔍 Verificando credenciais no banco...");
      
      // Verificar se a senha atual está correta
      const authRecords = await CooperadoAuth.filter({
        cooperado_id: cooperadoData.id,
      });

      console.log("📋 Registros de autenticação encontrados:", authRecords);

      if (!authRecords || authRecords.length === 0) {
        setError("Credenciais não encontradas.");
        setLoading(false);
        return;
      }

      const authRecord = authRecords[0];
      console.log("🔑 Registro de autenticação:", authRecord);

      if (formData.senha_atual !== authRecord.senha_hash) {
        console.log("❌ Senha atual incorreta");
        console.log("- Senha fornecida:", formData.senha_atual);
        console.log("- Senha no banco:", authRecord.senha_hash);
        setError("Senha atual incorreta.");
        setLoading(false);
        return;
      }

      console.log("✅ Senha atual correta, atualizando...");

      // Atualizar a senha
      const updateData = {
        senha_hash: formData.nova_senha,
        senha_alterada: true,
        data_alteracao_senha: new Date().toISOString(),
      };

      console.log("📝 Dados para atualização:", updateData);

      const updatedAuth = await CooperadoAuth.update(authRecord.id, updateData);
      console.log("✅ Senha atualizada com sucesso:", updatedAuth);

      // Atualizar dados no localStorage
      const updatedCooperadoData = {
        ...cooperadoData,
        isFirstLogin: false,
      };
      localStorage.setItem('loggedInCooperadoData', JSON.stringify(updatedCooperadoData));
      console.log("💾 Dados atualizados no localStorage");

      toast.success("Senha alterada com sucesso!");
      
      // Redirecionar para o dashboard
      setTimeout(() => {
        console.log("🔄 Redirecionando para dashboard...");
        navigate(createPageUrl("PortalDashboard"));
      }, 1500);

    } catch (err) {
      console.error("❌ Erro ao alterar senha:", err);
      setError(`Erro ao alterar senha: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!cooperadoData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando dados do cooperado...</p>
          {debugInfo && (
            <p className="text-xs text-gray-500 mt-2">{debugInfo}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden">
        <CardHeader className="bg-[#1f3664] text-white p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Alteração de Senha</CardTitle>
          <CardDescription className="text-blue-100">
            Bem-vindo(a), {cooperadoData.nome_completo.split(" ")[0]}! 
            Por segurança, altere sua senha no primeiro acesso.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative flex items-start gap-2" role="alert">
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="block sm:inline text-sm">{error}</span>
            </div>
          )}

          {debugInfo && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-xs">
              <strong>Debug:</strong> {debugInfo}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Requisitos da nova senha:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Mínimo de 8 caracteres</li>
                  <li>• Pelo menos uma letra maiúscula</li>
                  <li>• Pelo menos uma letra minúscula</li>
                  <li>• Pelo menos um número</li>
                  <li>• Pelo menos um caractere especial</li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="senha_atual" className="flex items-center text-slate-700">
                <Lock className="w-4 h-4 mr-2 text-slate-500" />
                Senha Atual
              </Label>
              <div className="relative">
                <Input
                  id="senha_atual"
                  name="senha_atual"
                  type={showPasswords.senha_atual ? "text" : "password"}
                  placeholder="Digite sua senha atual"
                  value={formData.senha_atual}
                  onChange={handleChange}
                  className="mt-1 text-base py-2.5 px-4 pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('senha_atual')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.senha_atual ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nova_senha" className="flex items-center text-slate-700">
                <Lock className="w-4 h-4 mr-2 text-slate-500" />
                Nova Senha
              </Label>
              <div className="relative">
                <Input
                  id="nova_senha"
                  name="nova_senha"
                  type={showPasswords.nova_senha ? "text" : "password"}
                  placeholder="Digite a nova senha"
                  value={formData.nova_senha}
                  onChange={handleChange}
                  className="mt-1 text-base py-2.5 px-4 pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('nova_senha')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.nova_senha ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmar_senha" className="flex items-center text-slate-700">
                <Lock className="w-4 h-4 mr-2 text-slate-500" />
                Confirmar Nova Senha
              </Label>
              <div className="relative">
                <Input
                  id="confirmar_senha"
                  name="confirmar_senha"
                  type={showPasswords.confirmar_senha ? "text" : "password"}
                  placeholder="Confirme a nova senha"
                  value={formData.confirmar_senha}
                  onChange={handleChange}
                  className="mt-1 text-base py-2.5 px-4 pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirmar_senha')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.confirmar_senha ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white text-base py-3 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none disabled:shadow-none" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Shield className="mr-2 h-5 w-5" />
              )}
              {loading ? "Alterando Senha..." : "Alterar Senha"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
