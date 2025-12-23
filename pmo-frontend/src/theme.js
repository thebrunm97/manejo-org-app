import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  // 1. PALETA DE CORES (Identidade Visual)
  palette: {
    mode: 'light',
    primary: {
      main: '#2E7D32', // Verde Agro (floresta)
      light: '#4CAF50',
      dark: '#1B5E20',
      contrastText: '#fff',
    },
    secondary: {
      main: '#F9A825', // Amarelo/Ouro (colheita/sol)
      light: '#FBC02D',
      contrastText: '#000',
    },
    background: {
      default: '#F4F6F8', // Cinza muito claro (fundo da página) - Menos cansativo que branco puro
      paper: '#FFFFFF',   // Fundo dos Cards
    },
    text: {
      primary: '#1C2434', // Quase preto (melhor leitura)
      secondary: '#64748B', // Cinza azulado moderno
    },
  },

  // 2. TIPOGRAFIA (Legibilidade)
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      color: '#1C2434',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: 0.5,
    },
    button: {
      textTransform: 'none', // Remove o TEXTO EM CAIXA ALTA padrão do Material
      fontWeight: 600,
    },
  },

  // 3. FORMAS E BORDAS (Look Moderno)
  shape: {
    borderRadius: 12, // Bordas mais arredondadas (padrão é 4px)
  },

  // 4. OVERRIDES (Reescrever o comportamento padrão dos componentes)
  components: {
    // Botões mais modernos e gordinhos
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(46, 125, 50, 0.2)', // Sombra suave verde ao passar o mouse
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #2E7D32 30%, #43A047 90%)', // Gradiente sutil
        }
      },
    },
    // Cards com sombra suave (estilo Apple/Stripe)
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // Sombra muito leve e difusa
          border: '1px solid rgba(0,0,0,0.05)',
        },
      },
    },
    // Inputs de texto mais limpos
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
        }
      }
    },
    // Tabelas mais espaçadas
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: '#F8FAFC',
          color: '#475569',
        },
        root: {
          borderBottom: '1px solid #F1F5F9',
        },
      },
    },
  },
});

export default theme;