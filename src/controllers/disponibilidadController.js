const AgendaBloqueada = require("../models/AgendaBloqueada");
const AgendaReclamo = require("../models/AgendaReclamo");

async function getDisponibilidadBloqueadaByProfesioanlAsAdmin(req, res) {
  const companyId = req.user.company_id;
  const userId = req.params.user_id;

  try {
    // Traer bloqueos manuales
    const bloqueosManuales = await AgendaBloqueada.query()
      .where("company_id", companyId)
      .andWhere("profesional_id", userId);

    // Traer reclamos agendados (ya validados)
    const bloqueosPorReclamo = await AgendaReclamo.query()
      .where("company_id", companyId)
      .andWhere("profesional_id", userId);

    // Unir resultados
    const bloqueos = [
      ...bloqueosManuales.map((b) => ({
        origen: "manual",
        fecha: b.agenda_fecha,
        desde: b.agenda_hora_desde,
        hasta: b.agenda_hora_hasta,
      })),
      ...bloqueosPorReclamo.map((b) => ({
        origen: "reclamo",
        fecha: b.agenda_fecha,
        desde: b.agenda_hora_desde,
        hasta: b.agenda_hora_hasta,
      })),
    ];

    return res.status(200).json({ bloqueos });
  } catch (error) {
    console.error("Error obteniendo disponibilidad bloqueada:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function validarDisponibilidad({
  profesional_id,
  company_id,
  agenda_fecha,
  agenda_hora_desde,
  agenda_hora_hasta,
}) {
  if (!agenda_fecha || !agenda_hora_desde || !agenda_hora_hasta) {
    throw new Error("Faltan datos obligatorios para validar disponibilidad");
  }

  // Chequeo cruce en AgendaBloqueada
  const bloqueoExistente = await AgendaBloqueada.query()
    .where("profesional_id", profesional_id)
    .andWhere("company_id", company_id)
    .andWhere("agenda_fecha", agenda_fecha)
    .andWhere((qb) => {
      qb.where("agenda_hora_desde", "<", agenda_hora_hasta).andWhere(
        "agenda_hora_hasta",
        ">",
        agenda_hora_desde
      );
    })
    .first();

  if (bloqueoExistente) {
    return { disponible: false, motivo: "Bloqueo existente en AgendaBloqueada" };
  }

  // Chequeo cruce en AgendaReclamo
  const reclamoExistente = await AgendaReclamo.query()
    .where("profesional_id", profesional_id)
    .andWhere("company_id", company_id)
    .andWhere("agenda_fecha", agenda_fecha)
    .andWhere((qb) => {
      qb.where("agenda_hora_desde", "<", agenda_hora_hasta).andWhere(
        "agenda_hora_hasta",
        ">",
        agenda_hora_desde
      );
    })
    .first();

  if (reclamoExistente) {
    return { disponible: false, motivo: "Bloqueo existente en AgendaReclamo" };
  }

  return { disponible: true };
}

module.exports = {
  getDisponibilidadBloqueadaByProfesioanlAsAdmin,

  validarDisponibilidad,
};
