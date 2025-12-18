// src/components/PmoForm/Coordenadas_MUI.jsx

import React, { useState } from 'react';
import { Grid, TextField, Typography, Button, Box, CircularProgress, FormHelperText } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';

function CoordenadasMUI({ data, onDataChange, errors }) {
  // A lógica de estado para geolocalização permanece a mesma.
  const [geoError, setGeoError] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  
  const safeData = data || {};
  const safeErrors = errors || {};

  const handleChange = (e) => {
    onDataChange({ ...safeData, [e.target.name]: e.target.value });
  };

  const handleGetCoordinates = () => {
    if (!navigator.geolocation) {
      setGeoError('A Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setIsFetching(true);
    setGeoError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onDataChange({
          ...safeData,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
        });
        setIsFetching(false);
      },
      (error) => {
        switch (error.code) {
          case 1: setGeoError("Permissão para obter a localização foi negada."); break;
          case 2: setGeoError("A informação de localização não está disponível."); break;
          case 3: setGeoError("A requisição para obter a localização expirou."); break;
          default: setGeoError("Ocorreu um erro desconhecido ao obter a localização."); break;
        }
        setIsFetching(false);
      }
    );
  };

  return (
    <>
      {/* Usamos um Box com Flexbox para alinhar o título e o botão */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          1.4 Coordenadas Geográficas
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={handleGetCoordinates}
          disabled={isFetching}
          startIcon={isFetching ? <CircularProgress size={16} /> : <MyLocationIcon />}
        >
          {isFetching ? 'Obtendo...' : 'Usar Localização'}
        </Button>
      </Box>

      {/* Usamos o Grid do MUI para o layout dos campos */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="latitude"
            label="Latitude"
            value={safeData.latitude || ''}
            onChange={handleChange}
            error={!!safeErrors.latitude}
            helperText={safeErrors.latitude || ' '}
            fullWidth
            required
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="longitude"
            label="Longitude"
            value={safeData.longitude || ''}
            onChange={handleChange}
            error={!!safeErrors.longitude}
            helperText={safeErrors.longitude || ' '}
            fullWidth
            required
            variant="outlined"
          />
        </Grid>
      </Grid>
      
      {/* Exibimos o erro de geolocalização usando o componente FormHelperText do MUI */}
      {geoError && (
        <FormHelperText error sx={{ mt: 1 }}>
          {geoError}
        </FormHelperText>
      )}
    </>
  );
}

export default CoordenadasMUI;