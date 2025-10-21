exports.up = function (knex) {
  return knex.schema.createTable("site_banner", function (table) {
    table.increments("baner_id").primary();
    table.string("banner_text").notNullable();
    table.timestamp("banner_limit").notNullable();
    table.boolean("banner_active").notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("site_banner");
};