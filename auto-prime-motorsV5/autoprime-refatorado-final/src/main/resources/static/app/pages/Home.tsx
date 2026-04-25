import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Users, Building2, Calendar } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function KPICard({ title, value, icon, color }: KPICardProps) {
  return (
    <Card className="p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
    </Card>
  );
}

export default function Home() {
  const { data: funcionarios = [] } = trpc.funcionarios.list.useQuery();
  const [setorDistribution, setSetorDistribution] = useState<
    Array<{ name: string; value: number }>
  >([]);
  const [salaryRanges, setSalaryRanges] = useState<
    Array<{ range: string; count: number }>
  >([]);

  useEffect(() => {
    if (funcionarios.length === 0) {
      setSetorDistribution([]);
      setSalaryRanges([]);
      return;
    }

    // Calcular distribuição por setor
    const setorMap = new Map<string, number>();
    funcionarios.forEach((f) => {
      const count = setorMap.get(f.setor) || 0;
      setorMap.set(f.setor, count + 1);
    });

    const setorData = Array.from(setorMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));
    setSetorDistribution(setorData);

    // Calcular distribuição por faixa salarial
    const ranges = [
      { range: "0-2k", min: 0, max: 2000 },
      { range: "2k-5k", min: 2000, max: 5000 },
      { range: "5k-10k", min: 5000, max: 10000 },
      { range: "10k+", min: 10000, max: Infinity },
    ];

    const salaryData = ranges.map(({ range, min, max }) => ({
      range,
      count: funcionarios.filter((f) => f.salario >= min && f.salario < max)
        .length,
    }));
    setSalaryRanges(salaryData);
  }, [funcionarios]);

  // Calcular KPIs
  const totalFuncionarios = funcionarios.length;
  const setoresAtivos = new Set(funcionarios.map((f) => f.setor)).size;
  const contratacoesMes = funcionarios.filter((f) => {
    const dataAdmissao = new Date(f.dataAdmissao);
    const agora = new Date();
    return (
      dataAdmissao.getMonth() === agora.getMonth() &&
      dataAdmissao.getFullYear() === agora.getFullYear()
    );
  }).length;

  const COLORS = ["#4CAF50", "#66BB6A", "#81C784", "#A5D6A7", "#C8E6C9"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Bem-vindo ao Sistema de Gestão de Funcionários
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Total de Funcionários"
          value={totalFuncionarios}
          icon={<Users className="text-white" size={24} />}
          color="bg-green-600"
        />
        <KPICard
          title="Setores Ativos"
          value={setoresAtivos}
          icon={<Building2 className="text-white" size={24} />}
          color="bg-blue-600"
        />
        <KPICard
          title="Contratações este Mês"
          value={contratacoesMes}
          icon={<Calendar className="text-white" size={24} />}
          color="bg-purple-600"
        />
      </div>

      {/* Gráficos */}
      {funcionarios.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Rosca - Distribuição por Setor */}
          <Card className="p-6 bg-white border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Distribuição por Setor
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={setorDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {setorDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value} funcionários`}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {setorDistribution.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-600">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Gráfico de Barras - Análise Salarial */}
          <Card className="p-6 bg-white border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Análise Salarial por Faixas
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salaryRanges}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="count"
                  fill="#4CAF50"
                  name="Funcionários"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      ) : (
        <Card className="p-12 bg-white border border-gray-200 text-center">
          <p className="text-gray-600">
            Nenhum funcionário cadastrado ainda. Comece adicionando funcionários para ver
            os gráficos.
          </p>
        </Card>
      )}
    </div>
  );
}
