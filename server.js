// const express = require('express');
// const session = require('express-session');
// const bodyParser = require('body-parser');
// const multer = require('multer');
// const mysql = require('mysql2');
// const fs = require('fs');
// const cors = require('cors');
// const morgan = require('morgan');
// const crypto = require('crypto');


// const app = express();
// const port = 3002;



// const secretKey = crypto.randomBytes(64).toString('hex');
// console.log(secretKey);

// // Multer setup for handling file uploads
// const upload = multer({ dest: 'uploads/' });

// // Middleware setup
// app.use(bodyParser.json({ limit: '1mb' }));
// app.use(bodyParser.urlencoded({ extended: true }));
// // app.use(session({
// //     secret: 'secretKey',
// //     resave: false,
// //     saveUninitialized: true
// // }));

// app.use(session({
//     secret: 'your-secret-key',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         secure: false, // set this to true for HTTPS only
//         httpOnly: true,
//         sameSite:'Lax',
//         domain : '192.168.29.36'

//     }
// }));

// const corsOptions = {
//     credentials: true,
//     origin: ['http://localhost:3002', 'http://localhost:80'] // Whitelist the domains you want to allow
// };


// // Middleware to check if the user is authenticated
// function isAuthenticated(req, res, next) {
//     if (!req.session.user) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }
//     next();
//     console.log("User:",req.session.user);
// }

// // Use Morgan for logging
// app.use(morgan('dev')); 
// app.use(cors(corsOptions));

// // MySQL connection setup
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'user_management_db'
// });

// // Connect to MySQL
// db.connect(err => {
//     if (err) {
//         console.error('Error connecting to database:', err);
//         return;
//     }
//     console.log('MySQL connected...');
// });

// // Register endpoint
// app.post('/register', (req, res) => {
//     const { username, password } = req.body;

//     console.log("Request:",req.body);

//     // Check if username already exists
//     // const checkUsernameQuery = `SELECT * FROM users WHERE username = ?`;
//     // db.execute(checkUsernameQuery, [username], (err, result) => {
//     //     if (err) {
//     //         return res.status(500).json({ error: err });
//     //     }

//     //     if (result.length > 0) {
//     //         return res.status(400).json({ error: 'Username already exists' });
//     //     }
//     // });


//     // Insert user into 'users' table
//     const insertUserQuery = `INSERT INTO users (username, password) VALUES (?, ?)`;
//     db.execute(insertUserQuery, [username, password], (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: err });
//         }

        
//         const userId = result.insertId;

//         // Insert default user profile into 'user_profiles' table
//         const insertProfileQuery = `INSERT INTO user_profiles (user_id, name, preferred_role, project, education, address, phone_no, linkedin_profile, image)
//                                     VALUES (?, '', '', '', '', '', '', '', '')`;
//         db.execute(insertProfileQuery, [userId], (err, result) => {
//             if (err) {
//                 return res.status(500).json({ error: err });
//             }
            
//             res.status(201).json({ message: 'User registered successfully' });
//         });
//     });
// });


// // Login endpoint
// app.post('/login', (req, res) => {
//     const { username, password } = req.body;

//     console.log("Request:",req.body);

//     // Check credentials in 'users' table
//     const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
//     db.execute(query, [username, password], (err, results) => {
//         if (err) {
//             return res.status(500).json({ error: err });
//         }

//         if (results.length === 0) {
//             return res.status(401).json({ message: 'Authentication failed' });
//         }

//         const user = results[0];
//         req.session.user = user; // Setting session user
//         res.status(200).json({ message: 'Login successful' });
//     });
// });


// // Logout endpoint
// app.post('/logout',(req, res) => {
//     req.session.destroy(err => {
//         if (err) {
//             return res.status(500).json({ error: 'Failed to logout' });
//         }
        
//         res.clearCookie('connect.sid');
//         res.status(200).json({ message: 'Logout successful' });
//     });
// });

// // Profile creation/update endpoint with image upload
// app.post('/profile',isAuthenticated, upload.single('image'), (req, res) => {
//     const { name, preferred_role, project, education, address, phone_no, linkedin_profile } = req.body;
//     console.log("Request:",req.body);
//     const userId = req.session.user.id; // Assuming user is logged in and session is active

    
//     // Read image file and prepare for database insertion
//     const imageFile = req.file;
//     let imageBuffer = null;
//     if (imageFile) {
//         imageBuffer = fs.readFileSync(imageFile.path);
//     }

