// my-app/server/routes/api.js
const express = require('express');
const bcrypt = require('bcrypt');
const validator = require('validator');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');
const Transaction = require('../models/Transaction');
const PendingTask = require('../models/PendingTask');
const { MongoClient } = require('mongodb');
const cron = require('node-cron');
const axios = require('axios');

// const uri = "mongodb+srv://TheGilo:OnlyOneGilo@cluster1.pvwjh.mongodb.net/userData?retryWrites=true&w=majority&appName=DripDashCluster";
const uri = "mongodb+srv://mintingpro:MintingPro1411@mintingpro.3fw8f.mongodb.net/mintingpro?retryWrites=true&w=majority&appName=mintingpro";

async function connectToMongoDB() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (error) {

    
    console.error('Error connecting to MongoDB', error);
  }
}

connectToMongoDB();



router.post("/addUser", async (request, response) => {
  try {
    const {
      username,
      email,
      phone_no,
      password,
      walletAddress,
      userReferralCode,
      referralCode
    } = request.body;

    let referringUser = null;

    // 1. Check if a referral code is provided and if it exists
    if (referralCode !== 'none') {
      referringUser = await User.findOne({ userReferralCode: referralCode });
      if (!referringUser) {
        return response.status(400).send({
          status: "failed",
          message: "Invalid referral code"
        });
      }
    }

    // 2. Check if the username already exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return response.status(400).send({
        status: "failed",
        message: "Username already exists"
      });
    }

    // 3. Check if the email or phone number already exists
    const emailExists = await User.findOne({ email });
    const phoneExists = await User.findOne({ phone_no });
    if (emailExists || phoneExists) {
      return response.status(400).send({
        status: "failed",
        message: "Email or phone number already exists"
      });
    }

    // 4. Check if the wallet address or user's referral code already exists
    const walletAddressExists = await User.findOne({ walletAddress });
    const userReferralCodeExists = await User.findOne({ userReferralCode });

    if (walletAddressExists || userReferralCodeExists) {
      // Generic error if wallet address or user's referral code already exists
      return response.status(400).send({
        status: "failed",
        message: "Failed sign up, please try again"
      });
    }

    // 5. Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Save the user details with a starting balance of 2700
    const newUser = new User({
      username,
      email,
      phone_no,
      password: hashedPassword, // Save the hashed password
      walletAddress,
      userReferralCode,
      referredBy: referralCode !== 'none' ? referralCode : null, // Save referralCode as null if not provided
      balance: 2700, // Add 2700 naira as the starting balance
      mint_rate: 0.025
    });

    await newUser.save();

    // Create transaction records
    await Transaction.create({
      userID: newUser._id,
      email: newUser.email,
      description: 'Sign up bonus ',
      amount: 2700,
      transactionType: 'credit',
      status: 'success',
      planType: 'Standard',
      transactionReference: 'tx-' + new Date().getTime(),
      currencyCode: 'NGN',
      paymentMethod: 'token_transfer',
    });

    // 7. If referral code is valid, increment inactiveReferrals for the referring user
    if (referringUser) {
      referringUser.inactiveReferrals += 1;
      await referringUser.save();
    }

    return response.status(200).send({
      status: "success",
      userDetails: {
        username: newUser.username,
        email: newUser.email,
        phone_no: newUser.phone_no,
        walletAddress: newUser.walletAddress,
        userReferralCode: newUser.userReferralCode,
        balance: newUser.balance, // Return the balance
        mint_rate: newUser.mint_rate
      }
    });

  } catch (error) {
    // Catch any unexpected errors and send a generic error message
    console.error("Error creating user:", error);
    return response.status(500).send({
      status: "failed",
      message: "Internal server error"
    });
  }
});


