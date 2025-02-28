import React, { useState } from 'react';
import { Box, TextField, Select, MenuItem, Button, Typography, Paper } from '@mui/material';

const CarbonCalculator = () => {
  const [vehicle, setVehicle] = useState('car');
  const [miles, setMiles] = useState('');
  const [result, setResult] = useState(null);

  const emissionFactors = {
    car: 0.404,
    bus: 0.14,
    train: 0.14,
    airplane: 0.257
  };

  const calculateEmissions = () => {
    const emission = parseFloat(miles) * emissionFactors[vehicle];
    setResult(emission.toFixed(2));
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Carbon Footprint Calculator
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Select
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
          fullWidth
        >
          <MenuItem value="car">Car</MenuItem>
          <MenuItem value="bus">Bus</MenuItem>
          <MenuItem value="train">Train</MenuItem>
          <MenuItem value="airplane">Airplane</MenuItem>
        </Select>
        
        <TextField
          type="number"
          label="Miles Traveled"
          value={miles}
          onChange={(e) => setMiles(e.target.value)}
          fullWidth
        />

        <Button 
          variant="contained" 
          onClick={calculateEmissions}
          disabled={!miles}
        >
          Calculate
        </Button>

        {result && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="h6">
              Carbon Footprint: {result} kg CO2
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default CarbonCalculator; 