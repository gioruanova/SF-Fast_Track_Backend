const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.seed = function (knex) {
  return knex("users")
    .del()
    .then(() => knex.raw("ALTER TABLE users AUTO_INCREMENT = 1000"))
    .then(() =>
      knex("users").insert([
        {
          user_complete_name: "Jorge Ruanova",
          user_email: "jruanova.dev@gmail.com",
          user_dni: "123456",
          user_phone: "123456789",
          user_role: "superadmin",
          user_password: bcrypt.hashSync("123456", saltRounds),
          user_status: true,
        },
        {
          user_complete_name: "Luis Gomez -owner",
          user_email: "owner@gmail.com",
          user_dni: "12123123",
          user_phone: "+541123456789",
          user_role: "owner",
          user_password: bcrypt.hashSync("123456", saltRounds),
          user_status: true,
          company_id: 1000,
        },
        {
          user_complete_name: "Carlos Perez - owner",
          user_email: "owner-2@gmail.com",
          user_dni: "45456456",
          user_phone: "+541198765432",
          user_role: "owner",
          user_password: bcrypt.hashSync("123456", saltRounds),
          user_status: true,
          company_id: 1001,
        },
        {
          user_complete_name: "Pedro Pascal -operador",
          user_email: "operador-1@gmail.com",
          user_dni: "78789789",
          user_phone: "+541112233445",
          user_role: "operador",
          user_password: bcrypt.hashSync("123456", saltRounds),
          user_status: true,
          company_id: 1000,
        },
        {
          user_complete_name: "Ana Torres -operador",
          user_email: "operador-2@gmail.com",
          user_dni: "65654654",
          user_phone: "+541198765432",
          user_role: "operador",
          user_password: bcrypt.hashSync("123456", saltRounds),
          user_status: true,
          company_id: 1000,
        },
        {
          user_complete_name: "Damian Suarez - profesional",
          user_email: "profesional-2@gmail.com",
          user_dni: "85854854",
          user_phone: "+541123123123",
          user_role: "profesional",
          user_password: bcrypt.hashSync("123456", saltRounds),
          user_status: true,
          company_id: 1000,
        },
        {
          user_complete_name: "Marcos Perez - profesional",
          user_email: "profesional-1@gmail.com",
          user_dni: "78789789",
          user_phone: "+541112233445",
          user_role: "profesional",
          user_password: bcrypt.hashSync("123456", saltRounds),
          user_status: true,
          company_id: 1000,
        },
        {
          user_complete_name: "Armando Cosas - profesional",
          user_email: "profesional-3@gmail.com",
          user_dni: "78789789",
          user_phone: "+541112233445",
          user_role: "profesional",
          user_password: bcrypt.hashSync("123456", saltRounds),
          user_status: true,
          company_id: 1000,
        },
      ])
    );
};
