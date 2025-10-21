exports.seed = function (knex) {
  return knex("site_banner")
    .del()
    .then(() => knex.raw("ALTER TABLE site_banner AUTO_INCREMENT = 1"))
    .then(() =>
      knex("site_banner").insert([
        {
          banner_text:
            "Fast Track se encuentra en proceso de construccion. Disculpe las molestias durante este proceso",
          banner_limit: "2025-12-31 00:00:00",
        },
        {
          banner_text: "Banner de prueba",
          banner_limit: "2025-12-31 00:00:00",
          banner_active: false,
        },
      ])
    );
};
