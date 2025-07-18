const LogGlobal = require("../models/LogGlobal");

// ---------------------------------------------------------
// General log entry
// ---------------------------------------------------------
async function registrarNuevoLog(company_id, log_detalle) {
  try {
    await LogGlobal.query().insert({
      log_company_id: company_id,
      log_detalle,
      log_leido: false,
    });
  } catch (error) {
    throw error;
  }
}

// CONTROLADORES PARA CLIENT:
// ---------------------------------------------------------
// Get logs
// ---------------------------------------------------------
async function getAllLogsAsClient(req, res) {
  const company_id = req.user.company_id;
  try {
    const logs = await LogGlobal.query()
      .select("*")
      .where("log_company_id", company_id);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// ---------------------------------------------------------
// Mark all logs as read
// ---------------------------------------------------------
async function markAllLogsAsReadAsClient(req, res) {
  const company_id = req.user.company_id;
  try {
    await LogGlobal.query()
      .patch({ log_leido: true })
      .where("log_company_id", company_id);
    res.json({ message: "Logs marcados como leídos" });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// ---------------------------------------------------------
// Mark all logs as unread
// ---------------------------------------------------------
async function markAllLogsAsUnreadAsClient(req, res) {
  const company_id = req.user.company_id;
  try {
    await LogGlobal.query()
      .patch({ log_leido: false })
      .where("log_company_id", company_id);
    res.json({ message: "Logs marcados como no leídos" });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// ---------------------------------------------------------
// Delete all company logs
// ---------------------------------------------------------
async function deleteLogsAsClient(req, res) {
  const company_id = req.user.company_id;
  try {
    await LogGlobal.query().delete().where("log_company_id", company_id);
    res.json({ message: "Logs eliminados" });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}



// CONTROLADORES PARA ADMIN:
// ---------------------------------------------------------
// Get logs
// ---------------------------------------------------------
async function getAllLogsAsAdmin(req, res) {
  try {
    const logs = await LogGlobal.query().select("*");
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// ---------------------------------------------------------
// Get logs by company
// ---------------------------------------------------------
async function getAllLogsByCompanyAsAdmin(req, res) {
  try {
    const logs = await LogGlobal.query()
      .select("*")
      .where("log_company_id", req.params.company_id);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = {
  getAllLogsAsAdmin,
  registrarNuevoLog,
  getAllLogsByCompanyAsAdmin,

  getAllLogsAsClient,
  markAllLogsAsReadAsClient,
  markAllLogsAsUnreadAsClient,
  deleteLogsAsClient
};
