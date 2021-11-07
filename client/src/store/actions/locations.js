import { apiCall } from '../../services/api';
import { SET_LOCATIONS, SET_SELECTED, SET_SEARCH } from '../actionTypes';
import { setAlert } from './alert';

export function setLocations(data) {
  return {
    type: SET_LOCATIONS,
    data,
  };
}

export function fetchLocations() {
  return async (dispatch) => {
    try {
      const data = await apiCall('get', '/api/loc/fetch');
      return dispatch(setLocations(data));
    } catch (err) {
      dispatch(setAlert({ message: err?.message }));
      return dispatch(setLocations({}));
    }
  };
}

export function setSelected(data) {
  return {
    type: SET_SELECTED,
    data,
  };
}

export const setSearch = (payload) => ({
  type: SET_SEARCH,
  payload,
});
