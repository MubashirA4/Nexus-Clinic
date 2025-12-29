import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: false },
  messages: [
    {
      from: { type: String, enum: ['user', 'bot'], required: true },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const ChatHistory = mongoose.models.ChatHistory || mongoose.model('ChatHistory', chatSchema);
export default ChatHistory;