//     // Update or insert profile into 'user_profiles' table
//     const upsertQuery = `INSERT INTO user_profiles (user_id, name, preferred_role, project, education, address, phone_no, linkedin_profile, image)
//                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//                          ON DUPLICATE KEY UPDATE name = VALUES(name), preferred_role = VALUES(preferred_role), project = VALUES(project),
//                                                  education = VALUES(education), address = VALUES(address), phone_no = VALUES(phone_no),
//                                                  linkedin_profile = VALUES(linkedin_profile), image = VALUES(image)`;
//     db.execute(upsertQuery, [userId, name, preferred_role, project, education, address, phone_no, linkedin_profile, imageBuffer], (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: err });
//         }

//         res.status(200).json({ message: 'Profile updated successfully' });
//     });
// });

// // Delete user profile endpoint
// app.delete('/profile', isAuthenticated, (req, res) => {
//     const userId = req.session.user.id; // Assuming user is logged in and session is active

//     // Delete profile details from 'user_profiles' table
//     const deleteQuery = `DELETE FROM user_profiles WHERE user_id = ?`;
//     db.execute(deleteQuery, [userId], (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: err });
//         }

//         res.status(200).json({ message: 'Profile deleted successfully' });
//     });
// });


// // Profile update endpoint with optional image upload
// app.put('/profile', isAuthenticated, upload.single('image'), (req, res) => {
//     const { name, preferred_role, project, education, address, phone_no, linkedin_profile } = req.body;
//     const userId = req.session.user.id; // Assuming user is logged in and session is active

//     // Read image file if provided and prepare for database insertion
//     const imageFile = req.file;
//     let imageBuffer = null;
//     if (imageFile) {
//         imageBuffer = fs.readFileSync(imageFile.path);
//     }

//     // Update profile details in 'user_profiles' table
//     const updateQuery = `UPDATE user_profiles SET name = ?, preferred_role = ?, project = ?, education = ?, address = ?, phone_no = ?, linkedin_profile = ?, image = ? WHERE user_id = ?`;
//     db.execute(updateQuery, [name, preferred_role, project, education, address, phone_no, linkedin_profile, imageBuffer, userId], (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: err });
//         }

//         res.status(200).json({ message: 'Profile updated successfully' });
//     });
// });

// // Get user profile endpoint
// app.get('/profile', isAuthenticated, (req, res) => {
//     const userId = req.session.user.id; // Assuming user is logged in and session is active

//     // Query user profile data from 'user_profiles' table
//     const query = `SELECT * FROM user_profiles WHERE user_id = ?`;
//     db.execute(query, [userId], (err, results) => {
//         if (err) {
//             return res.status(500).json({ error: err });
//         }

//         if (results.length === 0) {
//             return res.status(404).json({ message: 'Profile not found' });
//         }

//         const userProfile = results[0];
//         res.status(200).json(userProfile);
//     });
// });


// // Start server
// app.listen(port, '192.168.29.36', () => {
//     console.log(`Server running at http://192.168.29.36:${port}/`);
// });

// --------------------------------------------------------------------------------------> Updated Code


// const express = require('express');
// const session = require('express-session');
// const bodyParser = require('body-parser');
// const multer = require('multer');
// const mysql = require('mysql2');
// const fs = require('fs');
// const cors = require('cors');
// const morgan = require('morgan');
// const crypto = require('crypto');

// const app = express();
// const port = 3002;

// const secretKey = crypto.randomBytes(64).toString('hex');
// console.log(secretKey);

// // Multer setup for handling file uploads
// const upload = multer({ dest: 'uploads/' });

