require("dotenv").config();

const BASE_URL = "http://localhost:5000/api";

async function testRoutes() {
  console.log("🧪 Probando rutas del backend...\n");

  try {
    // Test 1: Health check
    console.log("1️⃣ Health Check");
    const healthRes = await fetch(`${BASE_URL}/health`);
    const health = await healthRes.json();
    console.log("✅", health.message);

    // Test 2: Get categorías
    console.log("\n2️⃣ GET /categories");
    const categoriesRes = await fetch(`${BASE_URL}/categories`);
    const categories = await categoriesRes.json();
    console.log("✅ Categorías:", categories.count);
    console.log(
      "   Nombres:",
      categories.categories.map((c) => c.name).join(", ")
    );

    // Test 3: Get productos
    console.log("\n3️⃣ GET /products");
    const productsRes = await fetch(`${BASE_URL}/products`);
    const products = await productsRes.json();
    console.log("✅ Productos:", products.count);
    if (products.count > 0) {
      console.log(
        "   Nombres:",
        products.products.map((p) => p.name).join(", ")
      );
    }

    console.log("\n✅ TODAS LAS RUTAS FUNCIONAN CORRECTAMENTE\n");
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    console.error(
      "\n⚠️  Asegúrate de que el backend esté corriendo en http://localhost:5000"
    );
  }
}

testRoutes();
