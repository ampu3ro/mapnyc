import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { geocode, setGeocoded } from '../../store/actions/maps';
import {
  setEdit,
  deleteOne,
  editOne,
  submitOne,
  setSelected,
  setSearch,
} from '../../store/actions/farms';
import { FARM_PROPS, FARM_DEFAULT, ENVIRONMENTS } from '../data';
import Header from '../Header';
import SectionHeader from './SectionHeader';
import { TextForm, SelectForm, DateForm, NumericGridForm } from './Inputs';
import { VerifyDialog, DeleteDialog } from './Dialogs';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';

const FarmForm = () => {
  const [formatted, setFormatted] = useState(''); // current selection in formatted address verification dialog
  const [verified, setVerified] = useState(''); // verified address from dialog selection
  const [openVerify, setOpenVerify] = useState(false);
  const [push, setPush] = useState(false); // push edit/submission to db
  const [openDelete, setOpenDelete] = useState(false);

  const currentUser = useSelector((state) => state.currentUser);
  const farm = useSelector((state) => state.farm);
  const geocoded = useSelector((state) => state.geocoded);
  const edit = useSelector((state) => state.edit);

  const history = useHistory();
  const dispatch = useDispatch();
  const methods = useForm({ defaultValues: FARM_DEFAULT });
  const { getValues, setValue, watch, reset, control } = methods;

  const watchEnviro = watch('environments', []);
  const watchEnviroDetails = watch('enviroDetails', []);
  const watchGrowMethods = watch('growMethods', []);
  const watchCompost = watch('compost', '');

  let searchOptions = farm.features;
  if (!currentUser.isAdmin && searchOptions) {
    searchOptions = searchOptions.filter(
      ({ properties }) =>
        properties.authUsers &&
        properties.authUsers.includes(currentUser.user.username)
    );
  }

  const handleClear = useCallback(() => {
    setPush(false);
    dispatch(setEdit(''));
    dispatch(setGeocoded([]));
    reset();
  }, [dispatch, reset]);

  const handleDelete = () => {
    const data = getValues();
    dispatch(deleteOne({ data })).then(() => dispatch(setSelected(null)));
    handleClear();
    setOpenDelete(false);
  };

  const onSubmit = (data) => {
    const { address } = data;
    if (!edit || edit.properties.address !== address) {
      setPush(false);
      dispatch(geocode({ address }));
    } else {
      setPush(true);
    }
  };

  const handleVerify = () => {
    setVerified(formatted);
    setOpenVerify(false);
    setPush(true);
  };

  useEffect(() => {
    if (edit && edit.properties) {
      Object.entries(edit.properties).forEach(([k, v]) => setValue(k, v));
    }
  }, [edit, setValue]);

  useEffect(() => {
    if (geocoded.length) {
      setFormatted(geocoded[0].formattedAddress);
      setOpenVerify(true);
    }
  }, [geocoded]);

  useEffect(() => {
    if (!push) return;

    let data = getValues();

    const area =
      (parseInt(data.areaCellar) || 0) +
      (parseInt(data.areaGround) || 0) +
      (parseInt(data.areaFloor1) || 0) +
      (parseInt(data.areaFloor2) || 0) +
      (parseInt(data.areaRoof) || 0) +
      (parseInt(data.areaOther) || 0);
    if (area > 0) {
      data.area = area; // filtering fields with 0 length below
    }
    const { socials } = data;
    if (socials && !Array.isArray(socials)) {
      data.socials = socials.split(',');
    }

    if (geocoded.length && verified !== '') {
      const g = geocoded.filter((d) => d.formattedAddress === verified)[0];
      data = {
        ...data,
        address: g.formattedAddress,
        lat: g.latitude,
        lon: g.longitude,
      };
    }

    data.modifiedBy = currentUser.user.email;

    // only update fields with data
    data = Object.keys(data)
      .filter((k) => typeof data[k] === 'number' || (data[k] && data[k].length))
      .reduce((a, k) => Object.assign(a, { [k]: data[k] }), {});

    if (
      currentUser.isAdmin ||
      (edit && edit.properties.authUsers.includes(currentUser.user.username))
    ) {
      dispatch(editOne({ currentUser, data })).then(({ features }) => {
        const feature = features
          .filter((d) => d.properties.name === data.name)
          .sort(
            (a, b) =>
              Date.parse(b.properties.updatedAt) -
              Date.parse(a.properties.updatedAt)
          )[0];
        dispatch(setSelected({ ...feature, fly: true }));
        handleClear();
      });
    } else {
      dispatch(submitOne(data)).then(() => handleClear());
    }
    dispatch(setSearch(''));
    history.push('/');

    return () => setPush(false);
  }, [
    push,
    getValues,
    edit,
    currentUser,
    geocoded,
    verified,
    dispatch,
    history,
    handleClear,
  ]);

  const floors = FARM_PROPS.floors.fields.filter((d) => {
    let re = new RegExp(d.pattern, 'i');
    return (
      watchEnviro.some((x) => re.test(x)) ||
      watchEnviroDetails.some((x) => re.test(x))
    );
  });

  const marks = Array(5)
    .fill()
    .map((d, i) => i * 20 + 20)
    .map((d) => ({ value: d, label: `${d}%` }));

  return (
    <div>
      <FormProvider {...methods}>
        <Header text=" Add New or Edit Existing Farm/Garden Location" />
        {!!searchOptions && searchOptions.length > 0 && (
          <FormControl fullWidth>
            <Autocomplete
              options={searchOptions}
              freeSolo
              value={edit}
              onChange={(e, v) => dispatch(setEdit(v))}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Existing Locations to Edit"
                />
              )}
            />
            <FormHelperText>
              Leave blank to create a new farm/garden location
            </FormHelperText>
          </FormControl>
        )}
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Button variant="outlined" color="secondary" onClick={handleClear}>
              Clear Form
            </Button>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item md={11}>
            <Stack spacing={2}>
              <SectionHeader text="Farm/Garden Characteristics" />
              <TextForm name="address" />
              <TextForm name="name" />
              <TextForm name="orgName" />
              <TextForm name="headquarters" />
              <TextForm name="website" />
              <TextForm name="socials" />
              <SelectForm name="type" />
              <SelectForm name="environments" />
              {!!watchEnviro.length && (
                <SelectForm
                  name="enviroDetails"
                  label="Location detail"
                  options={watchEnviro.map((d) => ENVIRONMENTS[d]).flat()}
                  multiple
                />
              )}
              {!!floors.length && (
                <NumericGridForm name="floors" fields={floors} adorn="sqft" />
              )}
              <Controller
                name="percentFood"
                control={control}
                defaultValue={80}
                render={({ field }) => (
                  <FormControl>
                    <Grid container>
                      <Grid item md={6}>
                        <FormLabel>
                          How much of your space is dedicated to food
                          production?
                        </FormLabel>
                        <Slider
                          step={1}
                          min={0}
                          max={100}
                          valueLabelDisplay="auto"
                          valueLabelFormat={(v) => `${v}%`}
                          marks={marks}
                          {...field}
                        />
                      </Grid>
                    </Grid>
                  </FormControl>
                )}
              />
              <FormControl>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <SelectForm name="orgType" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <SelectForm name="bCorp" />
                  </Grid>
                </Grid>
              </FormControl>
              <SelectForm name="priorities" />
              <SelectForm name="accessibility" />
              <SelectForm name="publicity" />
              <SectionHeader text="Food Production" />
              <SelectForm name="growMethods" />
              {watchGrowMethods.join(',').includes('Aqua') && (
                <SelectForm name="aquaculture" />
              )}
              {watchGrowMethods.join(',').includes('ponics') && (
                <SelectForm name="aquaponics" />
              )}
              <SelectForm name="iot" />
              <SelectForm name="usdaOrganic" />
              <SelectForm name="compost" />
              {watchCompost === 'Off-site' && (
                <SelectForm name="compostOffsite" />
              )}
              {watchCompost === 'On-site' && (
                <SelectForm name="compostOnsite" />
              )}
              <SelectForm name="wastewater" />
              <SelectForm name="dischargePermit" />
              <SectionHeader text="Harvest, processing, and distribution" />
              <NumericGridForm name="crops" adorn="lbs" />
              <NumericGridForm name="distros" adorn="lbs" />
              <SelectForm name="distroRegion" />
              <SectionHeader text="Land ownership and use" />
              <Grid container>
                <Grid item md={6}>
                  <DateForm name="founding" views={['year']} />
                </Grid>
              </Grid>
              <SelectForm name="ownership" />
              <SelectForm name="zoning" />
              <FormControl>
                <FormLabel sx={{ marginBottom: 1 }}>
                  What is the start and end date of your current lease
                  agreement?
                </FormLabel>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <DateForm name="leaseStart" />
                  </Grid>
                  <Grid item xs={6}>
                    <DateForm name="leaseEnd" />
                  </Grid>
                </Grid>
              </FormControl>
              <TextForm name="rent" />
              <TextForm name="landValue" />
              <SectionHeader text="Labor" />
              <SelectForm name="fullTime" />
              <SelectForm name="farmHand" />
              <SelectForm name="farmManager" />
              <SelectForm name="opsManager" />
              <SelectForm name="eventsManager" />
              <SelectForm name="partTime" />
              <SelectForm name="volunteers" />
              <SelectForm name="volunteerHours" />
              <SelectForm name="localWorkers" />
              <SectionHeader text="Enrichment opportunities" />
              <SelectForm name="studentPrograms" />
              <SelectForm name="skillsPrograms" />
              <TextForm name="outreachHours" />
              <SelectForm name="incomeSources" />
              <SelectForm name="capInvestments" />
              <SelectForm name="renewableEnergy" />
              {currentUser.isAdmin && (
                <Stack spacing={2}>
                  <SectionHeader text="Database Admin" />
                  <TextForm name="authUsers" label="Users Authorized to Edit" />
                </Stack>
              )}
              <Stack direction="row" spacing={2}>
                {!!edit && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setOpenDelete(true)}
                  >
                    Delete
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={methods.handleSubmit(onSubmit)}
                >
                  Submit
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>

      <VerifyDialog
        open={openVerify}
        formatted={formatted}
        setFormatted={setFormatted}
        handleClose={() => setOpenVerify(false)}
        handleVerify={handleVerify}
      />
      <DeleteDialog
        open={openDelete}
        handleClose={() => setOpenDelete(false)}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default FarmForm;
