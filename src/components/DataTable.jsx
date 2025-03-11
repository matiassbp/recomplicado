import React, { useState, useEffect } from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    CircularProgress, 
    TablePagination, 
    Button, 
    Typography,
    Box,
    Chip,
    Avatar,
    Tooltip,
    Alert,
    Fade,
    Skeleton,
    Divider,
    Tabs,
    Tab,
    Badge
} from '@mui/material';
import * as XLSX from 'xlsx';
import KPISection from './KPISection';
import DownloadIcon from '@mui/icons-material/Download';
import TableChartIcon from '@mui/icons-material/TableChart';
import ChartIcon from '@mui/icons-material/InsertChart';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';

const DataTable = ({ data }) => {
    // Estados para la paginación y la data procesada
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [processedData, setProcessedData] = useState([]);
    const [processedDataOriginal, setProcessedDataOriginal] = useState([]);
    const [empresasData, setEmpresasData] = useState(null);
    const [isInitialDataProcessed, setIsInitialDataProcessed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState(0); // 0 para tabla, 1 para KPIs
    const [summary, setSummary] = useState({
        totalEmpresas: 0,
        totalAreas: 0,
        totalSalario: 0,
        promedioEdad: 0
    });

    // Cargar el archivo JSON con las empresas y áreas
    useEffect(() => {
        setLoading(true);
        fetch('/dicionario-de-datos.json')
            .then((response) => response.json())
            .then((data) => {
                setEmpresasData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error al cargar el archivo JSON:', error);
                setLoading(false);
            });
    }, []);

    // Procesar los datos y cruzarlos con la información del JSON de empresas
    useEffect(() => {
        if (empresasData && data.length > 0) {
            const processed = data.map(item => {
                const empresa = empresasData.EMPRESAS.find(emp => emp.ID_EMPRESA === item.ID_EMPRESA);
                const area = empresa?.AREAS.find(area => area.ID_AREA === item.ID_AREA);

                return {
                    NOMBRE_EMPRESA: empresa?.NOMBRE_EMPRESA || 'N/A',
                    NOMBRE_AREA: area?.NOMBRE_AREA || 'N/A',
                    RUT_TRABAJADOR: item.RUT_TRABAJADOR,
                    NOMBRE_TRABAJADOR: item.NOMBRE_TRABAJADOR,
                    EDAD: item.EDAD,
                    PROFESION: item.PROFESION,
                    CARGO: item.CARGO,
                    SUELDO: area?.SUELDO || 'N/A'
                };
            });

            // Calcular resumen estadístico
            const empresasUnicas = [...new Set(processed.map(item => item.NOMBRE_EMPRESA))];
            const areasUnicas = [...new Set(processed.map(item => item.NOMBRE_AREA))];
            const sueldos = processed.map(item => typeof item.SUELDO === 'number' ? item.SUELDO : 0);
            const totalSalario = sueldos.reduce((sum, val) => sum + val, 0);
            const edades = processed.map(item => typeof item.EDAD === 'number' ? item.EDAD : 0).filter(edad => edad > 0);
            const promedioEdad = edades.length > 0 ? edades.reduce((sum, val) => sum + val, 0) / edades.length : 0;

            setSummary({
                totalEmpresas: empresasUnicas.length,
                totalAreas: areasUnicas.length,
                totalSalario,
                promedioEdad: Math.round(promedioEdad * 10) / 10
            });

            // Guardar los datos procesados originales solo una vez
            if (!isInitialDataProcessed) {
                setProcessedDataOriginal(processed);
                setIsInitialDataProcessed(true);
            }
            setProcessedData(processed);
            setLoading(false);
        }
    }, [empresasData, data, isInitialDataProcessed]);

    // Controlador de cambio de página
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Controlador de cambio en el número de filas por página
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Función para exportar los datos procesados a Excel
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(processedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Datos Procesados');
        XLSX.writeFile(wb, 'data_procesada.xlsx');
    };

    // Cambiar entre vista de tabla y KPIs
    const handleChangeView = (event, newValue) => {
        setView(newValue);
    };

    // Si está cargando, mostrar esqueletos
    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={400} />
            </Box>
        );
    }

    // Si no hay datos o no se cargaron correctamente
    if (!processedData || processedData.length === 0 || !empresasData) {
        return (
            <Alert severity="info" sx={{ m: 2 }}>
                No hay datos disponibles para mostrar. Por favor, verifica la fuente de datos.
            </Alert>
        );
    }

    // Obtener los encabezados de la tabla
    const headers = Object.keys(processedData[0]);

    // Datos a mostrar según la paginación
    const dataToDisplay = processedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ width: '100%' }}>
            {/* Tarjetas de resumen */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
                    <TableChartIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="h6">Resumen de datos</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Chip 
                        avatar={<Avatar><BusinessIcon /></Avatar>}
                        label={`${summary.totalEmpresas} Empresas`}
                        color="primary"
                        variant="outlined"
                    />
                    <Chip 
                        avatar={<Avatar><WorkIcon /></Avatar>}
                        label={`${summary.totalAreas} Áreas`}
                        color="secondary"
                        variant="outlined"
                    />
                    <Chip 
                        avatar={<Avatar><PersonIcon /></Avatar>}
                        label={`${processedData.length} Empleados`}
                        color="info"
                        variant="outlined"
                    />
                    <Chip 
                        avatar={<Avatar><AttachMoneyIcon /></Avatar>}
                        label={`$${summary.totalSalario.toLocaleString('es-CL')} Total`}
                        color="success"
                        variant="outlined"
                    />
                </Box>
            </Box>
            
            {/* Pestañas para cambiar vista */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={view} onChange={handleChangeView} aria-label="Vista de datos">
                    <Tab 
                        icon={<TableChartIcon />} 
                        label="Tabla de datos" 
                        id="tab-0" 
                        aria-controls="tabpanel-0"
                    />
                    <Tab 
                        icon={<ChartIcon />} 
                        label="Indicadores KPI" 
                        id="tab-1" 
                        aria-controls="tabpanel-1"
                    />
                </Tabs>
            </Box>

            {/* Vista de tabla */}
            <Fade in={view === 0} timeout={500}>
                <Box role="tabpanel" hidden={view !== 0} id="tabpanel-0" aria-labelledby="tab-0">
                    {view === 0 && (
                        <>
                            {/* Botón para exportar los datos a Excel */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={exportToExcel}
                                    startIcon={<DownloadIcon />}
                                >
                                    Exportar a Excel
                                </Button>
                            </Box>
                            
                            {/* Tabla de datos */}
                            <TableContainer component={Paper} sx={{ 
                                maxHeight: '500px', 
                                borderRadius: 2, 
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                mb: 3,
                                overflow: 'auto',
                                '&::-webkit-scrollbar': {
                                    width: '8px',
                                    height: '8px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                    borderRadius: '4px',
                                }
                            }}>
                                <Table stickyHeader aria-label="tabla de datos">
                                    <TableHead>
                                        <TableRow>
                                            {headers.map((header, index) => (
                                                <TableCell 
                                                    key={index} 
                                                    sx={{ 
                                                        fontWeight: 'bold', 
                                                        backgroundColor: 'primary.light', 
                                                        color: 'white',
                                                        position: 'sticky',
                                                        top: 0,
                                                        zIndex: 1
                                                    }}
                                                >
                                                    {header}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dataToDisplay.map((row, rowIndex) => (
                                            <TableRow 
                                                key={rowIndex} 
                                                hover 
                                                sx={{ 
                                                    '&:nth-of-type(even)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                                                    transition: 'background-color 0.2s',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(63, 81, 181, 0.08) !important'
                                                    }
                                                }}
                                            >
                                                {headers.map((header, index) => {
                                                    let cellValue = row[header];
                                                    let cellDisplay = cellValue;

                                                    // Dar formato especial a diferentes tipos de celdas
                                                    if (header === "SUELDO" && typeof cellValue === "number") {
                                                        cellValue = Math.floor(cellValue);
                                                        cellDisplay = cellValue.toLocaleString('ES-CL', {
                                                            style: 'currency',
                                                            currency: 'CLP'
                                                        });
                                                    } else if (header === "NOMBRE_EMPRESA") {
                                                        cellDisplay = (
                                                            <Tooltip title={`Empresa: ${cellValue}`}>
                                                                <Chip
                                                                    size="small"
                                                                    icon={<BusinessIcon />}
                                                                    label={cellValue}
                                                                    color="primary"
                                                                    variant="outlined"
                                                                />
                                                            </Tooltip>
                                                        );
                                                    } else if (header === "NOMBRE_AREA") {
                                                        cellDisplay = (
                                                            <Tooltip title={`Área: ${cellValue}`}>
                                                                <Chip
                                                                    size="small"
                                                                    icon={<WorkIcon />}
                                                                    label={cellValue}
                                                                    color="secondary"
                                                                    variant="outlined"
                                                                />
                                                            </Tooltip>
                                                        );
                                                    } else if (header === "CARGO") {
                                                        cellDisplay = (
                                                            <Badge color="info" variant="dot">
                                                                <Typography variant="body2">{cellValue}</Typography>
                                                            </Badge>
                                                        );
                                                    }

                                                    return (
                                                        <TableCell key={index}>{cellDisplay}</TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Paginación de la tabla */}
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, 50]}
                                    component="div"
                                    count={processedData.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    labelRowsPerPage="Filas por página:"
                                    labelDisplayedRows={({ from, to, count }) => 
                                        `${from}-${to} de ${count}`
                                    }
                                    sx={{
                                        borderTop: '1px solid rgba(224, 224, 224, 1)',
                                    }}
                                />
                            </TableContainer>
                        </>
                    )}
                </Box>
            </Fade>

            {/* Vista de KPIs */}
            <Fade in={view === 1} timeout={500}>
                <Box role="tabpanel" hidden={view !== 1} id="tabpanel-1" aria-labelledby="tab-1">
                    {view === 1 && <KPISection processedData={processedDataOriginal} />}
                </Box>
            </Fade>
        </Box>
    );
};

export default DataTable;