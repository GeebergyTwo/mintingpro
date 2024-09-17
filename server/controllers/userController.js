// userController.js
const db = require('../config/db');
const bcrypt = require('bcrypt');

const saltRounds = 10;

function createUser(userData) {
  const defaultValues = {
    billing_code: 0,
    transfer: 1,
    acct_balance: 0,
    avail_balance: 0,
    loan_balance: 0,
    acct_limit: 5000,
    limit_remain: 5000,
    acct_gender: null,
    marital_status: null,
    acct_currency: null,
    acct_status: 'active', // Defaulting to 'active'
    acct_occupation: null,
    acct_dob: null,
    ssn: null,
    frontID: null,
    backID: null,
    country: null,
    state: null,
    acct_pin: null,
    acct_otp: null,
    acct_cot: null,
    acct_imf: null,
    acct_tax: null,
    mgr_name: null,
    mgr_no: null,
    mgr_email: null,
    mgr_id: null,
    mgr_image: null,
    acct_address: null,
  };

  // Merge default values with userData
  const values = { ...defaultValues, ...userData };

  function getCurrentDateString() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const sql = `
    INSERT INTO users (
      acct_username, firstname, lastname, billing_code, 
      transfer, acct_balance, avail_balance, loan_balance, acct_limit, 
      limit_remain, acct_type, acct_currency, 
      acct_status, acct_email, acct_phone, acct_occupation, country, 
      acct_password, acct_pin, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  return new Promise((resolve, reject) => {
    bcrypt.hash(values.acct_password, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return reject(err);
      }

      // Use the hashed password
      const params = [
        values.acct_username,
        values.firstname,
        values.lastname,
        values.billing_code,
        values.transfer,
        values.acct_balance,
        values.avail_balance,
        values.loan_balance,
        values.acct_limit,
        values.limit_remain,
        values.acct_type,
        values.acct_currency,
        values.acct_status,
        values.acct_email,
        values.acct_phone,
        values.acct_occupation,
        values.country,
        hashedPassword, // Save the hashed password
        values.acct_pin
      ];

      db.query(sql, params, (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(result.insertId); // Return the ID of the inserted record
        }
      });
    });
  });
}


  // log user in
  const loginUser = (req, res) => {
    const { username, password } = req.body;

    // Check if user exists
    db.query('SELECT * FROM users WHERE acct_username = ?', [username], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ error: 'Database query error' });
        }


        if (!results || results.length === 0) {
            console.log('User not found');
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = results[0];

        // Compare password
        bcrypt.compare(password, user.acct_password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ error: 'Password comparison error' });
            }


            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            // Password matches, return user ID
            res.json({ userId: user.id });
        });
    });
};



  
  // userController.js
  // get user id
  function getUserById(userId) {
      const sql = 'SELECT * FROM users WHERE id = ?';
      const values = [userId];
    
      return new Promise((resolve, reject) => {
        db.query(sql, values, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results[0]); // Return the first row (assuming userId is unique)
          }
        });
      });
    }

    // GET USER CARD DATA BY ID
    function getUserCardsByUserId(userId) {
      const sql = 'SELECT * FROM card WHERE user_id = ?';
      const values = [userId];
    
      return new Promise((resolve, reject) => {
        db.query(sql, values, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results); // Return all rows matching the userId
          }
        });
      });
    }
    

    


// Your database connection setup here

// Assuming you have authentication middleware that sets req.user
const updateProfile = (req, res) => {
  const { phone, userId, image } = req.body;

  const query = `UPDATE users SET acct_phone = ?, acct_imf = ? WHERE id = ?`;
  const values = [phone, image, userId];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error updating profile:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ message: 'Profile updated successfully' });
  });
};



// SAVE DOMESTIC TRANSFER INFO
function saveDomesticTransfer(data) {
  const sql = `
    INSERT INTO domestic_transfer (
      acct_id, refrence_id, amount, bank_name, acct_name, 
      acct_number, trans_type, acct_type, acct_remarks, dom_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const params = [
    data.acct_id,
    data.refrence_id,
    data.amount,
    data.bank_name,
    data.acct_name,
    data.acct_number,
    data.trans_type,
    data.acct_type,
    data.acct_remarks,
    data.dom_status || 0, // Default value
  ];

  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('Error saving domestic transfer:', err);
        return reject(err);
      }
      resolve(result.insertId); // Return the ID of the inserted record
    });
  });
}

