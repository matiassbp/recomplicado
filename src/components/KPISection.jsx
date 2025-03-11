import React, { useMemo } from 'react';
import { Card, CardContent, Typography, Grid, Box, Divider, useTheme, alpha } from '@mui/material';
import { RecyclingRounded, ParkRounded, AttachMoneyRounded, GroupRounded, PieChartRounded, TrendingUpRounded } from '@mui/icons-material';
import { Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

// Registrar los elementos necesarios de Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const KPISection = ({ processedData }) => {
  const theme = useTheme();

  // Función para calcular los KPIs
  const calculateKPI = (data, key, countOnly = false) => {
    return data.reduce((acc, item) => {
      const category = item[key] || 'No definido';
      
      if (countOnly) {
        acc[category] = (acc[category] || 0) + 1;
      } else {
        const value = parseFloat(item.SUELDO) || 0;
        acc[category] = (acc[category] || 0) + value;
      }

      return acc;
    }, {});
  };

  // Función para calcular el impacto ambiental simulado (datos ficticios para empresa de reciclaje)
  const calculateEnvironmentalImpact = (data) => {
    // Suponiendo que cada empresa tiene diferentes tasas de reciclaje
    const recyclingRateByCompany = {
      'Empresa A': 0.85,
      'Empresa B': 0.72,
      'Empresa C': 0.68,
      'Empresa D': 0.92,
      'No definido': 0.5,
      // Valores por defecto para cualquier otra empresa
      default: 0.65
    };

    return Object.keys(data).reduce((acc, company) => {
      const employeeCount = data[company];
      const rate = recyclingRateByCompany[company] || recyclingRateByCompany.default;
      // Estimación ficticia: cada empleado procesa ~200kg de material reciclable al mes
      const recyclableMaterial = employeeCount * 200 * rate;
      acc[company] = Math.round(recyclableMaterial);
      return acc;
    }, {});
  };

  // Memorizamos los KPIs para evitar cálculos innecesarios
  const totalSueldosPorEmpresa = useMemo(() => calculateKPI(processedData, 'NOMBRE_EMPRESA'), [processedData]);
  const totalSueldosPorArea = useMemo(() => calculateKPI(processedData, 'NOMBRE_AREA'), [processedData]);
  const numTrabajadoresPorEmpresa = useMemo(() => 
    calculateKPI(processedData, 'NOMBRE_EMPRESA', true), [processedData]);
  const numTrabajadoresPorArea = useMemo(() => 
    calculateKPI(processedData, 'NOMBRE_AREA', true), [processedData]);
  
  // Datos simulados de impacto ambiental basados en el número de trabajadores
  const impactoAmbiental = useMemo(() => 
    calculateEnvironmentalImpact(numTrabajadoresPorEmpresa), [numTrabajadoresPorEmpresa]);

  // Función para generar colores temáticos de reciclaje para los gráficos
  const generateEcoColors = (count) => {
    const baseColors = [
      theme.palette.primary.main,    // Verde principal
      theme.palette.primary.light,   // Verde claro
      theme.palette.primary.dark,    // Verde oscuro
      theme.palette.secondary.main,  // Turquesa
      theme.palette.secondary.light, // Turquesa claro
      theme.palette.success.main,    // Verde lima
      theme.palette.info.main,       // Azul agua
      '#8D6E63',                     // Marrón (tierra)
      '#FBC02D',                     // Amarillo (sol)
      '#78909C'                      // Gris azulado (agua)
    ];
    
    // Si necesitamos más colores que los base, generamos variaciones
    if (count <= baseColors.length) {
      return baseColors.slice(0, count);
    }
    
    let colors = [...baseColors];
    while (colors.length < count) {
      // Añadir variaciones más claras de los colores base
      const index = colors.length % baseColors.length;
      const baseColor = baseColors[index];
      const alphaValue = 0.7 - (Math.floor(colors.length / baseColors.length) * 0.15);
      colors.push(alpha(baseColor, alphaValue > 0.3 ? alphaValue : 0.3));
    }
    
    return colors;
  };

  // Función para generar los datos para el gráfico
  const generateChartData = (data, chartType = 'pie') => {
    const labels = Object.keys(data);
    const values = Object.values(data);
    const colors = generateEcoColors(labels.length);

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 15,
            font: {
              size: 11
            }
          }
        },
        tooltip: {
          backgroundColor: alpha(theme.palette.primary.main, 0.8),
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          padding: 12,
          cornerRadius: 8,
          boxPadding: 6
        }
      }
    };

    return {
      chartData: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderColor: colors.map(color => alpha(color, 0.8)),
            borderWidth: 1,
            hoverOffset: 10
          },
        ],
      },
      chartOptions
    };
  };

  // Componente para las tarjetas de KPI
  const KPICard = ({ title, icon, data, chartType = 'pie', formatValue, color = theme.palette.primary.main, description }) => {
    const { chartData, chartOptions } = generateChartData(data, chartType);
    
    return (
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <Card sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          overflow: 'visible'
        }}>
          <Box 
            sx={{ 
              position: 'absolute', 
              top: -15, 
              left: 20, 
              backgroundColor: color,
              borderRadius: '50%', 
              width: 50, 
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 10px ${alpha(color, 0.3)}`
            }}
          >
            {icon}
          </Box>

          <CardContent sx={{ pt: 4, pb: 2, px: 3 }}>
            <Box sx={{ ml: 5, mb: 1 }}>
              <Typography variant="h6" fontWeight="bold" color={color}>
                {title}
              </Typography>
              {description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {description}
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ height: 220, mt: 2, position: 'relative' }}>
              {chartType === 'pie' ? (
                <Pie data={chartData} options={chartOptions} />
              ) : (
                <Doughnut data={chartData} options={chartOptions} />
              )}
            </Box>

            <Box sx={{ 
              mt: 3, 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: alpha(color, 0.05),
              border: `1px solid ${alpha(color, 0.1)}`
            }}>
              <Typography variant="subtitle2" color={color} fontWeight="bold" gutterBottom>
                <PieChartRounded sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} />
                Desglose de datos
              </Typography>
              
              <Grid container spacing={1}>
                {Object.entries(data).map(([key, value], index) => (
                  <Grid item xs={12} key={index}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 0.5,
                      borderBottom: index < Object.keys(data).length - 1 ? `1px dashed ${alpha(color, 0.2)}` : 'none'
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        <span style={{ 
                          display: 'inline-block', 
                          width: 10, 
                          height: 10, 
                          borderRadius: '50%', 
                          backgroundColor: generateEcoColors(Object.keys(data).length)[index],
                          marginRight: 6
                        }}></span>
                        {key}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {formatValue(value)}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  // Tarjeta de resumen con datos agregados
  const SummaryCard = ({ total, average, max, min, title, icon, color, unit, prefix = '' }) => (
    <Grid item xs={12}>
      <Card sx={{ 
        mb: 3, 
        background: `linear-gradient(135deg, ${alpha(color, 0.05)} 0%, ${alpha(color, 0.02)} 100%)`,
        border: `1px solid ${alpha(color, 0.1)}`
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ 
              backgroundColor: color, 
              p: 1, 
              borderRadius: 2, 
              mr: 2, 
              display: 'flex',
              color: '#fff'
            }}>
              {icon}
            </Box>
            <Typography variant="h6" fontWeight="bold" color={color}>
              {title}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: '#fff', 
                borderRadius: 2, 
                boxShadow: `0 4px 10px ${alpha(color, 0.1)}` 
              }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total
                </Typography>
                <Typography variant="h5" fontWeight="bold" color={color}>
                  {prefix}{total.toLocaleString('es-CL')} {unit}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUpRounded sx={{ fontSize: 16, color: theme.palette.success.main, mr: 0.5 }} />
                  <Typography variant="caption" color="success.main">
                    Datos completos
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: '#fff', 
                borderRadius: 2, 
                boxShadow: `0 4px 10px ${alpha(color, 0.1)}` 
              }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Promedio
                </Typography>
                <Typography variant="h5" fontWeight="bold" color={color}>
                  {prefix}{average.toLocaleString('es-CL')} {unit}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Por categoría
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: '#fff', 
                borderRadius: 2, 
                boxShadow: `0 4px 10px ${alpha(color, 0.1)}` 
              }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Máximo
                </Typography>
                <Typography variant="h5" fontWeight="bold" color={color}>
                  {prefix}{max.toLocaleString('es-CL')} {unit}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Valor más alto
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: '#fff', 
                borderRadius: 2, 
                boxShadow: `0 4px 10px ${alpha(color, 0.1)}` 
              }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Mínimo
                </Typography>
                <Typography variant="h5" fontWeight="bold" color={color}>
                  {prefix}{min.toLocaleString('es-CL')} {unit}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Valor más bajo
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );

  // Calcular valores para las tarjetas de resumen
  const financialSummary = {
    total: Object.values(totalSueldosPorEmpresa).reduce((sum, val) => sum + val, 0),
    average: Object.values(totalSueldosPorEmpresa).reduce((sum, val) => sum + val, 0) / Object.keys(totalSueldosPorEmpresa).length,
    max: Math.max(...Object.values(totalSueldosPorEmpresa)),
    min: Math.min(...Object.values(totalSueldosPorEmpresa))
  };

  const environmentalSummary = {
    total: Object.values(impactoAmbiental).reduce((sum, val) => sum + val, 0),
    average: Object.values(impactoAmbiental).reduce((sum, val) => sum + val, 0) / Object.keys(impactoAmbiental).length,
    max: Math.max(...Object.values(impactoAmbiental)),
    min: Math.min(...Object.values(impactoAmbiental))
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h5" fontWeight="bold" color="primary.main" sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <RecyclingRounded sx={{ mr: 1 }} />
        Panel de Control de Sostenibilidad
      </Typography>

      <Grid container spacing={3}>
        {/* Tarjetas de resumen */}
        <SummaryCard 
          total={financialSummary.total}
          average={financialSummary.average}
          max={financialSummary.max}
          min={financialSummary.min}
          title="Resumen Financiero"
          icon={<AttachMoneyRounded />}
          color={theme.palette.primary.main}
          unit="CLP"
          prefix="$"
        />

        <SummaryCard 
          total={environmentalSummary.total}
          average={environmentalSummary.average}
          max={environmentalSummary.max}
          min={environmentalSummary.min}
          title="Impacto Ambiental"
          icon={<ParkRounded />}
          color={theme.palette.secondary.main}
          unit="kg"
        />
        
        {/* Tarjetas de gráficos KPI */}
        <KPICard
          title="Distribución de Gastos por Empresa"
          icon={<AttachMoneyRounded sx={{ color: '#fff', fontSize: 28 }} />}
          data={totalSueldosPorEmpresa}
          chartType="doughnut"
          formatValue={(value) => `$${value.toLocaleString('es-CL')}`}
          color={theme.palette.primary.main}
          description="Análisis del gasto total en salarios por cada empresa"
        />
        
        <KPICard
          title="Distribución de Gastos por Área"
          icon={<AttachMoneyRounded sx={{ color: '#fff', fontSize: 28 }} />}
          data={totalSueldosPorArea}
          chartType="pie"
          formatValue={(value) => `$${value.toLocaleString('es-CL')}`}
          color={theme.palette.success.main}
          description="Desglose del gasto en salarios por cada área de trabajo"
        />
        
        <KPICard
          title="Distribución de Personal por Empresa"
          icon={<GroupRounded sx={{ color: '#fff', fontSize: 28 }} />}
          data={numTrabajadoresPorEmpresa}
          chartType="doughnut"
          formatValue={(value) => `${value} trabajadores`}
          color={theme.palette.info.main}
          description="Análisis de la distribución de empleados entre empresas"
        />
        
        <KPICard
          title="Material Reciclado Estimado por Empresa"
          icon={<RecyclingRounded sx={{ color: '#fff', fontSize: 28 }} />}
          data={impactoAmbiental}
          chartType="pie"
          formatValue={(value) => `${value.toLocaleString('es-CL')} kg`}
          color={theme.palette.secondary.main}
          description="Impacto ambiental estimado basado en el personal"
        />
      </Grid>
    </Box>
  );
};

export default KPISection;