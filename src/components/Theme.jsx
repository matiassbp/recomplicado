// theme.js - Tema personalizado para empresa de reciclaje
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Verde oscuro (representa sostenibilidad)
      light: '#4CAF50', // Verde medio
      dark: '#1B5E20', // Verde muy oscuro
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00897B', // Verde azulado (turquesa)
      light: '#26A69A', // Turquesa más claro
      dark: '#00695C', // Turquesa oscuro
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#8BC34A', // Verde lima (naturaleza)
      light: '#AED581',
      dark: '#689F38',
    },
    info: {
      main: '#29B6F6', // Azul claro (agua)
      light: '#4FC3F7',
      dark: '#0288D1',
    },
    warning: {
      main: '#FFA000', // Ámbar (precaución)
      light: '#FFB74D',
      dark: '#F57C00',
    },
    error: {
      main: '#E53935', // Rojo (alerta)
      light: '#EF5350',
      dark: '#C62828',
    },
    background: {
      default: '#F1F8E9', // Verde muy pálido
      paper: '#FFFFFF',
    },
    text: {
      primary: '#263238', // Casi negro
      secondary: '#546E7A', // Gris oscuro
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      color: '#2E7D32',
    },
    h5: {
      fontWeight: 600,
      color: '#2E7D32',
    },
    h6: {
      fontWeight: 600,
      color: '#2E7D32',
    },
    subtitle1: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(46, 125, 50, 0.15)',
          padding: '10px 20px',
          fontWeight: 600,
          transition: 'all 0.3s ease',
        },
        contained: {
          '&:hover': {
            boxShadow: '0 8px 16px rgba(46, 125, 50, 0.2)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
          borderRadius: 12,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          overflow: 'hidden',
          border: '1px solid rgba(46, 125, 50, 0.05)',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 20px rgba(46, 125, 50, 0.12)',
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(to right, rgba(46, 125, 50, 0.05), transparent)',
          borderBottom: '1px solid rgba(46, 125, 50, 0.08)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          color: '#2E7D32',
          fontWeight: 700,
          fontSize: '0.95rem',
        },
        root: {
          borderColor: 'rgba(46, 125, 50, 0.1)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            background: 'linear-gradient(to right, rgba(46, 125, 50, 0.15), rgba(46, 125, 50, 0.05))',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(46, 125, 50, 0.04) !important',
          },
          '&:nth-of-type(even)': {
            backgroundColor: 'rgba(46, 125, 50, 0.02)',
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          borderTop: '1px solid rgba(46, 125, 50, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        outlined: {
          borderWidth: 1.5,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'none',
          '&.Mui-selected': {
            color: '#2E7D32',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(46, 125, 50, 0.1)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#4CAF50',
          color: '#FFFFFF',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.07)',
        },
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        dot: {
          backgroundColor: '#4CAF50',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});