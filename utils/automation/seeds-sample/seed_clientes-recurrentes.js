const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.seed = function (knex) {
  return knex("clientes_recurrentes")
    .del()
    .then(() =>
      knex.raw("ALTER TABLE clientes_recurrentes AUTO_INCREMENT = 9000")
    )
    .then(() =>
      knex("clientes_recurrentes").insert([
        {

          // ejemplo de seeder cliente
          cliente_complete_name: "Nombre cliente",
          cliente_dni: "1111111",
          cliente_phone: "1111111",
          cliente_email: "cliente@emailcom",
          cliente_direccion: "calle + numero + , + ciudad + , + provincia + , + pais",
          company_id: 1000,
        },
        //  ....
      ])
    );
};
