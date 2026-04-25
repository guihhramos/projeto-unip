import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Plus, Search, Filter } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const SETORES = [
  "Tecnologia",
  "Recursos Humanos",
  "Vendas",
  "Marketing",
  "Financeiro",
  "Logística",
  "Manutenção",
  "Diretoria",
  "Outro",
];

export default function Funcionarios() {
  const [, setLocation] = useLocation();
  const { data: funcionarios = [], isLoading } = trpc.funcionarios.list.useQuery();
  const deleteMutation = trpc.funcionarios.delete.useMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSetor, setSelectedSetor] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filteredFuncionarios = useMemo(() => {
    return funcionarios.filter((f) => {
      const matchesSearch =
        f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.cpf.includes(searchTerm) ||
        f.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSetor = !selectedSetor || f.setor === selectedSetor;

      return matchesSearch && matchesSetor;
    });
  }, [funcionarios, searchTerm, selectedSetor]);

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Funcionário deletado com sucesso");
      setDeleteConfirm(null);
    } catch (error) {
      toast.error("Erro ao deletar funcionário");
    }
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3");
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(salary / 100);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Funcionários</h1>
          <p className="text-gray-600 mt-1">
            Total: {filteredFuncionarios.length} de {funcionarios.length}
          </p>
        </div>
        <Button
          onClick={() => setLocation("/funcionarios/novo")}
          className="bg-green-600 hover:bg-green-700 text-white gap-2"
        >
          <Plus size={18} />
          Novo Funcionário
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4 bg-white border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input
              placeholder="Buscar por nome, CPF ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtro por Setor */}
          <Select value={selectedSetor || "todos"} onValueChange={(value) => setSelectedSetor(value === "todos" ? null : value)}>
            <SelectTrigger className="flex items-center gap-2">
              <Filter size={18} />
              <SelectValue placeholder="Filtrar por setor..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os setores</SelectItem>
              {SETORES.map((setor) => (
                <SelectItem key={setor} value={setor}>
                  {setor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Listagem */}
      {isLoading ? (
        <Card className="p-8 bg-white border border-gray-200 text-center">
          <p className="text-gray-600">Carregando funcionários...</p>
        </Card>
      ) : filteredFuncionarios.length === 0 ? (
        <Card className="p-8 bg-white border border-gray-200 text-center">
          <p className="text-gray-600">
            {funcionarios.length === 0
              ? "Nenhum funcionário cadastrado. Clique em 'Novo Funcionário' para começar."
              : "Nenhum funcionário encontrado com os filtros aplicados."}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredFuncionarios.map((funcionario) => (
            <Card
              key={funcionario.id}
              className="p-4 bg-white border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {funcionario.nome}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                    <p>CPF: {formatCPF(funcionario.cpf)}</p>
                    <p>E-mail: {funcionario.email}</p>
                    <p>Telefone: {formatPhone(funcionario.telefone)}</p>
                    <p>Setor: {funcionario.setor}</p>
                    <p>Salário: {formatSalary(funcionario.salario)}</p>
                    <p>Admissão: {formatDate(funcionario.dataAdmissao)}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteConfirm(funcionario.id)}
                    className="text-red-600 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar este funcionário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-red-600 hover:bg-red-700"
            >
              Deletar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
