const AgendaReclamo = require("../models/AgendaReclamo");



async function getAgendaReclamo(req, res) {
    const companyId = req.user.company_id;

    try {
        const agendaReclamo = await AgendaReclamo.query()
            .select(
                'agenda_reclamo.profesional_id',
                'reclamos.especialidad_id',
                'agenda_reclamo.agenda_fecha',
                'agenda_reclamo.agenda_hora_desde',
                'agenda_reclamo.agenda_hora_hasta'
            )
            .join('reclamos', 'agenda_reclamo.reclamo_id', 'reclamos.reclamo_id')
            .where('agenda_reclamo.company_id', companyId);
        
        return res.json(agendaReclamo);
    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}


module.exports = {
    getAgendaReclamo,
}