const http = require('http');
const url = require('url');
const mysql = require('mysql');
const nodemailer = require('nodemailer');

const bcrypt = require('bcrypt');

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

    if (trimmedPath === 'user' && method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { name, email } = JSON.parse(body);
            // Добавете логика за създаване на потребител
        });
    }
    
    // Четене на потребители
    else if (trimmedPath === 'user' && method === 'GET') {
        // Добавете логика за извличане на всички потребители
    }
    
    // Обновяване на потребител
    else if (trimmedPath.startsWith('user/') && method === 'PUT') {
        const id = trimmedPath.split('/')[1];
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { name, email } = JSON.parse(body);
            // Добавете логика за обновяване на потребител
        });
    }
    
    // Изтриване на потребител
    else if (trimmedPath.startsWith('user/') && method === 'DELETE') {
        const id = trimmedPath.split('/')[1];
        // Добавете логика за изтриване на потребител
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
    
                // Хеширане на паролата преди запазването ѝ в базата данни
                bcrypt.hash(password, 10, function(err, hashedPassword) {
                    if (err) {
                        res.writeHead(500);
                        res.end('Error hashing password');
                        return;
                    }
    
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
                        connection.query(insertQuery, [email, name, hashedPassword], (error) => {
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
                console.log('Login attempt:', email);
    
                const loginQuery = 'SELECT * FROM user WHERE email = ?';
    
                connection.query(loginQuery, [email], (error, results) => {
                    if (error) {
                        console.error('Database query error:', error);
                        res.writeHead(500);
                        res.end('Server error');
                        return;
                    }
    
                    if (results.length > 0) {
                        const user = results[0];
                        console.log('User found:', user);
                        console.log('Hashed password from DB:', user.Password);

                         // Проверка дали има хеширана парола за този потребител
                         if (!user.Password) {
                              res.writeHead(500);
                              res.end('Server error: No password set for user');
                              return;
                         }
    
                        bcrypt.compare(password, user.Password, function(err, isMatch) {
                            if (err) {
                                console.error('bcrypt error:', err);
                                res.writeHead(500);
                                res.end('Error during password comparison');
                                return;
                            }
    
                            if (isMatch) {
                                res.writeHead(200);
                                res.end('Login successful');
                            } else {
                                res.writeHead(401);
                                res.end('Login failed: Incorrect password');
                            }
                        });
                    } else {
                        res.writeHead(401);
                        res.end('Login failed: User not found');
                    }
                });
            } catch (error) {
                console.error('Request parsing error:', error);
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
