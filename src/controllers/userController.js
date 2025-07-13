const User = require("../models/User");
const Company = require("../models/Company");
const companyController = require("./companyController");
const userLogController = require("./userLogController");
const especialidadController = require("./especialidadController");
const bcrypt = require("bcrypt");
// const { transaction } = require("objection");
const saltRounds = 10;

async function getAll(req, res) {
  try {
    const users = await User.query()
      .select(
        "user_id",
        "user_complete_name",
        "user_dni",
        "user_phone",
        "user_email",
        "user_role",
        "user_status",
        "company_id",
        "created_at",
        "updated_at"
      )
      .withGraphFetched("especialidades.Especialidad(selectNombreEspecialidad)")
      .modifiers({
        selectNombreEspecialidad(builder) {
          builder.select("nombre_especialidad");
        },
      });

    return res.json(users);
  } catch (error) {
    // console.error("Error al obtener usuarios:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function getUsersByCompany(req, res) {
  const companyId = req.user.company_id;

  try {
    const users = await User.query()
      .select(
        "user_id",
        "user_complete_name",
        "user_dni",
        "user_phone",
        "user_email",
        "user_role",
        "user_status",
        "company_id",
        "created_at",
        "updated_at"
      )
      .where("company_id", companyId)
      .withGraphFetched("especialidades.Especialidad(selectNombreEspecialidad)")
      .modifiers({
        selectNombreEspecialidad(builder) {
          builder.select("nombre_especialidad");
        },
      });

    res.json(users);
  } catch (error) {
    // console.error("Error al obtener usuarios por empresa:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function bloquearUsuarioPorId(user_id) {
  return await User.query().patchAndFetchById(user_id, { user_status: false });
}

async function habilitarUsuarioPorId(user_id) {
  await userLogController.deleteLogByYserid(user_id);
  return await User.query().patchAndFetchById(user_id, { user_status: true });
}

async function restoreUser(req, res) {
  try {
    const { user_id } = req.params;

    habilitarUsuarioPorId(user_id);
    return res
      .status(200)
      .json({ success: true, message: "Usuario restaurado correctamente" });
  } catch (error) {
    // console.error("Error al restaurar usuario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

// ---------------------------------------------------------
// Metodo unificado para crear usuario
// ---------------------------------------------------------
async function createUser(req, res) {
  const creator = req.user;
  let limiteOperadores;
  let currentTotalOperadores;

  let limiteProfesionales;
  let currentTotalProfesionales;

  const {
    user_complete_name,
    user_dni,
    user_phone,
    user_email,
    user_password,
    user_role,
  } = req.body;

  let company_id;

  try {
    if (creator.user_role === "superadmin") {
      company_id = req.body.company_id;
      const company = await Company.query().findById(company_id);

      if (!company) {
        return res.status(400).json({ error: "No existe empresa bajo ese ID" });
      }
    } else {
      company_id = creator.company_id;

      const company = await Company.query().findById(company_id);
      if (!company) {
        return res
          .status(400)
          .json({ error: "Tu empresa no existe en el sistema" });
      }

      if (!canCreateRole(creator.user_role, user_role)) {
        return res
          .status(403)
          .json({ error: "No tenés permiso para crear este tipo de usuario" });
      }
    }

    limiteOperadores = await companyController.getLimitOperator(company_id);
    limiteProfesionales = await companyController.getLimitProfesionales(
      company_id
    );

    currentTotalOperadores = await getCurrentTotalOperadores(company_id);
    currentTotalProfesionales = await getCurrentTotalProfesionales(company_id);

    if (creator.user_role != "superadmin") {
      if (
        user_role == "operador" &&
        currentTotalOperadores >= limiteOperadores
      ) {
        return res
          .status(400)
          .json({ error: "Limite de operadores alcanzado" });
      }

      if (
        user_role == "profesional" &&
        currentTotalProfesionales >= limiteProfesionales
      ) {
        return res
          .status(400)
          .json({ error: "Limite de profesionales alcanzado" });
      }
    }

    const existingUser = await User.query().findOne({ user_email });
    if (existingUser) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }
    let especialidad = false;

    if (user_role == "profesional") {
      if (!req.body.especialidad) {
        return res.status(400).json({ error: "La especialidad es requerida" });
      } else {
        const especialidadExiste =
          await especialidadController.validarEspecialidad(
            req.body.especialidad,
            company_id
          );
        if (!especialidadExiste) {
          return res
            .status(400)
            .json({ error: "La especialidad NO existe en esta empresa" });
        } else {
          especialidad = true;
        }
      }
    }

    const newUser = await User.query().insert({
      user_complete_name,
      user_dni,
      user_phone,
      user_email,
      user_password: bcrypt.hashSync(user_password, saltRounds),
      user_role,
      company_id,
    });

    if (especialidad) {
      await especialidadController.addNewEspecialidadProfesional(
        newUser.user_id,
        req.body.especialidad,
        company_id
      );
    }

    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creando usuario:", error);
    return res.status(500).json({ error: "Error al crear usuario" });
  }
}

// ---------------------------------------------------------
// metodo para actualizar usuario
// ---------------------------------------------------------

async function updateUserBySuperadmin(req, res) {
  const userIdToUpdate = parseInt(req.params.user_id, 10);

  try {
    // Obtener usuario actual
    const user = await User.query().findById(userIdToUpdate);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Preparar campos para actualizar solo si llegan en req.body
    const fieldsToUpdate = {};
    const allowedFields = [
      "user_complete_name",
      "user_dni",
      "user_phone",
      "user_email",
      "user_password",
      "user_role",
      "user_status",
      "company_id",
      "especialidad",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = req.body[field];
      }
    }

    // Validar email duplicado si se actualiza
    if (fieldsToUpdate.user_email) {
      const emailInUse = await User.query()
        .where("user_email", fieldsToUpdate.user_email)
        .whereNot("user_id", userIdToUpdate)
        .first();
      if (emailInUse) {
        return res.status(400).json({ error: "El email ya está registrado" });
      }
    }

    // Hashear password si se actualiza
    if (fieldsToUpdate.user_password) {
      fieldsToUpdate.user_password = bcrypt.hashSync(
        fieldsToUpdate.user_password,
        saltRounds
      );
    }

    // Validar company_id si se actualiza
    if (fieldsToUpdate.company_id) {
      const companyExists = await Company.query().findById(
        fieldsToUpdate.company_id
      );
      if (!companyExists) {
        return res.status(400).json({ error: "La empresa asignada no existe" });
      }
    }

    // Validar user_role si se actualiza
    if (fieldsToUpdate.user_role) {
      if (!canCreateRole("superadmin", fieldsToUpdate.user_role)) {
        return res.status(403).json({ error: "Rol no permitido" });
      }
    }

    // Validar especialidad si es profesional y se envía
    let especialidad = false;
    if (
      fieldsToUpdate.user_role === "profesional" ||
      user.user_role === "profesional"
    ) {
      const especialidadId =
        fieldsToUpdate.especialidad ?? req.body.especialidad;
      if (especialidadId) {
        const especialidadValida =
          await especialidadController.validarEspecialidad(
            especialidadId,
            fieldsToUpdate.company_id || user.company_id
          );
        if (!especialidadValida) {
          return res
            .status(400)
            .json({ error: "La especialidad no existe en esta empresa" });
        }
        especialidad = true;
      }
    }

    // Remover especialidad de fieldsToUpdate porque no es campo directo
    delete fieldsToUpdate.especialidad;
    // Actualizar usuario
    const updatedUser = await User.query().patchAndFetchById(
      userIdToUpdate,
      fieldsToUpdate
    );

    // Actualizar o insertar especialidad si corresponde
    if (especialidad) {
      // Primero, eliminar relaciones anteriores
      await especialidadController.eliminarEspecialidadesPorUsuario(
        userIdToUpdate
      );

      // Insertar nueva relación
      await especialidadController.addNewEspecialidadProfesional(
        userIdToUpdate,
        req.body.especialidad,
        fieldsToUpdate.company_id || updatedUser.company_id
      );
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    return res.status(500).json({ error: "Error al actualizar usuario" });
  }
}

function canCreateRole(creatorRole, newUserRole) {
  const permissions = {
    superadmin: ["superadmin", "owner", "operador", "profesional"],
    owner: ["operador", "profesional"],
    operador: ["profesional"],
  };
  return permissions[creatorRole]?.includes(newUserRole);
}

async function getCurrentTotalOperadores(company_id) {
  const result = await User.query()
    .where({ company_id, user_role: "operador" })
    .count()
    .first();

  return parseInt(result["count(*)"], 10);
}

async function getCurrentTotalProfesionales(company_id) {
  const result = await User.query()
    .where({ company_id, user_role: "profesional" })
    .count()
    .first();

  return parseInt(result["count(*)"], 10);
}

module.exports = {
  getAll,
  getUsersByCompany,
  createUser,
  bloquearUsuarioPorId,
  habilitarUsuarioPorId,
  restoreUser,
  updateUserBySuperadmin,
};
