const ClienteRecurrente = require("../models/ClienteRecurrente");
const Company = require("../models/Company");

// CONTROLADORES PARA CLIENTE:
// ---------------------------------------------------------
// Obtener clientes recurrentes
// ---------------------------------------------------------
async function getAllClientesRecurrentesAsClient(req, res) {
  const company_id = req.user.company_id;
  try {
    const clientesRecurrentes = await ClienteRecurrente.query().where({
      company_id,
    });
    return res.json(clientesRecurrentes);
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

// ---------------------------------------------------------
// Crear cliente recurrente
// ---------------------------------------------------------

async function createClienteRecurrenteAsClient(req, res) {
  const company_id = req.user.company_id;
  const {
    cliente_complete_name,
    cliente_dni,
    cliente_phone,
    cliente_email,
    cliente_direccion,
    cliente_lat,
    cliente_lng,
  } = req.body;

  try {
    const company = await Company.query().findById(company_id);
    if (!company) {
      return res.status(400).json({ error: "No existe empresa bajo ese ID" });
    }
    const requiredFields = [
      "cliente_complete_name",
      "cliente_dni",
      "cliente_phone",
      "cliente_email",
      "cliente_direccion",
    ];
    const missingField = requiredFields.find((field) => !req.body[field]);
    if (missingField) {
      return res
        .status(400)
        .json({ error: `El campo ${missingField} es obligatorio.` });
    }
    // valido coordenadas
    if (cliente_lat === undefined || cliente_lng === undefined) {
      return res
        .status(400)
        .json({ error: "Las coordenadas lat y lng son obligatorias." });
    }

    const clienteExiste = await ClienteRecurrente.query()
      .where("company_id", company_id)
      .andWhere((builder) => {
        builder
          .where("cliente_dni", cliente_dni)
          .orWhere("cliente_email", cliente_email);
      })
      .first();

    if (clienteExiste) {
      return res
        .status(400)
        .json({ error: "Ya existe un cliente recurrente con ese DNI o email" });
    }

    const clienteRecurrente = await ClienteRecurrente.query().insertAndFetch({
      company_id,
      cliente_complete_name,
      cliente_dni,
      cliente_phone,
      cliente_email,
      cliente_direccion,
      cliente_lat,
      cliente_lng,
    });

    return res.status(200).json({
      success: true,
      message: "Cliente recurrente creado correctamente",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = {
  getAllClientesRecurrentesAsClient,
  createClienteRecurrenteAsClient,
};
