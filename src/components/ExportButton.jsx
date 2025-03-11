import React from 'react';
import { Button } from '@mui/material';
import * as XLSX from 'xlsx';  // Importar la librería XLSX

const ExportButton = ({ data }) => {
  // Función para exportar los datos a Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);  // Convertir los datos JSON a una hoja de Excel
    const workbook = XLSX.utils.book_new();  // Crear un nuevo libro de Excel
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');  // Añadir la hoja al libro
    XLSX.writeFile(workbook, 'tabla_datos.xlsx');  // Descargar el archivo Excel
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={exportToExcel}
      style={{ marginBottom: '20px' }}
    >
      Exportar a Excel 1
    </Button>
  );
};

export default ExportButton;
