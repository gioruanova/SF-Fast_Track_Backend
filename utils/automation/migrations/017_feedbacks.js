exports.up = function (knex) {
    return knex.schema
        .createTable("feedbacks", function (table) {
            table.increments("feedback_id").primary();

            table.integer("user_id").unsigned().notNullable();
            table
                .foreign("user_id")
                .references("user_id")
                .inTable("users")
                .onDelete("CASCADE")
                .onUpdate("CASCADE");

            table.string("user_name").notNullable();

            table.integer("company_id").unsigned().notNullable();
            table
                .foreign("company_id")
                .references("company_id")
                .inTable("companies")
                .onDelete("CASCADE")
                .onUpdate("CASCADE");

            table.string("company_name").notNullable();

            table.string("user_role").notNullable();
            table.string("user_email").notNullable();

            table.text("feedback_message").notNullable();
            table.timestamps(true, true);
        });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("feedbacks");
};
