const Message = require('../models/Message');
const { encrypt, decrypt } = require('../utils/encryption');

exports.sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;

  try {
    const encryptedContent = encrypt(content);

    const message = new Message({
      sender: req.user.userId,
      receiver: receiverId,
      Content: encryptedContent
    });

    await message.save();

    res.status(201).json({ message: 'Message sent securely!' });
  } catch (err) {
    console.error('Send Error:', err);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

exports.getInbox = async (req, res) => {
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
  
  console.log("Raw messages:", messages);
};