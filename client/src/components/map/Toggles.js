import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setDisplay,
  setColorBy,
  setSizeBy,
  setDensityBy,
  setPoi,
} from '../../store/actions/toggles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Checkbox from '@mui/material/Checkbox';
import { POI_PROPS } from '../data';

const DISPLAY = [
  { name: 'farm', label: 'Point locations' },
  { name: 'district', label: 'Community district density' },
];
const COLOR_BY = [
  { name: 'type', label: 'Type' },
  { name: 'distro1', label: 'Primary distribution channel' },
  { name: 'none', label: 'None' },
];
const SIZE_BY = [
  { name: 'area', label: 'Lot/farm area' },
  { name: 'production', label: 'Crop production' },
  { name: 'none', label: 'None' },
];
const DENSITY_BY = [
  { name: 'count', label: 'Farm/garden count' },
  { name: 'countCapita', label: 'Count per capita' },
  { name: 'area', label: 'Total lot/farm area' },
  { name: 'areaCapita', label: 'Area per capita' },
  { name: 'production', label: 'Total crop production' },
  { name: 'productionCapita', label: 'Production per capita' },
];

const RadioGroupControl = ({ label, value, options, setter }) => {
  const dispatch = useDispatch();

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <RadioGroup
        value={value}
        onChange={(e) => dispatch(setter(e.target.value))}
      >
        {options.map(({ name, label }) => (
          <FormControlLabel
            key={name}
            value={name}
            label={label}
            control={<Radio />}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

const Toggles = () => {
  const display = useSelector((state) => state.display);
  const colorBy = useSelector((state) => state.colorBy);
  const sizeBy = useSelector((state) => state.sizeBy);
  const densityBy = useSelector((state) => state.densityBy);
  const poi = useSelector((state) => state.poi);

  const dispatch = useDispatch();

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={4}>
        <Grid item>
          <RadioGroupControl
            label="Display data as"
            value={display}
            options={DISPLAY}
            setter={setDisplay}
          />
        </Grid>
        {display === 'farm' && (
          <Grid item>
            <RadioGroupControl
              label="Color farms/gardens by"
              value={colorBy}
              options={COLOR_BY}
              setter={setColorBy}
            />
          </Grid>
        )}
        {display === 'farm' && (
          <Grid item>
            <RadioGroupControl
              label="Size farms/gardens by"
              value={sizeBy}
              options={SIZE_BY}
              setter={setSizeBy}
            />
          </Grid>
        )}
        {display === 'district' && (
          <Grid item>
            <RadioGroupControl
              label="Density variable"
              value={densityBy}
              options={DENSITY_BY}
              setter={setDensityBy}
            />
          </Grid>
        )}
        <Grid item>
          <FormControl>
            <FormLabel>Show points of interest</FormLabel>
            <FormGroup>
              {POI_PROPS.map(({ id, label }) => (
                <FormControlLabel
                  key={id}
                  label={label}
                  control={
                    <Checkbox
                      checked={poi[id]}
                      onChange={() => dispatch(setPoi({ [id]: !poi[id] }))}
                    />
                  }
                />
              ))}
            </FormGroup>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Toggles;
