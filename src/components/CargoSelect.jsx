import React, { useMemo } from 'react';
import { TextField, MenuItem, InputLabel, FormControl, Select, FormHelperText } from '@mui/material';

const CargoSelect = ({ cargos, onChange, value, error }) => {
  // Memorizar la lista de cargos para evitar recalcularla en cada renderizado
  const memoizedCargos = useMemo(() => cargos, [cargos]);

  return (
    <FormControl fullWidth error={error} sx={{ marginBottom: '20px' }}>
      <InputLabel id="cargo-select-label">Cargo</InputLabel>
      <Select
        labelId="cargo-select-label"
        id="cargo-select"
        value={value}
        onChange={(e) => onChange(e.target.value)} // pasa el valor seleccionado
        label="Cargo"
      >
        <MenuItem value="">
          <em>Selecciona un cargo</em>
        </MenuItem>
        {memoizedCargos.map((cargo, index) => (
          <MenuItem key={index} value={cargo}>
            {cargo}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>Por favor selecciona un cargo</FormHelperText>}
    </FormControl>
  );
};

export default CargoSelect;
