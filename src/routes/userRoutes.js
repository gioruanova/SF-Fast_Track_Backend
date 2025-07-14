const express = require("express");
const router = express.Router();

// middelware para usuarios
const authUserWithStatus = require("../middlewares/authUserWithStatus");

// controladores
const authUserController = require("../controllers/authUserController");
const userController = require("../controllers/userController");
const especialidadController = require("../controllers/especialidadController");


// // utilitarios
// const exportCompanyExcel = require("../controllers/exportToExcelCompany");



// =======================
// Rutas publicas
router.post("/login", authUserController.login);
router.post("/refresh", authUserController.refreshToken);

// =======================
// Rutas protegidas
// Manejo de users
router.get("/users",authUserWithStatus("owner", "operador"),userController.getUsersAsClient);

router.post("/users",authUserWithStatus("owner", "operador"),userController.createUserAsClient);
// crear aca endpoint para editar usuario con logica de no poder cambiar rol (exigir nueva creacion)

router.post("/users/block/:user_id",authUserWithStatus("owner"),userController.blockUserAsClient);
router.post("/users/unblock/:user_id",authUserWithStatus("owner"),userController.unblockUserAsClient);
router.put("/users/restore/:user_id",authUserWithStatus("owner"),userController.restoreUserAsClient);

// --------------------------------------------------------------------------------------------------------------
// Manejo de especialidades
router.get("/especialidades",authUserWithStatus("owner", "operador"),especialidadController.getAllEspecialidades);

router.post("/especialidades",authUserWithStatus("owner"),especialidadController.createEspecialidadAsClient);
router.put("/especialidades/:especialidadId",authUserWithStatus("owner"),especialidadController.updateEspecialidadAsClient);
// crear aca endpoint para asignar especialidad a usuario
// crear aca endpoint para editar especialidad a usuario
// crear aca endpoint para eliminar especialidad a usuario

router.put("/especialidades/block/:especialidadId",authUserWithStatus("owner"),especialidadController.disableEspecialidadAsClient);
router.put("/especialidades/unblock/:especialidadId",authUserWithStatus("owner"),especialidadController.enableEspecialidadAsClient);

// --------------------------------------------------------------------------------------------------------------
// // Manejo de features especiales
// router.get("/usersReport", authUserWithStatus(),exportCompanyExcel.exportUsersByCompany);

module.exports = router;

// =========================================================
// DOCUMENTACION SWAGGER

