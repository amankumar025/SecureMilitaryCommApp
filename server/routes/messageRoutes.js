const express = require('express');
const crypto = require('crypto');
const Message = require('../models/Message');
const User = require('../models/User');
const authenticateUser = require('../middleware/authMiddleware');

const router = express.Router();
const AES_SECRET_KEY = Buffer.from(process.env.AES_SECRET_KEY); // Must be 16 bytes for AES-128


// Import controller functions
const { sendMessage, getInbox } = require('../controllers/messagecontrollers');

router.post('/send', authenticateUser, sendMessage);
router.get('/inbox/:userId', authenticateUser, getInbox);

// AES Encryption (AES-128-CBC with random IV)
const encrypt = (text) => {
  const iv = crypto.randomBytes(16); // 16 bytes for CBC
  const cipher = crypto.createCipheriv('aes-128-cbc', AES_SECRET_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted; // Combine IV and encrypted content
};

// AES Decryption
const decrypt = (encryptedText) => {
  const [ivHex, encrypted] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-128-cbc', AES_SECRET_KEY, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

//  Send Encrypted Message
router.post('/send', authenticateUser, async (req, res) => {
  const { receiverId, content } = req.body;

  try {
    const encryptedContent = encrypt(content);

    const message = new Message({
      sender: req.user.userId,
      receiver: receiverId,
      content: encryptedContent
    });

    await message.save();

    res.status(201).json({ message: 'Message sent securely!' });
  } catch (err) {
    console.error('Send Error:', err);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

//  Get Messages Between Users
router.get('/inbox/:userId', authenticateUser, async (req, res) => {
  const currentUser = req.user.userId;
  const otherUser = req.params.userId;

  try {
    const messages = await Message.find({
      $or: [
        { sender: currentUser, receiver: otherUser },
        { sender: otherUser, receiver: currentUser }
      ]
    }).sort({ timestamp: 1 });

    const decryptedMessages = messages.map(msg => ({
      ...msg._doc,
      content: decrypt(msg.content)
    }));

    res.json(decryptedMessages);
  } catch (err) {
    console.error('Inbox Error:', err);
    res.status(500).json({ message: 'Failed to load messages' });
  }
});

module.exports = router;