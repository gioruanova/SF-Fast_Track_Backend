const express = require("express");
const router = express.Router();

// middleware
const authSuperadmin = require("../middlewares/authSuperadmin");

// controllers
const authSuperController = require("../controllers/authSuperController");
const userController = require("../controllers/userController");
const companyController = require("../controllers/companyController");
const especialidadController = require("../controllers/especialidadController");

// =======================
// Rutas publicas
router.post("/login", authSuperController.login);
router.post("/refresh", authSuperController.refreshToken);

// =======================
// Middleware global para rutas protegidas
router.use(authSuperadmin);

// =======================
// Rutas protegidas
// Manejo de users
router.get("/users", userController.getUsersAsAdmin);
router.get("/users/:company_id", userController.getUsersByCompanyAsAdmin);

router.post("/users", userController.createUserAsAdmin);
// crear aca endpoint para editar usuario con logica de no poder cambiar rol (exigir nueva creacion)


router.post("/users/block/:user_id", userController.blockUserAsAdmin);
router.post("/users/unblock/:user_id", userController.unblockUserAsAdmin);
router.put("/users/restore/:user_id", userController.restoreUserAsAdmin);

// --------------------------------------------------------------------------------------------------------------
// Manejo de especialidades
router.get("/especialidades", especialidadController.getAllEspecialidadesAsAdmin);
router.get("/especialidades/:company_id", especialidadController.getAllEspecialidadesByCompanyAsAdmin);

router.post("/especialidades", especialidadController.createEspecialidadAsAdmin);
router.put("/especialidades/:especialidadId", especialidadController.updateEspecialidadAsAdmin);
// crear aca endpoint para asignar especialidad a usuario
// crear aca endpoint para editar especialidad a usuario
// crear aca endpoint para eliminar especialidad a usuario

router.put("/especialidades/block/:especialidadId", especialidadController.disableEspecialidadAsAdmin);
router.put("/especialidades/unblock/:especialidadId", especialidadController.enableEspecialidadAsAdmin);

// --------------------------------------------------------------------------------------------------------------
// Manejo de empresas
router.get("/companies", companyController.getAllCompanies);
router.post("/companies/:company_id", companyController.getCompanyById);

router.post("/companies", companyController.createCompany);
router.put("/companies/:company_id", companyController.updateCompany);

module.exports = router;


// =========================================================
// DOCUMENTACION SWAGGER

