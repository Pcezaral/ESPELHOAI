import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowLeft, User, Mail, Calendar } from "lucide-react";
import { useState } from "react";

export default function Perfil() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    dateOfBirth: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // TODO: Implementar chamada tRPC para atualizar perfil
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700 py-4 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={() => setLocation("/")}
            className="p-2 hover:bg-slate-800 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Card className="bg-slate-900 border-slate-700 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-2xl">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-slate-400">{user?.email}</p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Nome</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-400 cursor-not-allowed"
                />
                <p className="text-xs text-slate-400 mt-1">Email não pode ser alterado</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Data de Nascimento</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
                >
                  Salvar Alterações
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
                <User className="w-5 h-5 text-orange-400" />
                <div className="flex-1">
                  <p className="text-sm text-slate-400">Nome</p>
                  <p className="font-semibold">{user?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
                <Mail className="w-5 h-5 text-orange-400" />
                <div className="flex-1">
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="font-semibold">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-400" />
                <div className="flex-1">
                  <p className="text-sm text-slate-400">Data de Nascimento</p>
                  <p className="font-semibold">Não informado</p>
                </div>
              </div>

              <Button
                onClick={() => setIsEditing(true)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
              >
                Editar Perfil
              </Button>
            </div>
          )}
        </Card>

        {/* Seção de Perigo */}
        <Card className="bg-red-900/20 border-red-700/50 p-8 mt-8">
          <h3 className="text-xl font-bold text-red-400 mb-4">Zona de Perigo</h3>
          <p className="text-slate-300 mb-6">
            Ações irreversíveis. Tenha cuidado ao prosseguir.
          </p>
          <Button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            Sair da Conta
          </Button>
        </Card>
      </main>
    </div>
  );
}
