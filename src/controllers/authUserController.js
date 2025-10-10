const { loginUser, refreshUserToken } = require("../services/authUserService");

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email y password son requeridos" });

    const result = await loginUser(email, password);
    if (!result)
      return res.status(401).json({ error: "Credenciales inválidas" });

    if (result.error === "blocked") {
      return res.status(403).json({ error: "Contacte a su administrador" });
    }

    // ✅ Enviar tokens en cookies HTTP-only
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 60 * 1000, // 1 minuto
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    // ✅ Extraer userData y devolver solo info pública
    const { accessToken, refreshToken, ...userData } = result;

    return res.json({
      ...userData,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

function refreshToken(req, res) {
  try {
    const tokenFromCookie = req.cookies.refreshToken;
    if (!tokenFromCookie)
      return res.status(400).json({ error: "Refresh token es requerido" });

    const tokenObject = refreshUserToken(tokenFromCookie);
    if (!tokenObject || !tokenObject.accessToken)
      return res
        .status(401)
        .json({ error: "Refresh token inválido o expirado" });

    // Solo actualizamos la cookie
    res.cookie("accessToken", tokenObject.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.json({ success: true }); // ✅ no enviamos token
  } catch {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = { login, refreshToken };
