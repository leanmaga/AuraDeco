const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  const mainImage =
    item.images?.[0]?.url || "https://via.placeholder.com/100?text=Sin+Imagen";

  return (
    <div className="flex gap-3 bg-gray-50 rounded-lg p-3">
      <img
        src={mainImage}
        alt={item.name}
        className="w-20 h-20 object-cover rounded"
      />
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
        <p className="text-purple-600 font-bold mt-1">
          ${item.price.toLocaleString("es-AR")}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
            className="w-7 h-7 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
          >
            -
          </button>
          <span className="w-8 text-center font-semibold">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
            className="w-7 h-7 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
          >
            +
          </button>
          <button
            onClick={() => onRemove(item._id)}
            className="ml-auto text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
