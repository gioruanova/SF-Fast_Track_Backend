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
          cliente_complete_name: "Universidad Da vinci",
          cliente_dni: "123456",
          cliente_phone: "123456789",
          cliente_email: "cliente-1@gmailcom",
          cliente_direccion: "Av. Corrientes 2037, Caba, CP: 1045",
          cliente_lat: -34.604302546035875,
          cliente_lng: -58.396008763217424,
          company_id: 1000,
        },
      ])
    );
};
