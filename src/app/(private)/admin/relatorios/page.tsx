"use client";

import { useState } from "react";

export default function AdminRelatorios() {
  const [periodo, setPeriodo] = useState("mes");

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-black mb-2">
          Relatórios e Analytics
        </h1>
        <p className="text-gray-600">Análise de desempenho da loja</p>
      </div>

      {/* Period Selector */}
      <div className="mb-6">
        <div className="inline-flex rounded-lg border border-gray-300 p-1">
          {["dia", "semana", "mes", "ano"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                periodo === p
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Receita Total</p>
          <p className="text-3xl font-light text-black">R$ 45.780,50</p>
          <p className="text-sm text-green-600 mt-2">
            ↑ 12% vs período anterior
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Vendas</p>
          <p className="text-3xl font-light text-black">342</p>
          <p className="text-sm text-green-600 mt-2">
            ↑ 8% vs período anterior
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Ticket Médio</p>
          <p className="text-3xl font-light text-black">R$ 133,92</p>
          <p className="text-sm text-green-600 mt-2">
            ↑ 4% vs período anterior
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Taxa de Conversão</p>
          <p className="text-3xl font-light text-black">3.2%</p>
          <p className="text-sm text-red-600 mt-2">
            ↓ 0.5% vs período anterior
          </p>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-black mb-6">
            Vendas por Dia
          </h2>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <span className="text-4xl">📊</span>
              <p className="text-gray-500 mt-2">Gráfico de vendas</p>
              <p className="text-xs text-gray-400 mt-1">
                Integração com biblioteca de gráficos
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-black mb-6">
            Produtos Mais Vendidos
          </h2>
          <div className="space-y-4">
            {[
              { name: "Camiseta Básica Branca", sales: 45, revenue: 2250 },
              { name: "Calça Jeans Skinny", sales: 38, revenue: 4560 },
              { name: "Vestido Floral Longo", sales: 32, revenue: 4480 },
              { name: "Tênis Casual Branco", sales: 28, revenue: 3920 },
            ].map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-black">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.sales} vendas
                  </p>
                </div>
                <p className="text-sm font-medium text-green-600">
                  R$ {product.revenue.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-black mb-6">
            Categorias Mais Vendidas
          </h2>
          <div className="space-y-3">
            {[
              { name: "Roupas", percentage: 45 },
              { name: "Calçados", percentage: 30 },
              { name: "Acessórios", percentage: 25 },
            ].map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{category.name}</span>
                  <span className="text-sm font-medium text-black">
                    {category.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-black h-2 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-black mb-6">
            Métodos de Pagamento
          </h2>
          <div className="space-y-4">
            {[
              { method: "PIX", count: 180, percentage: 52.6 },
              { method: "Cartão de Crédito", count: 120, percentage: 35.1 },
              { method: "Boleto", count: 42, percentage: 12.3 },
            ].map((payment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-black">
                    {payment.method}
                  </p>
                  <p className="text-xs text-gray-500">
                    {payment.count} transações
                  </p>
                </div>
                <p className="text-sm font-medium text-black">
                  {payment.percentage}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
