exports.up = function (knex) {
  return knex.schema.createTable("public_messages", function (table) {
    table.increments("message_id").primary();
    table.string("message_email").notNullable();
    table.string("message_phone").notNullable();
    table.text("message_content", "longtext").notNullable();

    // Ya no tiene FOREIGN KEY ni restricciones
    table.integer("category_id").unsigned().notNullable();
    table.string("category_original").notNullable();

    table.boolean("message_read").notNullable().defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("public_messages");
};
