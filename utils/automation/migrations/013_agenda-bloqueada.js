exports.up = function (knex) {
  return knex.schema.createTable("agenda_bloqueada", function (table) {
    table.increments("agenda_id").primary();

    table.date("agenda_fecha").notNullable();

    table.time("agenda_hora_desde").notNullable();
    table.time("agenda_hora_hasta").notNullable();

    table
      .integer("company_id")
      .unsigned()
      .references("company_id")
      .inTable("companies")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table
      .integer("profesional_id")
      .unsigned()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table.string("agenda_notas").nullable();

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("agenda_bloqueada");
};
