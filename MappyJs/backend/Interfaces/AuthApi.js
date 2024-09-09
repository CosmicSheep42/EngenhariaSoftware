const bcrypt = require('bcryptjs');
const { DatabasePool } = require('../Modules/DatabaseModule');

// Função para registrar um novo usuário
async function Register(req, res) {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        res.status(400).json({ message: 'Missing fields' });
        return;
    }

    const client = await DatabasePool.connect();

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await client.query('INSERT INTO usuarios (username, password, email) VALUES ($1, $2, $3)', [username, hashedPassword, email]);

        res.status(200).json({ message: 'User registered' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    } finally {
        client.release();
    }
}

// Função de login
// Function to handle login
async function Login(req, res) {

    const { email, username, password } = req.body;

    if (!email && !username || !password) {
        res.status(400).json({ message: 'Missing fields' });
    }

    const client = await DatabasePool.connect();

    try {

        const result = await client.query('SELECT * FROM usuarios WHERE username = $1', [username.toLowerCase()]);

        if (result.rows.length === 0) {
            res.status(401).json({ message: 'No User Found' });
            return;
        }

        const User = result.rows[0];

        //Add password verification logic here
        const IsMatch = await bcrypt.compare(password, User.password);

        if (IsMatch) {
            req.session.user = { id: User.id, username: User.username, email: User.email };
            res.status(200).json({ message: 'Authentication successful' });
        } else {
            res.status(401).json({ message: 'Authentication failed' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in user' });
    } finally {
        client.release();
    }
}


// Função de logout
async function Logout(req, res) {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.status(200).redirect('/LoginPage');
}

// Exportando todas as funções
module.exports = {
    Register,
    Login,
    Logout
};
