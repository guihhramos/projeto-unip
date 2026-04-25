import { Card } from "@/components/ui/card";
import { Info, Building2, Award } from "lucide-react";

export default function Configuracoes() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">Informações do sistema</p>
      </div>

      {/* Informações do Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Versão */}
        <Card className="p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Info className="text-blue-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Versão do Sistema</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">5.0</p>
              <p className="text-sm text-gray-600 mt-1">Corporativo Premium</p>
            </div>
          </div>
        </Card>

        {/* Empresa */}
        <Card className="p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Building2 className="text-green-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Empresa</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">AutoPrime Motors</p>
              <p className="text-sm text-gray-600 mt-1">Sistema de Gestão de Funcionários</p>
            </div>
          </div>
        </Card>

        {/* Créditos */}
        <Card className="p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="text-purple-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Créditos Acadêmicos</h3>
              <p className="text-2xl font-bold text-purple-600 mt-2">UNIP</p>
              <p className="text-sm text-gray-600 mt-1">Projeto Acadêmico</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detalhes */}
      <Card className="p-6 bg-white border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Detalhes do Sistema</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="text-gray-600">Versão</span>
            <span className="font-semibold text-gray-900">5.0 Corporativo Premium</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="text-gray-600">Empresa</span>
            <span className="font-semibold text-gray-900">AutoPrime Motors</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="text-gray-600">Instituição</span>
            <span className="font-semibold text-gray-900">Universidade Potiguar (UNIP)</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="text-gray-600">Tipo de Projeto</span>
            <span className="font-semibold text-gray-900">Trabalho Acadêmico</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Ativo
            </span>
          </div>
        </div>
      </Card>

      {/* Descrição */}
      <Card className="p-6 bg-white border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Sobre o Sistema</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            O <strong>AutoPrime Motors - Sistema de Cadastro de Funcionários (SCF)</strong> é uma solução
            corporativa premium desenvolvida por alunos da Universidade Potiguar (UNIP) como parte de um
            trabalho acadêmico.
          </p>
          <p>
            O sistema oferece uma plataforma robusta e eficiente para o gerenciamento de dados de funcionários,
            utilizando arquitetura moderna e tecnologias amplamente empregadas no mercado.
          </p>
          <p>
            Com um design corporativo premium, interface intuitiva e responsiva, o AutoPrime Motors apresenta
            funcionalidades completas para cadastro, listagem, busca, filtros e análise de dados de funcionários
            através de gráficos interativos e KPIs em tempo real.
          </p>
        </div>
      </Card>

      {/* Funcionalidades */}
      <Card className="p-6 bg-white border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Funcionalidades Principais</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span className="text-gray-700">Dashboard executivo com KPIs e gráficos interativos</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span className="text-gray-700">Cadastro completo de funcionários com validações em tempo real</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span className="text-gray-700">Máscaras automáticas para CPF e telefone</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span className="text-gray-700">Sistema de busca e filtros avançados</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span className="text-gray-700">Interface responsiva para desktop, tablet e mobile</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span className="text-gray-700">Design corporativo premium com paleta verde e branca</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
