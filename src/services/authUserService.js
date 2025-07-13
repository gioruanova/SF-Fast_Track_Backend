const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generateTokens, refreshAccessToken } = require("./tokenService");
const userLogController = require("../controllers/userLogController");
const userController = require("../controllers/userController");

async function loginUser(email, password) {
  const user = await User.query()
    .findOne({ user_email: email })
    .withGraphFetched("company");

  if (!user) {
    // Usuario no existe
    console.log("Usuario no encontrado");
    return null;
  }

  if (!user.user_status) {
    console.log("Usuario bloqueado");
    return { error: "blocked" };
  }

  const valid = await bcrypt.compare(password, user.user_password);

  if (!valid) {
    let fallosPrevios = await userLogController.contarLogsPorUsuario(
      user.user_id
    );

    if (fallosPrevios < 3) {
      await userLogController.registrarIntentoFallido(user.user_id);
      fallosPrevios = await userLogController.contarLogsPorUsuario(
        user.user_id
      );
      return null;
    }

    fallosPrevios = await userLogController.contarLogsPorUsuario(user.user_id);

    if (fallosPrevios == 3) {
      await userController.bloquearUsuarioPorId(user.user_id);
      return { error: "blocked" };
    }
  }

  const payload = {
    user_id: user.user_id,
    user_email: user.user_email,
    user_name: user.user_complete_name,
    user_role: user.user_role,
    company_id: user.company_id,
    company_name: user.company.company_nombre,
    company_status: user.company.company_estado,
  };

  const { accessToken, refreshToken } = generateTokens(payload);

  return {
    company_name: user.company.company_nombre,
    company_id: user.company_id,
    company_status: user.company.company_estado,
    user_name: user.user_complete_name,
    user_role: user.user_role,
    user_email: user.user_email,
    accessToken,
    refreshToken,
  };
}

function refreshUserToken(refreshToken) {
  try {
    const decoded = refreshAccessToken(refreshToken);
    return decoded; // devuelve nuevo accessToken o null
  } catch {
    return null;
  }
}

module.exports = { loginUser, refreshUserToken };
