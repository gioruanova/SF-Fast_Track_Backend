exports.seed = async function (knex) {
  await knex("companies").del();
  await knex.raw("ALTER TABLE companies AUTO_INCREMENT = 1000");

  await knex("companies").insert([
    {

      // ejemplo de seeder empresa
      company_unique_id: "1111111",
      company_nombre: "Nombre empresa",
      company_phone: "1111111",
      company_whatsapp: "1111111",
      company_telegram: "1111111",
      company_email: "empresa@email.com",
      company_estado: true,
      limite_operadores: 3,
      limite_profesionales: 15,
      limite_especialidades: 10,
      reminder_manual: 1
    },

  ]);
};
