import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#15803d' }, // Verde Agro
    secondary: { main: '#16a34a' },
    background: { default: '#f1f5f9', paper: '#ffffff' }, // Slate-100 no fundo
    text: { primary: '#1e293b', secondary: '#64748b' },
  },
  shape: { borderRadius: 4 }, // Padroniza tudo para quase quadrado
  shadows: ["none", ...Array(24).fill("none")], // REMOVE TODAS AS SOMBRAS (Flat)
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 }, // Botões com texto normal
    h1: { fontWeight: 700, color: '#1e293b' },
    h2: { fontWeight: 700, color: '#1e293b' },
    h6: { fontWeight: 600, color: '#334155' },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true, variant: 'contained' },
      styleOverrides: {
        root: { borderRadius: '4px', padding: '8px 16px' }, // Botão retangular compacto
        outlined: { borderWidth: '1.5px', '&:hover': { borderWidth: '1.5px' } }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          border: '1px solid #e2e8f0', // Borda técnica (Slate-200)
          backgroundColor: '#ffffff',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none', border: '1px solid #e2e8f0' },
        elevation1: { boxShadow: 'none' }, // Garante que Papers não tenham sombra
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          color: '#1e293b' // Navbar branca com texto escuro (Clean)
        }
      }
    },
    MuiTextField: {
      defaultProps: { size: 'small' } // Inputs compactos por padrão
    },
    MuiSelect: {
      defaultProps: { size: 'small' }
    }
  },
});

export default theme;