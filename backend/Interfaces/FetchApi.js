const { DatabasePool } = require('../modules/DatabaseModule.js');

async function GetPinInfo(req, res) {
    const client = await DatabasePool.connect();

    try {
        const result = await client.query('SELECT * FROM places WHERE id = $1', [req.params.id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'No Pin Found' });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error' });
    } finally {
        client.release();
    }
}

async function GetAllPins(req, res) {
    const client = await DatabasePool.connect();

    try {
        const result = await client.query('SELECT * FROM places');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error' });
    } finally {
        client.release();
    }
}


async function IsUserAdmin(req, res) {

    const client = await DatabasePool.connect();

    try {
        const result = await client.query('SELECT adm FROM usuarios WHERE id = $1', [req.session.user.id]);

        const User = result.rows[0];

        res.status(200).json(User);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error' });
    } finally {
        client.release();
    }
}

async function GetReviews(req, res) {
    const client = await DatabasePool.connect();

    try {
        const result = await client.query('SELECT * FROM reviews WHERE place_id = $1', [req.params.id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error' });
    } finally {
        client.release();
    }
}

async function GetPinHorarioInfo(req, res) {
    const client = await DatabasePool.connect();

    try {
        const id = req.params.id; // Assuming placeId is passed as a URL parameter
        const query = `
            SELECT dia_semana, horario_abertura, horario_fechamento 
            FROM horarios_funcionamento 
            WHERE place_id = $1
        `;
        const values = [id];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'No Horarios Found' });
            return;
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching horarios' });
    } finally {
        client.release();
    }
}

async function GetCoords(req, res) {
    const client = await DatabasePool.connect();

    try {
        const result = await client.query('SELECT lat, lon FROM places WHERE nome = $1', [req.params.nome]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'No Pin Found' });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error' });
    } finally {
        client.release();
    }
}

module.exports = { GetPinInfo, GetAllPins, GetReviews, IsUserAdmin, GetPinHorarioInfo, GetCoords };
