exports.seed = async function (knex) {
  await knex("especialidades").del();
  await knex.raw("ALTER TABLE especialidades AUTO_INCREMENT = 1");

  await knex("especialidades").insert([

    // ejemplo de seeder especialidad
    {
      company_id: 1000,
      nombre_especialidad: "Gasista",
    },

  ]);
};