// SAVE WIRE TRANSFER INFO
function saveWireTransfer(wireTransferData) {

  const sql = `
    INSERT INTO wire_transfer (
      acct_id, refrence_id, amount, bank_name, acct_name, acct_number,
      trans_type, acct_type, acct_country, acct_swift, acct_routing, acct_remarks
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    wireTransferData.acct_id,
    wireTransferData.refrence_id,
    wireTransferData.amount,
    wireTransferData.bank_name,
    wireTransferData.acct_name,
    wireTransferData.acct_number,
    wireTransferData.trans_type,
    wireTransferData.acct_type,
    wireTransferData.acct_country,
    wireTransferData.acct_swift,
    wireTransferData.acct_routing,
    wireTransferData.acct_remarks,
  ]

  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('Error saving wire transfer:', err);
        return reject(err);
      }
      resolve(result.insertId); // Return the ID of the inserted record
    });
  });


}

function saveDepositInfo(data) {
  const sql = `
    INSERT INTO deposit (user_id, refrence_id, image, amount, wallet_address, crypto_id, crypto_status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  const params = [
    data.user_id,
    data.reference_id,
    data.image,
    data.amount,
    data.wallet_address,
    data.crypto_id,
    data.crypto_status,
  ];

  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('Error saving deposit info:', err);
        return reject(err);
      }
      resolve(result.insertId); // Return the ID of the inserted record
    });
  });
}


// SAVE CARD DATA
function saveCard(data) {
  const sql = `
    INSERT INTO card (
      seria_key, user_id, card_number, card_name, card_expiration,
      card_security, card_limit, card_limit_remain, card_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const params = [
    data.seria_key,
    data.user_id,
    data.card_number,
    data.card_name,
    data.card_expiration,
    data.card_security,
    data.card_limit || 5000, // Default value if not provided
    data.card_limit_remain || 5000, // Default value if not provided
    data.card_status || 2, // Default value if not provided
  ];

  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('Error saving card:', err);
        return reject(err);
      }
      resolve(result.insertId); // Return the ID of the inserted record
    });
  });
}

// SAVE LOAN INFO
function saveLoan(data) {
  const sql = `
    INSERT INTO loan (
      loan_reference_id, acct_id, amount, loan_remarks, 
      loan_status, loan_message
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

  const params = [
    data.loan_reference_id,
    data.acct_id,
    data.amount || 0,
    data.loan_remarks,
    data.loan_status || 0,
    data.loan_message
  ];

  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('Error saving loan:', err);
        return reject(err);
      }
      resolve(result.insertId); // Return the ID of the inserted record
    });
  });
}


// SAVE WITHDRAWAL INFO
function saveWithdrawal(data) {
  const sql = `
    INSERT INTO withdrawal (
      reference_id, user_id, amount, withdraw_method, 
      trans_type, wallet_address, bankname, account_number, 
      routineno, acctname, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    data.reference_id,
    data.user_id,
    data.amount,
    data.withdraw_method,
    data.trans_type,
    data.wallet_address,
    data.bankname,
    data.account_number,
    data.routineno,
    data.acctname,
    data.status || 0
  ];

  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('Error saving withdrawal:', err);
        return reject(err);
      }
      resolve(result.insertId); // Return the ID of the inserted record
    });
  });
}

// FETCH WITHDRAWAL INFO
function getWithdrawalsByUserId(userId) {
  const sql = 'SELECT * FROM withdrawal WHERE user_id = ?';
  const values = [userId];

  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results); // Return all matching rows
      }
    });
  });
}

// FETCH DOMESTIC TRANSFERS
function getDomesticByUserId(userId) {
  const sql = 'SELECT * FROM domestic_transfer WHERE acct_id = ?';
  const values = [userId];

  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results); // Return all matching rows
      }
    });
  });
}

// FETCH WIRE TRANSFERS
function getWireByUserId(userId) {
  const sql = 'SELECT * FROM wire_transfer WHERE acct_id = ?';
  const values = [userId];

  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results); // Return all matching rows
      }
    });
  });
}

// FETCH LOAN
function getLoanByUserId(userId) {
  const sql = 'SELECT * FROM loan WHERE acct_id = ?';
  const values = [userId];

  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results); // Return all matching rows
      }
    });
  });
}



// FETCH DEPOSITS
function getDeposits(userId) {
  const sql = 'SELECT * FROM deposit WHERE user_id = ?';
  const values = [userId];

  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results); // Return all matching rows
      }
    });
  });
}


// FETCH WALLETS
function getWallets(userId) {
  const sql = 'SELECT * FROM crypto_currency';

  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results); // Return all matching rows
      }
    });
  });
}





module.exports = {createUser, getUserById, loginUser, updateProfile, saveDomesticTransfer, saveWireTransfer, saveCard, getUserCardsByUserId, saveLoan, saveWithdrawal, getWithdrawalsByUserId, getDomesticByUserId, getWireByUserId, getLoanByUserId, saveDepositInfo, getDeposits, getWallets};