// // Middleware setup
// app.use(bodyParser.json({ limit: '1mb' }));
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(session({
//     secret: secretKey,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         secure: false, // Set this to true for HTTPS only
//         httpOnly: true,
//         sameSite: 'Lax' // Needed for cross-site access
//     }
// }));

// const corsOptions = {
//     credentials: true,
//     origin: ['http://localhost:3002', 'http://localhost:80'] // Whitelist the domains you want to allow
// };

// app.use(cors(corsOptions));
// app.use(morgan('dev')); 

// // MySQL connection setup
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'user_management_db'
// });

// // Connect to MySQL
// db.connect(err => {
//     if (err) {
//         console.error('Error connecting to database:', err);
//         return;
//     }
//     console.log('MySQL connected...');
// });

// // Middleware to check if the user is authenticated
// function isAuthenticated(req, res, next) {
//     if (!req.session.user) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }
//     next();
// }

// // Register endpoint
// app.post('/register', (req, res) => {
//     const { username, password } = req.body;

//     console.log("Request:",req.body);
//     // Check if username already exists
//     db.execute('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: err });
//         }

//         if (result.length > 0) {
//             return res.status(400).json({ error: 'Username already exists' });
//         }

//         // Insert user into 'users' table
//         db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, result) => {
//             if (err) {
//                 return res.status(500).json({ error: err });
//             }

//             const userId = result.insertId;

//             // Insert default user profile into 'user_profiles' table
//             db.execute('INSERT INTO user_profiles (user_id, name, preferred_role, project, education, address, phone_no, linkedin_profile, image) VALUES (?, "", "", "", "", "", "", "", "")', [userId], (err) => {
//                 if (err) {
//                     return res.status(500).json({ error: err });
//                 }

//                 res.status(201).json({ message: 'User registered successfully' });
//             });
//         });
//     });
// });

// // Login endpoint
// app.post('/login', (req, res) => {
//     const { username, password } = req.body;

//     console.log("Request:",req.body);

//     db.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
//         if (err) {
//             return res.status(500).json({ error: err });
//         }

//         if (results.length === 0) {
//             return res.status(401).json({ message: 'Authentication failed' });
//         }

//         req.session.user = results[0]; // Setting session user
//         res.status(200).json({ message: 'Login successful' });
//     });
// });

// // Logout endpoint
// app.post('/logout', (req, res) => {

//     console.log("Request:",req.body);
//     req.session.destroy(err => {
//         if (err) {
//             return res.status(500).json({ error: 'Failed to logout' });
//         }

//         res.clearCookie('connect.sid');
//         res.status(200).json({ message: 'Logout successful' });
//     });
// });

// // Profile creation/update endpoint with image upload
// app.post('/profile', isAuthenticated, upload.single('image'), (req, res) => {
//     const { name, preferred_role, project, education, address, phone_no, linkedin_profile } = req.body;
//     const userId = req.session.user.id;

//     console.log("Request:",req.body);
//     let imageBuffer = null;
//     if (req.file) {
//         imageBuffer = fs.readFileSync(req.file.path);
//         fs.unlinkSync(req.file.path); // Delete the file after reading it
//     }

//     db.execute(`
//         INSERT INTO user_profiles (user_id, name, preferred_role, project, education, address, phone_no, linkedin_profile, image)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//         ON DUPLICATE KEY UPDATE 
//             name = VALUES(name), 
//             preferred_role = VALUES(preferred_role), 
//             project = VALUES(project),
//             education = VALUES(education), 
//             address = VALUES(address), 
//             phone_no = VALUES(phone_no),
//             linkedin_profile = VALUES(linkedin_profile), 
//             image = VALUES(image)
//     `, [userId, name, preferred_role, project, education, address, phone_no, linkedin_profile, imageBuffer], (err) => {
//         if (err) {
//             return res.status(500).json({ error: err });
//         }

//         res.status(200).json({ message: 'Profile updated successfully' });
//     });
// });

// // Delete user profile endpoint
// app.delete('/profile', isAuthenticated, (req, res) => {
//     const userId = req.session.user.id;

//     console.log("Request:",req.body);

//     db.execute('DELETE FROM user_profiles WHERE user_id = ?', [userId], (err) => {
//         if (err) {
//             return res.status(500).json({ error: err });
//         }

//         res.status(200).json({ message: 'Profile deleted successfully' });
//     });
// });

// // Profile update endpoint with optional image upload
// app.put('/profile', isAuthenticated, upload.single('image'), (req, res) => {
//     const { name, preferred_role, project, education, address, phone_no, linkedin_profile } = req.body;
//     const userId = req.session.user.id;

//     console.log("Request:",req.body);

//     let imageBuffer = null;
//     if (req.file) {
//         imageBuffer = fs.readFileSync(req.file.path);
//         fs.unlinkSync(req.file.path); // Delete the file after reading it
//     }

//     db.execute(`
//         UPDATE user_profiles SET 
//             name = ?, 
//             preferred_role = ?, 
//             project = ?, 
//             education = ?, 
//             address = ?, 
//             phone_no = ?, 
//             linkedin_profile = ?, 
//             image = ? 
//         WHERE user_id = ?
//     `, [name, preferred_role, project, education, address, phone_no, linkedin_profile, imageBuffer, userId], (err) => {
//         if (err) {
//             return res.status(500).json({ error: err });
//         }

//         res.status(200).json({ message: 'Profile updated successfully' });
//     });
// });

// // Get user profile endpoint
// app.get('/profile', isAuthenticated, (req, res) => {
//     const userId = req.session.user.id;

//     console.log("Request:",req.body);

//     db.execute('SELECT * FROM user_profiles WHERE user_id = ?', [userId], (err, results) => {
//         if (err) {
//             return res.status(500).json({ error: err });
//         }

//         if (results.length === 0) {
//             return res.status(404).json({ message: 'Profile not found' });
//         }

//         res.status(200).json(results[0]);
//     });
// });

// // Start server
// app.listen(port, '192.168.29.36', () => {
//     console.log(`Server running at http://192.168.29.36:${port}/`);
// });

// --------------------------------------------------------------------------->Updated code to deploy in server 


const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require('mysql2');
const fs = require('fs');
const cors = require('cors');
const morgan = require('morgan');
const crypto = require('crypto');

const app = express();
const port = 3002;

const secretKey = crypto.randomBytes(64).toString('hex');
console.log(secretKey);

// Multer setup for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware setup
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set this to true for HTTPS only
        httpOnly: true,
        sameSite: 'Lax' // Needed for cross-site access
    }
}));

