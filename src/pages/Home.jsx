import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import DataTable from '../components/DataTable';

const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Cargar el archivo Excel automáticamente
    fetch('/origen-datos-junior.xlsx')
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        console.log('Datos de Excel:', jsonData);  // Verifica los datos cargados
        setData(jsonData);
      })
      .catch((error) => {
        console.error('Error cargando el archivo Excel:', error);
      });
  }, []);

  return (
    <div>
      {data.length > 0 ? (
        <DataTable data={data} />
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
};

export default Home;
