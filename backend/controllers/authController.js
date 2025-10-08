const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar datos
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Por favor proporciona usuario y contraseña" });
    }

    // Buscar usuario
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Verificar contraseña
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Generar token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// @desc    Obtener usuario actual
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// @desc    Crear nuevo usuario admin (solo superadmin)
// @route   POST /api/auth/register
// @access  Private/SuperAdmin
const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Validar que solo superadmin pueda crear usuarios
    if (req.user.role !== "superadmin") {
      return res
        .status(403)
        .json({ message: "No tienes permisos para crear usuarios" });
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Crear usuario
    const user = await User.create({
      username,
      password,
      role: role || "admin",
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = { login, getMe, register };
