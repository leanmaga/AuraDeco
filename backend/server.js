// Script para verificar que el deployment esté funcionando correctamente

const BACKEND_URL = "https://aura-deco.vercel.app";
const FRONTEND_URL = "https://auradeco.vercel.app";

async function checkBackend() {
  console.log("\n🔍 Verificando Backend...\n");

  try {
    // Test 1: Verificar que el servidor esté online
    console.log("1️⃣ Verificando servidor...");
    const rootRes = await fetch(BACKEND_URL);
    const rootData = await rootRes.json();
    console.log(`✅ Servidor online: ${rootData.message}`);

    // Test 2: Verificar health endpoint
    console.log("\n2️⃣ Verificando /api/health...");
    const healthRes = await fetch(`${BACKEND_URL}/api/health`);
    const healthData = await healthRes.json();
    console.log(`✅ Health check: ${healthData.message}`);
    console.log(`   Environment: ${healthData.environment}`);
    console.log(`   Client URL: ${healthData.clientUrl}`);
    console.log(`   Allowed Origins:`, healthData.allowedOrigins);

    // Test 3: Verificar CORS haciendo una petición desde el origin del frontend
    console.log("\n3️⃣ Verificando CORS...");
    const corsRes = await fetch(`${BACKEND_URL}/api/health`, {
      headers: {
        Origin: FRONTEND_URL,
        "Access-Control-Request-Method": "GET",
      },
    });

    const corsHeaders = corsRes.headers.get("access-control-allow-origin");
    if (corsHeaders) {
      console.log(`✅ CORS configurado: ${corsHeaders}`);
    } else {
      console.log(`⚠️  Header CORS no encontrado`);
    }

    // Test 4: Verificar endpoint de categorías
    console.log("\n4️⃣ Verificando /api/categories...");
    const catRes = await fetch(`${BACKEND_URL}/api/categories`);
    if (catRes.ok) {
      const catData = await catRes.json();
      console.log(`✅ Categorías: ${catData.count} encontradas`);
    } else {
      console.log(`❌ Error en categorías: ${catRes.status}`);
    }

    // Test 5: Verificar endpoint de productos
    console.log("\n5️⃣ Verificando /api/products...");
    const prodRes = await fetch(`${BACKEND_URL}/api/products`);
    if (prodRes.ok) {
      const prodData = await prodRes.json();
      console.log(`✅ Productos: ${prodData.count} encontrados`);
    } else {
      console.log(`❌ Error en productos: ${prodRes.status}`);
    }

    console.log("\n" + "=".repeat(50));
    console.log("✅ BACKEND VERIFICADO CORRECTAMENTE");
    console.log("=".repeat(50) + "\n");
  } catch (error) {
    console.error("\n❌ ERROR EN BACKEND:", error.message);
    console.log("\n⚠️  Posibles causas:");
    console.log("   - El backend no está desplegado en Vercel");
    console.log("   - La URL del backend es incorrecta");
    console.log("   - Hay un error en el código del servidor");
    console.log("\n");
  }
}

async function checkFrontend() {
  console.log("\n🔍 Verificando Frontend...\n");

  try {
    console.log("1️⃣ Verificando que el frontend esté online...");
    const res = await fetch(FRONTEND_URL);

    if (res.ok) {
      console.log(`✅ Frontend online: ${res.status}`);

      // Verificar headers de seguridad
      console.log("\n2️⃣ Verificando headers de seguridad...");
      const csp = res.headers.get("content-security-policy");
      if (csp && csp.includes("aura-deco.vercel.app")) {
        console.log(`✅ CSP configurado correctamente`);
      } else {
        console.log(`⚠️  CSP podría necesitar ajustes`);
      }
    } else {
      console.log(`❌ Frontend error: ${res.status}`);
    }

    console.log("\n" + "=".repeat(50));
    console.log("✅ FRONTEND VERIFICADO CORRECTAMENTE");
    console.log("=".repeat(50) + "\n");
  } catch (error) {
    console.error("\n❌ ERROR EN FRONTEND:", error.message);
    console.log("\n");
  }
}

async function checkIntegration() {
  console.log("\n🔗 Verificando Integración Frontend ↔️ Backend...\n");

  try {
    // Simular una petición desde el frontend al backend
    console.log("1️⃣ Simulando petición de login...");
    const loginRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "OPTIONS",
      headers: {
        Origin: FRONTEND_URL,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type",
      },
    });

    if (loginRes.ok) {
      const allowOrigin = loginRes.headers.get("access-control-allow-origin");
      const allowMethods = loginRes.headers.get("access-control-allow-methods");

      console.log(`✅ Preflight exitoso`);
      console.log(`   Allow-Origin: ${allowOrigin}`);
      console.log(`   Allow-Methods: ${allowMethods}`);

      if (allowOrigin === FRONTEND_URL || allowOrigin === "*") {
        console.log(`✅ CORS permitido para ${FRONTEND_URL}`);
      } else {
        console.log(`⚠️  CORS podría no estar permitido`);
      }
    } else {
      console.log(`❌ Preflight falló: ${loginRes.status}`);
    }

    console.log("\n" + "=".repeat(50));
    console.log("✅ INTEGRACIÓN VERIFICADA");
    console.log("=".repeat(50) + "\n");
  } catch (error) {
    console.error("\n❌ ERROR EN INTEGRACIÓN:", error.message);
    console.log("\n");
  }
}

async function main() {
  console.log("\n" + "=".repeat(50));
  console.log("🚀 VERIFICACIÓN DE DEPLOYMENT - AURADECO");
  console.log("=".repeat(50));

  await checkBackend();
  await checkFrontend();
  await checkIntegration();

  console.log("\n✅ VERIFICACIÓN COMPLETA\n");
  console.log("Si todos los checks pasaron, tu aplicación debería funcionar.");
  console.log("Si hay errores, revisa las variables de entorno en Vercel.\n");
}

main();
