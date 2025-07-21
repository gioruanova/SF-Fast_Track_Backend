const Reclamo = require("../models/Reclamo");
const Company = require("../models/Company");
const Especialidad = require("../models/Especialidad");
const User = require("../models/User");
const ClienteRecurrente = require("../models/ClienteRecurrente");
const disponibilidadController = require("./disponibilidadController");
const AgendaReclamo = require("../models/AgendaReclamo");
const companyConfigController = require("./companyConfigController");

async function createReclamo(req, res) {
  const creator = req.user;
  const company_id = creator.company_id;

  const {
    reclamo_titulo,
    reclamo_detalle,
    especialidad_id,
    profesional_id,
    cliente_id,
    agenda_fecha,
    agenda_hora_desde,
    agenda_hora_hasta,
  } = req.body;

  if (
    !reclamo_titulo ||
    !reclamo_detalle ||
    !especialidad_id ||
    !cliente_id ||
    !profesional_id ||
    !agenda_fecha ||
    !agenda_hora_desde
  ) {
    return res.status(400).json({
      error:
        "Faltan datos obligatorios: reclamo_titulo, reclamo_detalle, especialidad_id, profesional_id, cliente_id, agenda_fecha, agenda_hora_desde, agenda_hora_hasta",
    });
  }

  try {
    // Validar que exista la empresa
    const company = await Company.query().findById(company_id);
    if (!company) {
      return res.status(400).json({ error: "No existe empresa bajo ese ID" });
    }

    // Valido la especialidad
    const especialidadExiste = await Especialidad.query()
      .findById(req.body.especialidad_id)
      .where("company_id", company_id);
    if (!especialidadExiste) {
      return res
        .status(400)
        .json({ error: "No existe especialidad bajo ese ID" });
    }

    // valido el profesional
    const profesionalExiste = await User.query()
      .findById(req.body.profesional_id)
      .where("user_role", "profesional")
      .where("company_id", company_id);
    if (!profesionalExiste) {
      return res
        .status(400)
        .json({ error: "No existe profesional bajo ese ID" });
    }

    // valido el cliente
    const clienteExiste = await ClienteRecurrente.query()
      .findById(req.body.cliente_id)
      .where("company_id", company_id);
    if (!clienteExiste) {
      return res.status(400).json({ error: "No existe cliente bajo ese ID" });
    }

    let new_agenda_hora_hasta = agenda_hora_hasta;

    if (!agenda_fecha || !agenda_hora_desde || !company_id || !profesional_id) {
      throw new Error("Faltan datos obligatorios");
    }

    if (agenda_hora_hasta && agenda_hora_hasta < agenda_hora_desde) {
      throw new Error("La hora hasta debe ser posterior a la hora desde");
    }

    const now = new Date();
    const fechaHoraDesde = new Date(`${agenda_fecha}T${agenda_hora_desde}`);

    if (fechaHoraDesde <= now) {
      console.log("aca");

      throw new Error("No se puede bloquear un horario en el pasado");
    }

    const requiereFechaFinal =
      await companyConfigController.fetchCompanySettingsByCompanyId(company_id);

    if (requiereFechaFinal.requiere_fecha_final && !agenda_hora_hasta) {
      throw new Error("El horario de finalizacion de la agenda es mandatorio.");
    }

    if (!agenda_hora_hasta) {
      new_agenda_hora_hasta = "23:59" + ":59";
    }

    const nuevoReclamoData = {
      reclamo_titulo,
      reclamo_detalle,
      especialidad_id,
      cliente_id,
      creado_por: creator.user_id,
      company_id,
      profesional_id,
    };

    const disponibilidad = await disponibilidadController.validarDisponibilidad(
      {
        profesional_id,
        company_id,
        agenda_fecha,
        agenda_hora_desde,
        agenda_hora_hasta: new_agenda_hora_hasta,
      }
    );
    if (!disponibilidad.disponible) {
      return res
        .status(400)
        .json({ status: 400, error: disponibilidad.motivo });
    }

    const nuevoReclamo = await Reclamo.query().insert(nuevoReclamoData);

    const agendaReclamo = await AgendaReclamo.query().insert({
      agenda_fecha,
      agenda_hora_desde,
      agenda_hora_hasta: new_agenda_hora_hasta,
      reclamo_id: nuevoReclamo.reclamo_id,
      profesional_id,
      company_id,
    });

    return res.status(201).json(nuevoReclamoData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creando reclamo" });
  }
}

async function getReclamosAsClient(req, res) {
  try {
    const companyId = req.user.company_id;
    const reclamos = await Reclamo.query()
      .where("company_id", companyId)
      .withGraphFetched(
        "[especialidad, creador, cliente, profesional, agendaReclamo]"
      );

    const resultado = reclamos.map((r) => ({
      reclamo_id: r.reclamo_id,
      nombre_especialidad: r.especialidad?.nombre_especialidad || null,
      reclamo_titulo: r.reclamo_titulo,
      reclamo_detalle: r.reclamo_detalle,

      creador: r.creador?.user_complete_name || null,

      agenda_fecha: r.agendaReclamo?.agenda_fecha,
      agenda_hora_desde: r.agendaReclamo?.agenda_hora_desde,
      agenda_hora_hasta: r.agendaReclamo?.agenda_hora_hasta,

      cliente_id: r.cliente?.cliente_id,
      cliente_complete_name: r.cliente?.cliente_complete_name,
      cliente_dni: r.cliente?.cliente_dni,
      cliente_phone: r.cliente?.cliente_phone,
      cliente_email: r.cliente?.cliente_email,
      cliente_direccion: r.cliente?.cliente_direccion,
      cliente_lat: r.cliente?.cliente_lat,
      cliente_lng: r.cliente?.cliente_lng,

      profesional: r.profesional?.user_complete_name || null,

      reclamo_estado: r.reclamo_estado,
      reclamo_nota_cierre: r.reclamo_nota_cierre,
      reclamo_presupuesto: r.reclamo_presupuesto,

      created_at: r.created_at,
      updated_at: r.updated_at,
    }));

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = {
  createReclamo,
  getReclamosAsClient,
};
