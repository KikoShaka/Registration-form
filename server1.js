const http = require('http');
const url = require('url');
const mysql = require('mysql');
const nodemailer = require('nodemailer');

// Настройте nodemailer транспорт
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kirilpit777@gmail.com',
        pass: 'csro mhkw muga ltnd' // Използвайте реалната парола или App парола тук
    }
});

// Функция за изпращане на имейл за верификация
function sendVerificationEmail(email) {
    const mailOptions = {
        from: 'kirilpit777@gmail.com',
        to: email,
        subject: 'Account Verification',
        text: 'Thank you for registering! Please verify your account.'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.error('Email send error:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

// Свързване с MySQL базата данни
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'freerunbg69',
    database: 'users'
});

connection.connect(function(err) {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('MySQL connected as id ' + connection.threadId);
});

// Създаване на HTTP сървъра
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
 
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
    const method = req.method.toUpperCase();

    //CHAT GPTT CRUD2

    if (trimmedPath === 'users' && method === 'GET') {
        connection.query('SELECT * FROM user', (error, results) => {
            if (error) {
                res.writeHead(500);
                res.end('Server error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        });
    }

    // Update - Обновяване на потребителски данни
    else if (trimmedPath === 'users' && method === 'PUT') {
        // Вашият код за обновяване на потребител тук
        let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const { id, email, name, password } = JSON.parse(body);
        const updateQuery = 'UPDATE user SET email = ?, name = ?, password = ? WHERE id = ?';

        connection.query(updateQuery, [email, name, password, id], (error) => {
            if (error) {
                res.writeHead(500);
                res.end('Server error');
                return;
            }
            res.writeHead(200);
            res.end('User updated successfully');
        });
    });
    }

    // Delete - Изтриване на потребител
    else if (trimmedPath.startsWith('users/') && method === 'DELETE') {
        // Вашият код за изтриване на потребител тук
        const id = trimmedPath.split('/')[1];
        const deleteQuery = 'DELETE FROM user WHERE id = ?';
    
        connection.query(deleteQuery, [id], (error) => {
            if (error) {
                res.writeHead(500);
                res.end('Server error');
                return;
            }
            res.writeHead(200);
            res.end('User deleted successfully');
        });
    }

    //!!!!!!!!!!!!!!!!!!!!!!!


    // Обработка на регистрация
    if (trimmedPath === 'register' && method === 'POST') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const { email, name, password } = JSON.parse(body);
                const checkUserQuery = 'SELECT * FROM user WHERE email = ? OR name = ?';
                
                connection.query(checkUserQuery, [email, name], (error, results) => {
                    if (error) {
                        res.writeHead(500);
                        res.end('Server error');
                        return;
                    }

                    if (results.length > 0) {
                        res.writeHead(409);
                        res.end('User already exists.');
                        return;
                    }

                    const insertQuery = 'INSERT INTO user (email, name, password) VALUES (?, ?, ?)';
                    connection.query(insertQuery, [email, name, password], (error, results) => {
                        if (error) {
                            res.writeHead(500);
                            res.end('Server error');
                            return;
                        }
                        
                        sendVerificationEmail(email);
                        res.writeHead(200);
                        res.end('User registered successfully');
                    });
                });
            } catch (error) {
                res.writeHead(400);
                res.end('Bad Request: Invalid JSON');
            }
        });
    } 
    // Обработка на вход
    else if (trimmedPath === 'login' && method === 'POST') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const { email, password } = JSON.parse(body);
                const loginQuery = 'SELECT * FROM user WHERE email = ? AND password = ?';

                connection.query(loginQuery, [email, password], (error, results) => {
                    if (error) {
                        res.writeHead(500);
                        res.end('Server error');
                        return;
                    }

                    if (results.length > 0) {
                        res.writeHead(200);
                        res.end('Login successful');
                    } else {
                        res.writeHead(401);
                        res.end('Login failed');
                    }
                });
            } catch (error) {
                res.writeHead(400);
                res.end('Bad Request: Invalid JSON');
            }
        });
    } 

    //CHAT GPT CRUD !!!!!!!!!!!!!!!!!!!!
    // Обработка на обновяване на потребител
    

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // Несъществуващ път
    else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

// Стартиране на сървъра
server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
