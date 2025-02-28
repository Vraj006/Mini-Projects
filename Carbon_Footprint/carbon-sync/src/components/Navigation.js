import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Box, Avatar } from '@mui/material';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../context/AuthContext';

const Navigation = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'white' 
          }}
        >
          Carbon Sync
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" component={Link} to="/calculator">
            Calculator
          </Button>
          <Button color="inherit" component={Link} to="/messages">
            Messages
          </Button>
          <Button color="inherit" component={Link} to="/carpooling">
            Carpooling
          </Button>

          {user ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar 
                  sx={{ width: 32, height: 32 }}
                >
                  {user.displayName ? user.displayName[0] : user.email[0]}
                </Avatar>
                <Typography variant="body2" color="inherit">
                  {user.displayName || user.email}
                </Typography>
                <Button 
                  color="inherit" 
                  onClick={handleLogout}
                  variant="outlined"
                  sx={{ ml: 2 }}
                >
                  Logout
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