const corsOptions = {
    credentials: true,
    origin: ['http://localhost:3002', 'http://localhost:80'] // Whitelist the domains you want to allow
};

app.use(cors(corsOptions));
app.use(morgan('dev')); 

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'user_management_db'
});


// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('MySQL connected...');
});

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
}

// Register endpoint
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    console.log("Request:",req.body);
    // Check if username already exists
    db.execute('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        if (result.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Insert user into 'users' table
        db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

            const userId = result.insertId;

            // Insert default user profile into 'user_profiles' table
            db.execute('INSERT INTO user_profiles (user_id, name, preferred_role, project, education, address, phone_no, linkedin_profile, image) VALUES (?, "", "", "", "", "", "", "", "")', [userId], (err) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }

                res.status(201).json({ message: 'User registered successfully' });
            });
        });
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    console.log("Request:",req.body);

    db.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        req.session.user = results[0]; // Setting session user
        res.status(200).json({ message: 'Login successful' });
    });
});

// Logout endpoint
app.post('/logout', (req, res) => {

    console.log("Request:",req.body);
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }

        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logout successful' });
    });
});

// Profile creation/update endpoint with image upload
// app.post('/profile', isAuthenticated, upload.single('image'), (req, res) => {
    app.post('/profile',upload.single('image'), (req, res) => {
    const { name, preferred_role, project, education, address, phone_no, linkedin_profile } = req.body;
    // const userId = req.session.user.id;

    console.log("Request:",req.body);
    let imageBuffer = null;
    if (req.file) {
        imageBuffer = fs.readFileSync(req.file.path);
        fs.unlinkSync(req.file.path); // Delete the file after reading it
    }

    db.execute(`
        // INSERT INTO user_profiles (user_id, name, preferred_role, project, education, address, phone_no, linkedin_profile, image)
        INSERT INTO user_profiles (name, preferred_role, project, education, address, phone_no, linkedin_profile, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            name = VALUES(name), 
            preferred_role = VALUES(preferred_role), 
            project = VALUES(project),
            education = VALUES(education), 
            address = VALUES(address), 
            phone_no = VALUES(phone_no),
            linkedin_profile = VALUES(linkedin_profile), 
            image = VALUES(image)`
    // , [userId, name, preferred_role, project, education, address, phone_no, linkedin_profile, imageBuffer], (err) => {
        , [ name, preferred_role, project, education, address, phone_no, linkedin_profile, imageBuffer], (err) => {
        
        if (err) {
            return res.status(500).json({ error: err });
        }

        res.status(200).json({ message: 'Profile updated successfully' });
    });
});

// Delete user profile endpoint
app.delete('/profile', isAuthenticated, (req, res) => {
    const userId = req.session.user.id;

    console.log("Request:",req.body);

    db.execute('DELETE FROM user_profiles WHERE user_id = ?', [userId], (err) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        res.status(200).json({ message: 'Profile deleted successfully' });
    });
});

// Profile update endpoint with optional image upload
app.put('/profile', isAuthenticated, upload.single('image'), (req, res) => {
    const { name, preferred_role, project, education, address, phone_no, linkedin_profile } = req.body;
    const userId = req.session.user.id;

    console.log("Request:",req.body);

    let imageBuffer = null;
    if (req.file) {
        imageBuffer = fs.readFileSync(req.file.path);
        fs.unlinkSync(req.file.path); // Delete the file after reading it
    }

    db.execute(`
        UPDATE user_profiles SET 
            name = ?, 
            preferred_role = ?, 
            project = ?, 
            education = ?, 
            address = ?, 
            phone_no = ?, 
            linkedin_profile = ?, 
            image = ? 
        WHERE user_id = ?
    `, [name, preferred_role, project, education, address, phone_no, linkedin_profile, imageBuffer, userId], (err) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        res.status(200).json({ message: 'Profile updated successfully' });
    });
});

// Get user profile endpoint
app.get('/profile', isAuthenticated, (req, res) => {
    const userId = req.session.user.id;

    console.log("Request:",req.body);

    db.execute('SELECT * FROM user_profiles WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json(results[0]);
    });
});

// Start server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}/`);
});

