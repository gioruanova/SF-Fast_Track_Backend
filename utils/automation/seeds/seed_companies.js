exports.seed = async function (knex) {
  await knex("companies").del();
  await knex.raw("ALTER TABLE companies AUTO_INCREMENT = 1000");

  await knex("companies").insert([
    {
      company_unique_id: "123456789",
      company_nombre: "Consorcio Belgrano",
      company_phone: "1112345678",
      company_whatsapp: "+541112345678",
      company_telegram: "+541112345678",
      company_email: "contacto@consorciobelgrano.com",
      company_estado: true,
      limite_operadores: 3,
      limite_profesionales: 15,
      limite_especialidades:10,
      reminder_manual: 1
    },
    
    {
      company_unique_id: "987654321",
      company_nombre: "Servicios Integrales SA",
      company_phone: "1198765432",
      company_whatsapp: "+541198765432",
      company_telegram: "+541198765432",
      company_email: "contacto@serviciosintegrales.com",
      company_estado: true,
      limite_operadores: 3,
      limite_profesionales: 15,
      limite_especialidades:10,
      reminder_manual: 1
    },
    {
      company_unique_id: "564738291",
      company_nombre: "Publicidad Ramirez",
      company_phone: "1145678901",
      company_whatsapp: "+541145678901",
      company_telegram: "+541145678901",
      company_email: "contacto@mantenimientoysoluciones.com",
      company_estado: true,
      limite_operadores: 3,
      limite_profesionales: 6,
      limite_especialidades:5,
      reminder_manual: 1
    }
    
  ]);
};

