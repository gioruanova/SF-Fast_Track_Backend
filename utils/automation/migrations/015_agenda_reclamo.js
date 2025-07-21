exports.up = function (knex) {
  return knex.schema.createTable("agenda_reclamo", function (table) {
    table.increments("agenda_reclamo_id").primary();

    table.date("agenda_fecha").notNullable();

    table.time("agenda_hora_desde").notNullable();
    table.time("agenda_hora_hasta").notNullable();

    table
      .integer("reclamo_id")
      .unsigned()
      .notNullable()
      .references("reclamo_id")
      .inTable("reclamos")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table
      .integer("company_id")
      .unsigned()
      .notNullable()
      .references("company_id")
      .inTable("companies")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table
      .integer("profesional_id")
      .unsigned()
      .notNullable()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table.string("agenda_notas").defaultTo("Agenda de reclamo");

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("agenda_reclamo");
};
