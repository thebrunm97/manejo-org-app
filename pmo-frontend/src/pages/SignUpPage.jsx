// src/pages/SignUpPage.jsx (Sintaxe Grid para MUI v6+ - Corrigido)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Avatar, Box, Button, Container, Grid, Link, TextField, Typography,
  CircularProgress, Alert, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

function SignUpPage() {
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [profession, setProfession] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const profileData = {
      full_name: fullName,
      profession: profession,
      gender: gender,
      birth_date: birthDate,
    };

    try {
      await signUp(email, password, profileData);
      alert('Cadastro realizado! Um link de confirmação foi enviado para o seu e-mail.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Falha ao realizar o cadastro.');
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <PersonAddAltIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Cadastre-se
        </Typography>
        <Box component="form" onSubmit={handleSignUp} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            
            <Grid size={{ xs: 12 }}>
              <TextField name="fullName" required fullWidth id="fullName" label="Nome Completo" autoFocus value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField name="birthDate" required fullWidth id="birthDate" label="Data de Nascimento" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} InputLabelProps={{ shrink: true }} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel id="gender-label">Gênero</InputLabel>
                <Select labelId="gender-label" id="gender" value={gender} label="Gênero" onChange={(e) => setGender(e.target.value)}>
                  <MenuItem value="feminino">Feminino</MenuItem>
                  <MenuItem value="masculino">Masculino</MenuItem>
                  <MenuItem value="nao_binario">Não-binário</MenuItem>
                  <MenuItem value="outro">Outro</MenuItem>
                  <MenuItem value="nao_informar">Prefiro não informar</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth required>
                <InputLabel id="profession-label">Profissão / Área de Atuação</InputLabel>
                <Select labelId="profession-label" id="profession" value={profession} label="Profissão / Área de Atuação" onChange={(e) => setProfession(e.target.value)}>
                  <MenuItem value="agricultor">Agricultor(a)</MenuItem>
                  <MenuItem value="agronomo">Engenheiro(a) Agrônomo(a)</MenuItem>
                  <MenuItem value="tecnico">Técnico(a) Agrícola</MenuItem>
                  <MenuItem value="estudante">Estudante</MenuItem>
                  <MenuItem value="consultor">Consultor(a)</MenuItem>
                  <MenuItem value="outro">Outro</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField required fullWidth id="email" label="Endereço de E-mail" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField required fullWidth name="password" label="Senha (mínimo 6 caracteres)" type="password" id="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Grid>

          </Grid>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Cadastrar'}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid>
              <Link href="/login" variant="body2">
                Já tem uma conta? Faça o login
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default SignUpPage;