import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, List, ListItem } from '@mui/material';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';

const MessageBoard = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { requireAuth, user } = useAuth();

  useEffect(() => {
    requireAuth();
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    });
    return () => unsubscribe();
  }, [requireAuth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await addDoc(collection(db, 'messages'), {
      text: newMessage,
      userId: user.uid,
      userName: user.displayName || user.email,
      timestamp: new Date()
    });

    setNewMessage('');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Share Your Thoughts
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Share your ideas on reducing carbon footprint..."
            sx={{ mb: 2 }}
          />
          <Button 
            type="submit" 
            variant="contained"
            disabled={!newMessage.trim()}
          >
            Post Message
          </Button>
        </Box>
      </Paper>

      <List>
        {messages.map(message => (
          <ListItem key={message.id} sx={{ display: 'block', mb: 2 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="primary">
                {message.userName}
              </Typography>
              <Typography variant="body1" sx={{ my: 1 }}>
                {message.text}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {message.timestamp?.toDate().toLocaleString()}
              </Typography>
            </Paper>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MessageBoard; 