const jwt = require("jsonwebtoken");
const Company = require("../models/Company");
const User = require("../models/User");

function authUserWithStatus({ roles = [], skipCompanyCheck = false } = {}) {
  return async function (req, res, next) {
    const token = req.cookies?.accessToken;
    if (!token) return res.status(401).json({ error: "Token no provisto" });

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(req.user.user_role)) {
        return res.status(403).json({ error: "No autorizado" });
      }

      const { company_id, user_id } = req.user;

      if (!skipCompanyCheck) {
        const company = await Company.query().findById(company_id);
        if (!company || company.company_estado !== 1) {
          return res.status(403).json({
            error: "Contacte al administrador del sistema por favor.",
          });
        }
      }

      const user = await User.query().findById(user_id);
      if (!user || user.user_status !== 1) {
        const message =
          user?.user_role === "owner"
            ? "Contacte al administrador del sistema por favor."
            : "Contacte a su empresa por favor.";
        return res.status(403).json({ error: message });
      }

      next();
    } catch {
      return res.status(401).json({ error: "Token inválido o expirado" });
    }
  };
}

module.exports = authUserWithStatus;
