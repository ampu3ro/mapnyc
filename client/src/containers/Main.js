import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFarms } from '../store/actions/farms';
import { fetchMarkets } from '../store/actions/markets';
import { fetchDistricts } from '../store/actions/districts';
import { setAlert } from '../store/actions/alert';
import { setFilters } from '../store/actions/filters';
import { FILTER_DEFAULT } from '../components/data';
import Homepage from '../components/Homepage';
import AuthForm from '../components/AuthForm';
import BulkEdit from '../components/farm/BulkEdit';
import FarmForm from '../components/farm/FarmForm';
import AdminForm from '../components/AdminForm';
import About from '../components/About';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import logoCUSP from '../images/logos/CUSP.png';
import logoCSB from '../images/logos/CSB.png';
import logoTandon from '../images/logos/Tandon.png';

const Main = () => {
  const alert = useSelector((state) => state.alert);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFarms());
    dispatch(fetchDistricts());
    dispatch(fetchMarkets());
    dispatch(setFilters(FILTER_DEFAULT));
  }, [dispatch]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(setAlert({}));
  };

  return (
    <div>
      <Switch>
        <Route exact path="/">
          <Homepage />
        </Route>
        <Box sx={{ paddingLeft: 4, paddingRight: 4 }}>
          <Route exact path="/signin">
            <AuthForm
              authType="signin"
              buttonText="Log in"
              heading="Welcome back"
            />
          </Route>
          <Route exact path="/signup">
            <AuthForm
              authType="signup"
              buttonText="Sign me up!"
              heading="Join the botaNYC community"
            />
          </Route>
          <Route exact path="/forgot">
            <AuthForm
              authType="forgot"
              buttonText="Reset"
              heading="Forgot your password?"
            />
          </Route>
          <Route path="/reset/:token">
            <AuthForm
              authType="reset"
              buttonText="Update"
              heading="Reset your password"
            />
          </Route>
          <Route exact path="/farm">
            <FarmForm />
          </Route>
          <Route exact path="/bulk">
            <BulkEdit />
          </Route>
          <Route exact path="/admin">
            <AdminForm />
          </Route>
          <Route exact path="/about">
            <About />
          </Route>
        </Box>
      </Switch>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={{ marginTop: 10 }}
      >
        <Grid item>
          <Button
            startIcon={<img src={logoCSB} alt="CSB logo" width="200" />}
            href="https://www.stern.nyu.edu/experience-stern/about/departments-centers-initiatives/centers-of-research/center-sustainable-business"
            target="_blank"
          />
        </Grid>
        <Grid item>
          <Button
            startIcon={<img src={logoCUSP} alt="CUSP logo" width="200" />}
            href="https://cusp.nyu.edu/"
            target="_blank"
          />
        </Grid>
        <Grid item>
          <Button
            startIcon={<img src={logoTandon} alt="CUSP logo" width="200" />}
            href="https://engineering.nyu.edu/"
            target="_blank"
          />
        </Grid>
      </Grid>
      <Snackbar
        open={alert.isActive}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={alert.payload.severity || 'error'}
          variant="filled"
        >
          {alert.payload.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Main;
