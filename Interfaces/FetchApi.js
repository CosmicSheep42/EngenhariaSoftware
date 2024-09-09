const { DatabasePool } = require('../Modules/databaseModule.js');

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

module.exports = { GetPinInfo, GetAllPins, GetReviews };
