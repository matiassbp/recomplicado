import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Paper, 
  Box, 
  Divider, 
  Grid, 
  Fade,
  Chip,
  IconButton,
  useTheme,
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar
} from '@mui/material';
import CargoSelect from '../components/CargoSelect';
import DataTable from '../components/DataTable';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DownloadIcon from '@mui/icons-material/Download';
import WorkIcon from '@mui/icons-material/Work';
import * as XLSX from 'xlsx';
import { theme } from '../components/Theme'; // Importar el tema personalizado

const SuperPage = () => {
    const [cargos, setCargos] = useState([]);
    const [cargoSeleccionado, setCargoSeleccionado] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
      totalEmpleados: 0,
      cargosUnicos: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/origen-datos-junior.xlsx');
                const arrayBuffer = await response.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });

                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                let jsonData = XLSX.utils.sheet_to_json(worksheet);

                jsonData = jsonData.map(item => ({
                    ...item,
                    PROFESION: item.PROFESION ? item.PROFESION : 'Sin Cargo',
                }));

                setData(jsonData);

                const cargosList = [...new Set(jsonData.map(item => item.CARGO))];
                setCargos(cargosList);
                
                // Calcular estadísticas
                setStats({
                  totalEmpleados: jsonData.length,
                  cargosUnicos: cargosList.length,
                });
                
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Borrar filtros
    const clearFilters = () => {
        setCargoSeleccionado('');  // Restablecer el cargo seleccionado
    };

    const filteredData = cargoSeleccionado
        ? data.filter(item => item.CARGO === cargoSeleccionado)
        : data;

    const handleCargoChange = (cargo) => {
        setCargoSeleccionado(cargo);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
                <AppBar position="static" elevation={0} color="primary">
                    <Toolbar>
                        <DashboardIcon sx={{ mr: 2 }} />
                        <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: "white" }}>
                            Dashboard de Recursos Humanos
                        </Typography>
                    </Toolbar>
                </AppBar>
                
                <Container maxWidth="xl" sx={{ mt: 4 }}>
                    <Fade in={true} timeout={800}>
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 2, mb: 4, bgcolor: 'background.paper' }}>
                            <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
                                <Grid item xs={12} md={8}>
                                    <Typography variant="h4" gutterBottom color="primary">
                                        Panel de Control de Personal
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Visualiza y analiza la información de personal de la empresa
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                                        <Chip 
                                            icon={<WorkIcon />} 
                                            label={`${stats.totalEmpleados} Empleados`} 
                                            color="primary" 
                                            variant="outlined" 
                                        />
                                        <Chip 
                                            icon={<FilterListIcon />} 
                                            label={`${stats.cargosUnicos} Cargos`} 
                                            color="secondary" 
                                            variant="outlined" 
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                            
                            <Divider sx={{ mb: 4 }} />
                            
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <FilterListIcon sx={{ mr: 1 }} />
                                    Filtros
                                </Typography>
                                
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={6} lg={4}>
                                        <CargoSelect
                                            cargos={cargos}
                                            onChange={handleCargoChange}
                                            value={cargoSeleccionado}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={8}>
                                        <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                                            {cargoSeleccionado && (
                                                <Chip
                                                    label={`Cargo: ${cargoSeleccionado}`}
                                                    onDelete={clearFilters}
                                                    color="primary"
                                                />
                                            )}
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={clearFilters}
                                                startIcon={<DeleteIcon />}
                                                disabled={!cargoSeleccionado}
                                            >
                                                Borrar filtros
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<DownloadIcon />}
                                                onClick={() => {}} // Esta funcionalidad ya está implementada en DataTable
                                            >
                                                Exportar datos
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                            
                            <Fade in={!loading} timeout={1000}>
                                <Box>
                                    <DataTable data={filteredData} />
                                </Box>
                            </Fade>
                        </Paper>
                    </Fade>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default SuperPage;