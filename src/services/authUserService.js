const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generateTokens, refreshAccessToken } = require("./tokenService");

async function loginUser(email, password) {
  
  const user = await User.query().findOne({ user_email: email });

  if (!user) return null;
  if (!user.user_status) return { error: "blocked" };

  let company = null;
  if (user.user_role !== "superadmin") {
    company = await user.$relatedQuery("company");
  }

  const valid = await bcrypt.compare(password, user.user_password);

  const payload = {
    user_id: user.user_id,
    user_role: user.user_role.toLowerCase(),
    company_id: company?.company_id || null,
    user_email: user.user_email,
    user_name: user.user_complete_name,
    company_name: company?.company_nombre || null,
  };

  const { accessToken, refreshToken } = generateTokens(payload);

  return {
    accessToken,
    refreshToken,
  };
}

function refreshUserToken(refreshToken) {
  try {
    const decoded = refreshAccessToken(refreshToken);
    return decoded;
  } catch {
    return null;
  }
}

module.exports = { loginUser, refreshUserToken };
