import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge"; // Adicionado import do Badge
import { User as UserIcon, Mail, Shield, Edit3, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function PerfilUsuario() {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        setFullName(currentUser.full_name || "");
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        toast.error("Não foi possível carregar os dados do perfil.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase().slice(0, 2);
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error("O nome completo não pode estar vazio.");
      return;
    }
    setSaving(true);
    try {
      await User.updateMyUserData({ full_name: fullName });
      // Atualiza o estado local do usuário para refletir a mudança imediatamente
      setUser(prevUser => ({ ...prevUser, full_name: fullName }));
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar o perfil. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-10">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center">
        <Shield className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Erro ao Carregar Perfil</h2>
        <p className="text-slate-600">Não foi possível carregar os dados do seu perfil. Tente recarregar a página.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Meu Perfil</h1>
      </div>

      <Card className="shadow-lg border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 flex flex-col items-center text-center">
          <Avatar className="w-28 h-28 mb-4 border-4 border-white shadow-xl">
            <AvatarImage src={user.picture} alt={user.full_name} />
            <AvatarFallback className="text-3xl bg-blue-100 text-blue-700 font-semibold">
              {getInitials(user.full_name)}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-semibold text-white mb-1">{user.full_name}</h2>
          <p className="text-blue-200">{user.email}</p>
          <Badge className="mt-3 bg-white/20 text-white backdrop-blur-sm border-0">
            {user.role === 'admin' ? 'Administrador' : 'Usuário'}
          </Badge>
        </div>
        
        <CardContent className="p-6 space-y-6">
          <div>
            <Label htmlFor="fullName" className="text-slate-700 font-medium mb-1 flex items-center">
              <UserIcon className="w-4 h-4 mr-2 text-slate-500" />
              Nome Completo
            </Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 text-base py-2 px-3"
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <Label className="text-slate-700 font-medium mb-1 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-slate-500" />
              E-mail
            </Label>
            <Input
              type="email"
              value={user.email}
              disabled
              className="mt-1 text-base py-2 px-3 bg-slate-100 cursor-not-allowed"
            />
          </div>

          <div>
            <Label className="text-slate-700 font-medium mb-1 flex items-center">
              <Shield className="w-4 h-4 mr-2 text-slate-500" />
              Função no Sistema
            </Label>
            <Input
              type="text"
              value={user.role === 'admin' ? 'Administrador' : 'Usuário'}
              disabled
              className="mt-1 text-base py-2 px-3 bg-slate-100 cursor-not-allowed"
            />
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 p-6 border-t border-slate-200">
          <Button 
            onClick={handleSave} 
            disabled={saving || fullName === user.full_name}
            className="w-full sm:w-auto ml-auto bg-blue-600 hover:bg-blue-700 text-white text-base py-2.5 px-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none disabled:shadow-none"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}