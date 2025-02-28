import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Card,
  CardContent,
  Button,
  Alert
} from '@mui/material';
import L from 'leaflet';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const RouteMap = ({ onRouteSelect }) => {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [error, setError] = useState('');

  const searchLocation = async (query, type) => {
    if (!query) return;

    try {
      // Using OpenStreetMap Nominatim API for geocoding (free and no token needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (data && data[0]) {
        const location = {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          name: data[0].display_name
        };

        if (type === 'source') {
          setSource(location);
        } else {
          setDestination(location);
        }

        // If both locations are set, calculate route
        if (type === 'destination' && source) {
          calculateRoute(source, location);
        } else if (type === 'source' && destination) {
          calculateRoute(location, destination);
        }
      }
    } catch (err) {
      setError('Error searching location');
      console.error('Search error:', err);
    }
  };

  const calculateRoute = async (src, dest) => {
    try {
      // Calculate straight-line distance (simplified)
      const R = 6371; // Earth's radius in km
      const dLat = (dest.latitude - src.latitude) * Math.PI / 180;
      const dLon = (dest.longitude - src.longitude) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(src.latitude * Math.PI / 180) * Math.cos(dest.latitude * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      // Estimate duration (assuming average speed of 50 km/h)
      const duration = Math.round((distance / 50) * 60);

      // Calculate emissions
      const emissions = {
        car: (distance * 0.2).toFixed(2),
        carpool: (distance * 0.1).toFixed(2),
        transit: (distance * 0.04).toFixed(2)
      };

      setRouteInfo({
        distance: distance.toFixed(2),
        duration,
        emissions
      });
    } catch (err) {
      setError('Error calculating route');
      console.error('Route error:', err);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Source"
              onChange={(e) => searchLocation(e.target.value, 'source')}
              placeholder="Enter starting point"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Destination"
              onChange={(e) => searchLocation(e.target.value, 'destination')}
              placeholder="Enter destination"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ height: 400, mb: 2 }}>
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={4}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {source && (
            <Marker position={[source.latitude, source.longitude]}>
              <Popup>Source: {source.name}</Popup>
            </Marker>
          )}
          {destination && (
            <Marker position={[destination.latitude, destination.longitude]}>
              <Popup>Destination: {destination.name}</Popup>
            </Marker>
          )}
        </MapContainer>
      </Paper>

      {routeInfo && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Route Information
            </Typography>
            <Typography>
              Distance: {routeInfo.distance} km
            </Typography>
            <Typography>
              Estimated Duration: {routeInfo.duration} minutes
            </Typography>

            <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
              Carbon Footprint
            </Typography>
            <Typography>
              By Car: {routeInfo.emissions.car} kg CO2
            </Typography>
            <Typography>
              By Carpool: {routeInfo.emissions.carpool} kg CO2
            </Typography>
            <Typography>
              By Public Transit: {routeInfo.emissions.transit} kg CO2
            </Typography>
            <Typography color="success.main">
              By Bike/Walking: 0 kg CO2
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                💡 Tip: Carpooling reduces your carbon footprint by 50%
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (source && destination) {
                    onRouteSelect({
                      source: source.name,
                      destination: destination.name,
                      distance: routeInfo.distance,
                      mode: 'carpool'
                    });
                  }
                }}
              >
                Find Carpool Partners
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default RouteMap;