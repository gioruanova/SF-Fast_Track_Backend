const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.seed = function (knex) {
  return knex("public_messages_categories")
    .del()
    .then(() =>
      knex("public_messages_categories").insert([
        {
          category_name: "Consultas",
          category_status: 1,
        },
        {
          category_name: "Contratacion",
          category_status: 1,
        },
        {
          category_name: "Solicitar Demo",
          category_status: 1,
        },
        {
          category_name: "Otros",
          category_status: 1,
        },
      ])
    );
};
