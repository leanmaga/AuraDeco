import { useState, useEffect } from "react";
import api from "../../services/api";

const TextContentManager = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    key: "",
    title: "",
    content: "",
    section: "home",
    order: 0,
    active: true,
  });

  const sections = [
    { value: "home", label: "🏠 Página Principal" },
    { value: "events", label: "🎉 Eventos" },
    { value: "about", label: "ℹ️ Nosotros" },
    { value: "services", label: "⚡ Servicios" },
    { value: "testimonials", label: "💬 Testimonios" },
    { value: "footer", label: "📄 Footer" },
  ];

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/text-content");
      setContents(response.data.contents || []);
    } catch (error) {
      console.error("Error al cargar contenidos:", error);
      alert("Error al cargar el contenido");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.key || !formData.title) {
      alert("Por favor completa los campos requeridos");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/text-content/${editingId}`, formData);
        alert("✅ Contenido actualizado exitosamente");
      } else {
        await api.post("/text-content", formData);
        alert("✅ Contenido creado exitosamente");
      }

      resetForm();
      fetchContents();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert(error.response?.data?.message || "Error al guardar el contenido");
    }
  };

  const handleEdit = (content) => {
    setEditingId(content._id);
    setFormData({
      key: content.key,
      title: content.title,
      content: content.content,
      section: content.section,
      order: content.order,
      active: content.active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este contenido?")) return;

    try {
      await api.delete(`/text-content/${id}`);
      alert("✅ Contenido eliminado");
      fetchContents();
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar el contenido");
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await api.patch(`/text-content/${id}/toggle`, { active: !currentStatus });
      fetchContents();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("Error al cambiar el estado");
    }
  };

  const resetForm = () => {
    setFormData({
      key: "",
      title: "",
      content: "",
      section: "home",
      order: 0,
      active: true,
    });
    setEditingId(null);
  };

  const groupedContents = contents.reduce((acc, content) => {
    if (!acc[content.section]) {
      acc[content.section] = [];
    }
    acc[content.section].push(content);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          📝 Gestor de Contenido Textual
        </h2>
        <p className="text-purple-100">
          Administra todos los textos del sitio: eventos, descripciones, títulos
          y más
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Cómo usar</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • <strong>Key:</strong> Identificador único (ej: evento_sofia,
                hero_title)
              </li>
              <li>
                • <strong>Título:</strong> Nombre descriptivo interno
              </li>
              <li>
                • <strong>Contenido:</strong> El texto que se mostrará en el
                sitio
              </li>
              <li>
                • <strong>Sección:</strong> Dónde aparece este contenido
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {editingId ? "✏️ Editar Contenido" : "➕ Nuevo Contenido"}
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key (Identificador) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="key"
                value={formData.key}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                placeholder="evento_sofia"
                disabled={editingId !== null}
              />
              <p className="text-xs text-gray-500 mt-1">
                Solo letras, números y guiones bajos
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                placeholder="Evento de Sofia"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenido
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                rows={5}
                placeholder="Escribe aquí el texto que aparecerá en el sitio..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.content.length} caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sección
              </label>
              <select
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
              >
                {sections.map((section) => (
                  <option key={section.value} value={section.value}>
                    {section.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Orden
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                min={0}
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Activo
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              {editingId ? "💾 Guardar Cambios" : "➕ Crear Contenido"}
            </button>
            {editingId && (
              <button
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800">
          📋 Contenidos Existentes
        </h3>

        {Object.keys(groupedContents).length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">No hay contenidos creados aún</p>
          </div>
        ) : (
          Object.entries(groupedContents).map(([section, items]) => {
            const sectionInfo = sections.find((s) => s.value === section);
            return (
              <div
                key={section}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="bg-gray-50 px-6 py-3 border-b">
                  <h4 className="font-semibold text-gray-800">
                    {sectionInfo?.label || section}
                  </h4>
                </div>

                <div className="divide-y">
                  {items
                    .sort((a, b) => a.order - b.order)
                    .map((content) => (
                      <div
                        key={content._id}
                        className="p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h5 className="font-semibold text-gray-900">
                                {content.title}
                              </h5>
                              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                {content.key}
                              </span>
                              {!content.active && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                  Inactivo
                                </span>
                              )}
                            </div>

                            {content.content && (
                              <p className="text-gray-600 text-sm line-clamp-3 whitespace-pre-wrap">
                                {content.content}
                              </p>
                            )}

                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>Orden: {content.order}</span>
                              <span>
                                Caracteres: {content.content?.length || 0}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() =>
                                toggleActive(content._id, content.active)
                              }
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                content.active
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                              title={content.active ? "Desactivar" : "Activar"}
                            >
                              {content.active ? "✓" : "✗"}
                            </button>

                            <button
                              onClick={() => handleEdit(content)}
                              className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 text-sm font-medium transition-colors"
                            >
                              ✏️ Editar
                            </button>

                            <button
                              onClick={() => handleDelete(content._id)}
                              className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 text-sm font-medium transition-colors"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TextContentManager;
