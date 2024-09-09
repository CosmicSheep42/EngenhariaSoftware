const { DatabasePool } = require('../Modules/DatabaseModule.js');

async function PostReview(req, res) {
    const { review, rating, id } = req.body;

    console.log(req.body);

    if (!review || !rating || !id) {
        res.status(400).json({ message: 'Missing fields' });
        return;
    }

    const client = await DatabasePool.connect();

    try {
        await client.query('BEGIN');

        const insertReviewQuery = `
            INSERT INTO reviews (texto_review, estrelas, place_id, usuario)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const reviewResult = await client.query(insertReviewQuery, [review, rating, id, req.session.user.username]);

        const updatePlaceQuery = `
            UPDATE places
            SET estrelas = (SELECT AVG(estrelas) FROM reviews WHERE place_id = $1),
                quantidade_reviews = (SELECT COUNT(*) FROM reviews WHERE place_id = $1)
            WHERE id = $1;
        `;
        await client.query(updatePlaceQuery, [id]);

        await client.query('COMMIT');

        res.status(201).json(reviewResult.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Error' });
    } finally {
        client.release();
    }
}

module.exports = { PostReview };