// Login
router.post("/login", async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    // Check if the input is an email or username
    const user = validator.isEmail(emailOrUsername)
      ? await User.findOne({ email: emailOrUsername })
      : await User.findOne({ username: emailOrUsername });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    return res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// get user data
router.get('/getUserData/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// updateUserAndReferrerAfterPayment
router.post('/updateUserPlan', async (req, res) => {
  try {
    const { userID, planType, amount } = req.body;
    // Find the user by userID
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update user fields based on planType
    user.isUserActive = true; // Activate user
    user.deposit += amount; // Add deposit accord to payment
    let newMintRate;

    switch (planType) {
      case 'Standard':
        newMintRate = 0.05; // Example mint rate for Standard plan
        break;
      case 'Premium':
        newMintRate = 0.09; // Example mint rate for Premium plan
        break;
      case 'Ultimate':
        newMintRate = 0.14; // Example mint rate for Ultimate plan
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid plan type' });
    }

    // Update mint rate
    user.mint_rate = newMintRate;

    // Handle referral logic if the user has a valid referral
    if (user.referredBy) {
      const referrer = await User.findOne({ userReferralCode: user.referredBy });

      if (referrer && !user.referralRedeemed) {
          referrer.inactiveReferrals -= 1;
          referrer.activeReferrals += 1;
          referrer.referralsCount += 1;
          referrer.mint_points += 1000;
          // update user's referral redeemed state
          user.referralRedeemed = true;

          // Check if referralsCount is 3 to increase the referrer's mint rate
          if (referrer.referralsCount >= 3) {
            referrer.mint_rate += 0.01; // Increase referrer's mint rate by 0.01
            referrer.referralsCount = 0; // Reset referrals count
          }

          await referrer.save();
      }
    }

    // Save the updated user data
    await user.save();

    // Return success response
    res.status(200).json({ success: true, message: 'User plan updated successfully' });
  } catch (error) {
    console.error('Error updating user plan:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Debit user's mint_points by a specific amount
router.post('/debitMintPoints', async (req, res) => {
  try {
    const { userID, debitAmount } = req.body;

    // Validate inputs
    if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    if (typeof debitAmount !== 'number' || debitAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid debit amount' });
    }

    // Find the user by userID
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the user has enough mint points
    if (user.mint_points < debitAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient mint points' });
    }

    // Debit mint points
    user.mint_points -= debitAmount;

    // Save the updated user data
    await user.save();

    // Return success response
    res.status(200).json({ success: true, message: `Debited ${debitAmount} mint points successfully`, mint_points: user.mint_points });
  } catch (error) {
    console.error('Error debiting mint points:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create a new transaction
router.post('/createTransaction', async (req, res) => {
  const {
    transactionReference,
    email,
    amount,
    userID,
    status,
    transactionType,
    description,
    planType, // This is optional
  } = req.body;


  try {
    // Basic validation
    if (!transactionReference || !email || !amount || !userID || !status || !transactionType || !description) {
      return res.status(400).json({ message: 'TransactionReference, email, amount, userID, description, status and transactionType are required' });
    }

    // Create new transaction
    const newTransaction = await Transaction.create({
      transactionReference: 'tx-' + transactionReference,
      email,
      amount,
      userID,
      status,
      planType,  // Save the plan type if it exists
      timestamp: new Date(),  // Use the current date/time as the timestamp
      transactionType,  // Force the transaction type to always be 'credit'
      description,
      paymentMethod: 'bank_transfer', // You can dynamically set this based on input
      currencyCode: 'NGN', // Default to 'NGN'
    });

    return res.status(201).json({
      message: 'Transaction created successfully',
      transaction: newTransaction,
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});


// Fetch transactions for a specific user by userID
router.get('/transactions', async (req, res) => {
  const { userID } = req.query; // Get userID from query parameters

  if (!userID) {
    return res.status(400).json({ success: false, message: 'userID is required' });
  }

  try {
    // Fetch transactions for the specified user
    const transactions = await Transaction.find({ userID });

    res.json({ success: true, transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API to get all tasks and user's completed tasks
router.get('/allTasks/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch all tasks from the Task collection
    const allTasks = await Task.find({});

    // Fetch user to get their completed tasks
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const completedTaskIds = user.completed_tasks; // An array of task IDs the user has completed

    // Send both all tasks and completed task IDs
    return res.json({
      tasks: allTasks,
      completedTasks: completedTaskIds,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});


// Route for adding a pending task
router.post('/addToPending', async (req, res) => {
  try {
    const { userID, taskID, imageSrc, description, points } = req.body;

    const newPendingTask = new PendingTask({
      userID,
      taskID,
      imageSrc,
      description,
      points,
    });

    await newPendingTask.save('Task added to pending for review.' );
    console.log()
    res.status(201).json({ message: 'Task added to pending for review.' });
  } catch (error) {
    console.error('Error adding to pendingTasks:', error);
    res.status(500).json({ error: 'Failed to add task to pending.' });
  }
});

// Route to fetch pending tasks for a specific user
router.get('/pendingTasks/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const pendingTasks = await PendingTask.find({ userID: userId, status: 'pending' });
    res.status(200).json({ pendingTasks });
  } catch (error) {
    console.error('Error fetching pending tasks:', error);
    res.status(500).json({ error: 'Failed to fetch pending tasks.' });
  }
});

// Route to fetch all pending tasks for admin
router.get('/allPendingTasks', async (req, res) => {
  try {
    const pendingTasks = await PendingTask.find({ status: 'pending' });
    res.status(200).json({ pendingTasks });
  } catch (error) {
    console.error('Error fetching all pending tasks:', error);
    res.status(500).json({ error: 'Failed to fetch all pending tasks.' });
  }
});

// Route to update task status
router.post('/updateTaskStatus', async (req, res) => {
  try {
    const { taskID, status } = req.body; // status will be either 'approved' or 'declined'

    // Find the task
    const task = await PendingTask.findById(taskID);
    if (!task) return res.status(404).json({ error: 'Task not found.' });

    // Update task status
    await PendingTask.findByIdAndUpdate(taskID, { status }, { new: true });

    if (status === 'approved') {
      // Update user points and completed tasks
      const user = await User.findById(task.userID);
      if (user) {
        user.mint_points += task.points;
        user.completed_tasks.push(task.taskID);
        await user.save();
      }
    }

    // Delete the task after approval or decline
    await PendingTask.findByIdAndDelete(taskID);

    res.status(200).json({ message: `Task has been ${status}.` });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ error: 'Failed to update task status.' });
  }
});



// ADD TASKS TO USER COMPLETED_TASKS ARRAY
// Function to mark a task as completed by a user
router.post('/completTask/:userId', async (req, res) => {
const { userId } = req.params;
const { taskId } = req.body;

async function completeTask(userId, taskId) {
  try {
    // Check if task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return { error: 'Task not found' };
    }

    // Update user by adding the task ID to completed_tasks
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { completed_tasks: taskId } }, // $addToSet ensures no duplicates
      { new: true } // Returns the updated user object
    );

    if (!updatedUser) {
      return { error: 'User not found' };
    }

    return { success: true, user: updatedUser };

  } catch (error) {
    console.error(error);
    return { error: 'An error occurred' };
  }
}
});

// Function to handle transfer
router.post('/transfer', async (req, res) => {
  const { senderId, receiverAddress, amount } = req.body;

  try {
    // Validate inputs
    if (!senderId || !receiverAddress || !amount) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const sender = await User.findById(senderId);
    if (sender.walletAddress === receiverAddress){
      return res.status(400).json({ error: 'You cannot transfer tokens to yourself.' });
    }

    if (!sender) {
      return res.status(404).json({ error: 'Sender not found.' });
    }

    // Check if receiver exists
    const receiver = await User.findOne({ walletAddress: receiverAddress });
    if (!receiver) {
      return res.status(404).json({ error: 'Receiver wallet address does not exist.' });
    }

    // Check if sender has sufficient balance
    if (sender.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance.' });
    }

    // Deduct from sender's balance and add to receiver's balance
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    // Create transaction records
    await Transaction.create({
      userID: sender._id,
      email: sender.email,
      description: 'Token transfer to ' + receiverAddress,
      amount,
      transactionType: 'debit',
      status: 'success',
      planType: 'Standard',
      transactionReference: 'tx-' + new Date().getTime(),
      currencyCode: 'NGN',
      paymentMethod: 'token_transfer',
    });

    await Transaction.create({
      userID: receiver._id,
      email: receiver.email,
      description: 'Token transfer from ' + sender.walletAddress,
      amount,
      transactionType: 'credit',
      status: 'success', 
      planType: 'Standard',
      transactionReference: 'tx-' + new Date().getTime(),
      currencyCode: 'NGN',
      paymentMethod: 'token_transfer',
    });

    res.status(200).json({ message: 'Transfer successful.' });
  } catch (error) {
    console.error('Error processing transfer:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});



// update user tokens every ten seconds

const updateUserBalances = async () => {
  try {
    // Find all users
    const allUsers = await User.find();

    allUsers.forEach(async (user) => {
      const currentTime = new Date();
      
      // If last_update is not set, initialize it to current time (could happen for new users)
      if (!user.last_update) {
        user.last_update = currentTime;
        await user.save();
        return; // Skip this user for now as there's no elapsed time
      }

      // Calculate the time difference (in seconds) since the last update
      const timeElapsedInSeconds = (currentTime - user.last_update) / 1000;

      // Calculate the amount to add based on the time elapsed and their mint_rate
      const balanceIncrement = user.mint_rate * timeElapsedInSeconds;

      // Update the user's balance
      user.balance += balanceIncrement;

      // Update the last_update timestamp
      user.last_update = currentTime;

      // Save the updated user data
      await user.save();
      // console.log(`Updated balance for ${user.username}: ${user.balance}`);
    });
  } catch (err) {
    console.error('Error updating balances:', err);
  }
};

// Schedule the job to run every minute (or another desired interval)
cron.schedule('*/1 * * * *', () => {
  // console.log('Running balance update...');
  updateUserBalances();
});







module.exports = router;
