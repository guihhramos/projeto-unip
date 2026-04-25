import { useState, useEffect } from "react";
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
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

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

// Validações
function validateCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, "");
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

  return true;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Máscaras
function maskCPF(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
}

function maskPhone(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 10) {
    return cleaned
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 14);
  } else {
    return cleaned
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  }
}

function maskSalary(value: string): string {
  const numericValue = value.replace(/\D/g, "");
  return numericValue ? (parseInt(numericValue) / 100).toFixed(2) : "";
}

interface FormData {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  setor: string;
  salario: string;
  dataAdmissao: string;
}

interface Errors {
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  setor?: string;
  salario?: string;
  dataAdmissao?: string;
}

export default function CadastroFuncionario() {
  const [, setLocation] = useLocation();
  const createMutation = trpc.funcionarios.create.useMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    setor: "",
    salario: "",
    dataAdmissao: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validação em tempo real
  useEffect(() => {
    const newErrors: Errors = {};

    if (touched.nome && !formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (touched.cpf) {
      if (!formData.cpf.trim()) {
        newErrors.cpf = "CPF é obrigatório";
      } else if (!validateCPF(formData.cpf)) {
        newErrors.cpf = "CPF inválido";
      }
    }

    if (touched.email) {
      if (!formData.email.trim()) {
        newErrors.email = "E-mail é obrigatório";
      } else if (!validateEmail(formData.email)) {
        newErrors.email = "E-mail inválido";
      }
    }

    if (touched.telefone && !formData.telefone.trim()) {
      newErrors.telefone = "Telefone é obrigatório";
    }

    if (touched.setor && !formData.setor) {
      newErrors.setor = "Setor é obrigatório";
    }

    if (touched.salario && !formData.salario) {
      newErrors.salario = "Salário é obrigatório";
    }

    if (touched.dataAdmissao && !formData.dataAdmissao) {
      newErrors.dataAdmissao = "Data de admissão é obrigatória";
    }

    setErrors(newErrors);
  }, [formData, touched]);

  const handleChange = (field: keyof FormData, value: string) => {
    let processedValue = value;

    if (field === "cpf") {
      processedValue = maskCPF(value);
    } else if (field === "telefone") {
      processedValue = maskPhone(value);
    } else if (field === "salario") {
      processedValue = maskSalary(value);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Marcar todos os campos como tocados
    setTouched({
      nome: true,
      cpf: true,
      email: true,
      telefone: true,
      setor: true,
      salario: true,
      dataAdmissao: true,
    });

    // Validar todos os campos
    const newErrors: Errors = {};

    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!formData.cpf.trim()) newErrors.cpf = "CPF é obrigatório";
    else if (!validateCPF(formData.cpf)) newErrors.cpf = "CPF inválido";

    if (!formData.email.trim()) newErrors.email = "E-mail é obrigatório";
    else if (!validateEmail(formData.email)) newErrors.email = "E-mail inválido";

    if (!formData.telefone.trim()) newErrors.telefone = "Telefone é obrigatório";
    if (!formData.setor) newErrors.setor = "Setor é obrigatório";
    if (!formData.salario) newErrors.salario = "Salário é obrigatório";
    if (!formData.dataAdmissao) newErrors.dataAdmissao = "Data de admissão é obrigatória";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    setIsSubmitting(true);

    try {
      const salaryInCents = Math.round(parseFloat(formData.salario) * 100);

      await createMutation.mutateAsync({
        nome: formData.nome.trim(),
        cpf: formData.cpf.replace(/\D/g, ""),
        email: formData.email.trim(),
        telefone: formData.telefone.replace(/\D/g, ""),
        setor: formData.setor,
        salario: salaryInCents,
        dataAdmissao: new Date(formData.dataAdmissao),
      });

      toast.success("Funcionário cadastrado com sucesso!");
      setLocation("/funcionarios");
    } catch (error) {
      toast.error("Erro ao cadastrar funcionário");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = Object.keys(errors).length === 0 && Object.values(formData).every((v) => v);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setLocation("/funcionarios")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Novo Funcionário</h1>
          <p className="text-gray-600 mt-1">Preencha os dados para cadastrar um novo funcionário</p>
        </div>
      </div>

      {/* Formulário */}
      <Card className="p-6 bg-white border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Nome Completo *
            </label>
            <Input
              type="text"
              value={formData.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              onBlur={() => handleBlur("nome")}
              placeholder="João da Silva"
              className={errors.nome ? "border-red-500" : ""}
            />
            {errors.nome && <p className="text-red-600 text-sm mt-1">{errors.nome}</p>}
          </div>

          {/* CPF */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              CPF *
            </label>
            <Input
              type="text"
              value={formData.cpf}
              onChange={(e) => handleChange("cpf", e.target.value)}
              onBlur={() => handleBlur("cpf")}
              placeholder="000.000.000-00"
              className={errors.cpf ? "border-red-500" : ""}
            />
            {errors.cpf && <p className="text-red-600 text-sm mt-1">{errors.cpf}</p>}
          </div>

          {/* E-mail */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              E-mail *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="joao@example.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Telefone *
            </label>
            <Input
              type="tel"
              value={formData.telefone}
              onChange={(e) => handleChange("telefone", e.target.value)}
              onBlur={() => handleBlur("telefone")}
              placeholder="(00) 00000-0000"
              className={errors.telefone ? "border-red-500" : ""}
            />
            {errors.telefone && <p className="text-red-600 text-sm mt-1">{errors.telefone}</p>}
          </div>

          {/* Setor */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Setor *
            </label>
            <Select value={formData.setor} onValueChange={(value) => handleChange("setor", value)}>
              <SelectTrigger className={errors.setor ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione um setor" />
              </SelectTrigger>
              <SelectContent>
                {SETORES.map((setor) => (
                  <SelectItem key={setor} value={setor}>
                    {setor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.setor && <p className="text-red-600 text-sm mt-1">{errors.setor}</p>}
          </div>

          {/* Salário */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Salário (R$) *
            </label>
            <Input
              type="text"
              value={formData.salario}
              onChange={(e) => handleChange("salario", e.target.value)}
              onBlur={() => handleBlur("salario")}
              placeholder="0.00"
              className={errors.salario ? "border-red-500" : ""}
            />
            {errors.salario && <p className="text-red-600 text-sm mt-1">{errors.salario}</p>}
          </div>

          {/* Data de Admissão */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Data de Admissão *
            </label>
            <Input
              type="date"
              value={formData.dataAdmissao}
              onChange={(e) => handleChange("dataAdmissao", e.target.value)}
              onBlur={() => handleBlur("dataAdmissao")}
              className={errors.dataAdmissao ? "border-red-500" : ""}
            />
            {errors.dataAdmissao && (
              <p className="text-red-600 text-sm mt-1">{errors.dataAdmissao}</p>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/funcionarios")}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
            >
              {isSubmitting ? "Salvando..." : "Salvar Funcionário"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
