const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.seed = function (knex) {
  return knex("users")
    .del()
    .then(() => knex.raw("ALTER TABLE users AUTO_INCREMENT = 1000"))
    .then(() =>
      knex("users").insert([
        // ejemplo de seeder usuarios
        // se recomienda comenzar con superadmin y luego agregar los otros roles
        {
          user_complete_name: "ejemplo superadmin",
          user_email: "superadmin@email.com",
          user_dni: "11111111",
          user_phone: "11111111",
          user_role: "superadmin",
          user_password: bcrypt.hashSync("Superfast1-2026", saltRounds),
          user_status: true,
          company_id: null, // null para superadmin
        },
      
      ])
    );
};
