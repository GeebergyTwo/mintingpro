const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { createUser, getUserById, loginUser, updateProfile, saveDomesticTransfer, saveWireTransfer, saveCard, getUserCardsByUserId, saveLoan, saveWithdrawal, getWithdrawalsByUserId, getDomesticByUserId, getWireByUserId, getLoanByUserId, saveDepositInfo, getDeposits, getWallets} = require('../controllers/userController');
const app = express(); // Use express() instead of express.Router()
const db = require('../config/db');
const { exec } = require('child_process');
// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(express.json());



// Endpoint to handle cURL requests
app.post('/run-curl', (req, res) => {
  const { network, mobile_number, plan, Ported_number } = req.body;

  const curlCommand = `curl -X POST "https://www.maskawasub.com/api/data/" \
  -H "Authorization: Token e344e3026d3d1f39f9ba0e5cfd44e75097ad8d8e" \
  -H "Content-Type: application/json" \
  -d '{
    "network": "${network}",
    "mobile_number": "${mobile_number}",
    "plan": "${plan}",
    "Ported_number": ${Ported_number}
  }'`;

  exec(curlCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing cURL: ${error}`);
      return res.status(500).send(`Error executing cURL: ${error.message}`);
    }
    if (stderr) {
      console.error(`Error in response: ${stderr}`);
      return res.status(500).send(`Error in cURL response: ${stderr}`);
    }
    res.send(stdout);
  });
});

// user login
app.post('/userLogin', loginUser);



// Endpoint to create a new user
app.post('/createUser', async (req, res) => {
  const  userData  = req.body;
  const username = userData.acct_username;
  const email = userData.acct_email;

    // Check if username or email already exists
  db.query('SELECT * FROM users WHERE acct_username = ? OR acct_email = ?', [username, email], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ error: 'Database query error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // create user
    createUser(userData)
    .then(insertId => {
      res.status(201).json({ message: 'User created successfully', userId: insertId });
    })
    .catch(err => {
      console.error('Error creating user:', err);
      res.status(500).json({ error: 'Check your details and try again' });
    });
  })
});

// CREATE DOMESTIC TRANSFER INFO
app.post('/domestic_transfer', (req, res) => {
  const userData = req.body; // Assuming request body contains user data

  saveDomesticTransfer(userData)
    .then(insertId => {
      res.status(201).json({ message: 'domestic transfer successful', userId: insertId });
    })
    .catch(err => {
      console.error('Error with domestic transfer:', err);
      res.status(500).json({ error: 'Failed to create domestic transfer' });
    });
});

// CREATE WIRE TRANSFER INFO
app.post('/wire_transfer', (req, res) => {
  const userData = req.body; // Assuming request body contains user data

  saveWireTransfer(userData)
    .then(insertId => {
      res.status(201).json({ message: 'wire transfer successful', userId: insertId });
    })
    .catch(err => {
      console.error('Error with wire transfer:', err);
      res.status(500).json({ error: 'Failed to wire domestic transfer' });
    });
});

// SAVE DEPOSIT INFO
// CREATE WIRE TRANSFER INFO
app.post('/addDeposit', (req, res) => {
  const userData = req.body; // Assuming request body contains user data

  saveDepositInfo(userData)
    .then(insertId => {
      res.status(201).json({ message: 'deposit successful', userId: insertId });
    })
    .catch(err => {
      console.error('Error with deposit:', err);
      res.status(500).json({ error: 'Failed to make deposit' });
    });
});


// SAVE CARD
app.post('/save_card', (req, res) => {
  const userData = req.body; // Assuming request body contains user data

  saveCard(userData)
    .then(insertId => {
      res.status(201).json({ message: 'card saved successfully ', userId: insertId });
    })
    .catch(err => {
      console.error('Error saving card:', err);
      res.status(500).json({ error: 'Failed to save card' });
    });
});

// SAVE LOAN INFO
app.post('/save_loan', (req, res) => {
  const userData = req.body; // Assuming request body contains user data

  saveLoan(userData)
    .then(insertId => {
      res.status(201).json({ message: 'loan data saved successfully ', userId: insertId });
    })
    .catch(err => {
      console.error('Error saving loan data:', err);
      res.status(500).json({ error: 'Failed to save loan data' });
    });
});

// SAVE WITHDRAWAL INFO
app.post('/save_withdrawal', (req, res) => {
  const userData = req.body; // Assuming request body contains user data

  saveWithdrawal(userData)
    .then(insertId => {
      res.status(201).json({ message: 'withdrawal data saved successfully ', userId: insertId });
    })
    .catch(err => {
      console.error('Error saving withdrawal data:', err);
      res.status(500).json({ error: 'Failed to save withdrawal data' });
    });
});


// Endpoint to retrieve a user by ID
app.get('/getUserData/:id', (req, res) => {
  const userId = req.params.id;

  getUserById(userId)
    .then(user => {
      if (!user) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(200).json(user);
      }
    })
    .catch(err => {
      console.error('Error retrieving user:', err);
      res.status(500).json({ error: 'Failed to retrieve user' });
    });
});

// GET USER CARD DATA ENDPOINT
app.get('/getUserCardData/:id', (req, res) => {
  const userId = req.params.id;
  getUserCardsByUserId(userId)
    .then(cards => {
      if (!cards || cards.length === 0) {
        res.status(200).json({ message: 'No cards found for this user', cards: [] });
      } else {
        res.status(200).json({cards: cards});
      }
    })
    .catch(err => {
      console.error('Error retrieving user cards:', err);
      res.status(500).json({ error: 'Failed to retrieve user cards' });
    });
});

// GET WITHDRAWALS BY USER ID
app.get('/getWithdrawalsByUserId/:id', (req, res) => {
  const userId = req.params.id;

  getWithdrawalsByUserId(userId)
    .then(withdrawals => {
      if (withdrawals.length === 0) {
        res.status(404).json({ error: 'No withdrawals found for this user' });
      } else {
        res.status(200).json(withdrawals);
      }
    })
    .catch(err => {
      console.error('Error retrieving withdrawals:', err);
      res.status(500).json({ error: 'Failed to retrieve withdrawals' });
    });
});

// GET DOMESTIC BY USER ID
app.get('/getDomesticByUserId/:id', (req, res) => {
  const userId = req.params.id;

  getDomesticByUserId(userId)
    .then(withdrawals => {
      if (withdrawals.length === 0) {
        res.status(404).json({ error: 'No domestic transfers found for this user' });
      } else {
        res.status(200).json(withdrawals);
      }
    })
    .catch(err => {
      console.error('Error retrieving transfers:', err);
      res.status(500).json({ error: 'Failed to retrieve domestic transfers' });
    });
});

// GET WIRE BY USER ID
app.get('/getWireByUserId/:id', (req, res) => {
  const userId = req.params.id;

  getWireByUserId(userId)
    .then(withdrawals => {
      if (withdrawals.length === 0) {
        res.status(404).json({ error: 'No wire transfers found for this user' });
      } else {
        res.status(200).json(withdrawals);
      }
    })
    .catch(err => {
      console.error('Error retrieving wire transfers:', err);
      res.status(500).json({ error: 'Failed to retrieve wire transfers' });
    });
});

// GET LOANS BY USER ID
app.get('/getLoansByUserId/:id', (req, res) => {
  const userId = req.params.id;

  getLoanByUserId(userId)
    .then(withdrawals => {
      if (withdrawals.length === 0) {
        res.status(404).json({ error: 'No loans found for this user' });
      } else {
        res.status(200).json(withdrawals);
      }
    })
    .catch(err => {
      console.error('Error retrieving loans:', err);
      res.status(500).json({ error: 'Failed to retrieve loans' });
    });
});


// GET DEPOSITS - credit/debit transactions
app.get('/getDeposits/:id', (req, res) => {
  const userId = req.params.id;

  getDeposits(userId)
    .then(deposits => {
      if (deposits.length === 0) {
        res.status(404).json({ error: 'No deposit found for this user' });
      } else {
        res.status(200).json(deposits);
      }
    })
    .catch(err => {
      console.error('Error retrieving deposit:', err);
      res.status(500).json({ error: 'Failed to retrieve deposit' });
    });
});


// GET WALLET ADDRESS
app.get('/getWalletAddress/:id', (req, res) => {
  const userId = req.params.id;

  getWallets(userId)
    .then(wallets => {
      if (wallets.length === 0) {
        res.status(404).json({ error: 'No wallet found' });
      } else {
        res.status(200).json(wallets);
      }
    })
    .catch(err => {
      console.error('Error retrieving wallet:', err);
      res.status(500).json({ error: 'Failed to retrieve wallets' });
    });
});



// update user profile
// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
// Route definition
app.post('/update-profile', upload.single('image'), updateProfile);
// Export your app instance for use in other files
module.exports = app;