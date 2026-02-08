export default function inicial() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Bem-vindo à Sua Loja Online
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Encontre os melhores produtos com os melhores preços
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Ver Ofertas
          </button>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Categorias em Destaque
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Eletrônicos", "Moda", "Casa", "Esportes"].map((category) => (
              <div
                key={category}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🛍️</span>
                </div>
                <h3 className="font-semibold text-lg">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Produtos em Destaque
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((product) => (
              <div
                key={product}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <span className="text-gray-400 text-4xl">📦</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Produto {product}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Descrição do produto aqui
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      R$ 99,90
                    </span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
