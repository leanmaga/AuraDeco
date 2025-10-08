import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import categoryService from "../../services/categoryService";
import productService from "../../services/productService";

// ========================================
// EventBuilder.jsx - Componente Principal
// ========================================
const EventBuilder = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart } = useCart();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadProducts(selectedCategory._id);
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data.categories);
      if (data.categories.length > 0) {
        setSelectedCategory(data.categories[0]);
      }
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async (categoryId) => {
    try {
      const data = await productService.getProductsByCategory(categoryId);
      setProducts(data.products);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Armá tu Evento 🎉
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Elegí los productos para tu decoración perfecta
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Selector de Categorías */}
        <StepSelector
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Grid de Productos */}
        <div className="mt-8">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No hay productos disponibles en esta categoría
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Carrito Inferior - NUEVO */}
      <BottomCart />
    </div>
  );
};

// ========================================
// BottomCart - Carrito Inferior con 3 estados
// ========================================
const BottomCart = () => {
  const { cart, removeFromCart, updateQuantity, getTotal, getTotalItems } =
    useCart();
  const [viewState, setViewState] = useState("minimal"); // 'minimal' | 'summary' | 'full'

  if (cart.length === 0) return null;

  return (
    <>
      {/* Overlay cuando está en vista completa */}
      {viewState === "full" && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setViewState("minimal")}
        />
      )}

      {/* Barra inferior fija */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-2 border-purple-600 z-50 transition-all duration-300 ${
          viewState === "minimal"
            ? "h-20"
            : viewState === "summary"
            ? "h-auto max-h-96"
            : "h-screen"
        }`}
      >
        {/* VISTA MINIMAL - Barra compacta */}
        {viewState === "minimal" && (
          <div className="h-full px-4 flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 text-purple-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                {getTotalItems()}
              </div>
              <div>
                <p className="text-sm text-gray-600">Tu pedido</p>
                <p className="text-lg font-bold text-gray-900">
                  ${getTotal().toLocaleString("es-AR")}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewState("summary")}
                className="px-6 py-3 bg-purple-100 text-purple-600 rounded-lg font-semibold hover:bg-purple-200 transition-colors"
              >
                Ver Resumen
              </button>
              <WhatsAppCheckoutButton />
            </div>
          </div>
        )}

        {/* VISTA SUMMARY - Resumen expandido */}
        {viewState === "summary" && (
          <div className="p-4 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Resumen del Pedido
              </h3>
              <button
                onClick={() => setViewState("minimal")}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <img
                      src={
                        item.images?.[0]?.url ||
                        "https://via.placeholder.com/60"
                      }
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-purple-600">
                    ${(item.price * item.quantity).toLocaleString("es-AR")}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${getTotal().toLocaleString("es-AR")}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewState("full")}
                  className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg font-semibold hover:bg-purple-200"
                >
                  Ver Detalle
                </button>
                <WhatsAppCheckoutButton />
              </div>
            </div>
          </div>
        )}

        {/* VISTA FULL - Carrito completo */}
        {viewState === "full" && (
          <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="bg-purple-600 text-white p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Tu Pedido Completo</h2>
                <p className="text-sm text-purple-100">
                  {getTotalItems()}{" "}
                  {getTotalItems() === 1 ? "producto" : "productos"}
                </p>
              </div>
              <button
                onClick={() => setViewState("minimal")}
                className="text-white hover:bg-purple-700 rounded-full p-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Lista de productos con scroll */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4 max-w-4xl mx-auto">
                {cart.map((item) => (
                  <CartItemFull
                    key={item._id}
                    item={item}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                  />
                ))}
              </div>
            </div>

            {/* Footer con total */}
            <div className="border-t bg-white p-4 shadow-lg">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Total a pagar</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${getTotal().toLocaleString("es-AR")}
                    </p>
                  </div>
                  <WhatsAppCheckoutButton large />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Al enviar el pedido, serás redirigido a WhatsApp para
                  confirmar tu orden
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// ========================================
// CartItemFull - Item del carrito en vista completa
// ========================================
const CartItemFull = ({ item, onRemove, onUpdateQuantity }) => {
  const mainImage = item.images?.[0]?.url || "https://via.placeholder.com/100";

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <img
          src={mainImage}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
          {item.description && (
            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
          )}
          <p className="text-lg font-bold text-purple-600">
            ${item.price.toLocaleString("es-AR")}
          </p>
        </div>
        <div className="flex flex-col items-end justify-between">
          <button
            onClick={() => onRemove(item._id)}
            className="text-red-500 hover:text-red-700 p-1"
            title="Eliminar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded"
            >
              -
            </button>
            <span className="w-8 text-center font-semibold">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t flex justify-between items-center">
        <span className="text-sm text-gray-600">Subtotal:</span>
        <span className="text-lg font-bold text-gray-900">
          ${(item.price * item.quantity).toLocaleString("es-AR")}
        </span>
      </div>
    </div>
  );
};

// ========================================
// StepSelector - Selector de Categorías
// ========================================
const StepSelector = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Paso a Paso - Elegí por categoría:
      </h2>
      <div className="flex overflow-x-auto gap-3 pb-2">
        {categories.map((category, index) => (
          <button
            key={category._id}
            onClick={() => onSelectCategory(category)}
            className={`flex-shrink-0 px-6 py-3 rounded-lg font-medium transition-all ${
              selectedCategory?._id === category._id
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="text-xl mr-2">{category.icon || "📦"}</span>
            <span className="text-sm font-semibold">
              {index + 1}. {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ========================================
// ProductCard - Tarjeta de Producto
// ========================================
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 500);
  };

  const mainImage =
    product.images?.[0]?.url ||
    "https://via.placeholder.com/400x300?text=Sin+Imagen";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.featured && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
            ⭐ Destacado
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-purple-600">
              ${product.price.toLocaleString("es-AR")}
            </span>
            {product.stock !== null && (
              <p className="text-xs text-gray-500 mt-1">
                Stock: {product.stock}
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isAdding
                ? "bg-green-500 text-white"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {isAdding ? "✓ Agregado" : "+ Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ========================================
// WhatsAppCheckoutButton - Botón de WhatsApp
// ========================================
const WhatsAppCheckoutButton = ({ large = false }) => {
  const { cart, getTotal } = useCart();

  const whatsappNumber =
    import.meta.env.VITE_WHATSAPP_NUMBER || "5491127764823";

  const message =
    `🎉 *Pedido de Evento - Glob.deco*\n\n` +
    `📝 *Productos:*\n${cart
      .map(
        (item) =>
          `• ${item.name}\n  Cantidad: ${item.quantity}\n  Precio: $${(
            item.price * item.quantity
          ).toLocaleString("es-AR")}`
      )
      .join("\n\n")}\n\n` +
    `💰 *Total: $${getTotal().toLocaleString("es-AR")}*\n\n` +
    `¿Podrías ayudarme con más detalles para mi evento?`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  if (large) {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-8 py-4 bg-green-500 text-white rounded-lg font-bold text-lg hover:bg-green-600 transition-all hover:scale-105 flex items-center gap-3 shadow-lg"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        Enviar Pedido por WhatsApp
      </a>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
      Enviar Pedido
    </a>
  );
};

export default EventBuilder;
