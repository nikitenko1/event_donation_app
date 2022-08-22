import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import { deleteDataAPI, getDataAPI } from '../../utils/fetchData';

// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const getDonor = createAsyncThunk(
  'donor/get_verified_donor',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await getDataAPI('donor/verified', accessToken);

      thunkAPI.dispatch({
        type: 'donor/get_verified_donor',
        payload: res.data.donors,
      });

      thunkAPI.dispatch({ type: 'alert/alert', payload: {} });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { errors: err.response.data.msg },
      });
    }
  }
);

export const deleteDonor = createAsyncThunk(
  'donor/delete',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await deleteDataAPI(`donor/${jobData.id}`, accessToken);

      thunkAPI.dispatch({
        type: 'donor/delete',
        payload: jobData.id,
      });

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: res.data.msg,
        },
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { errors: err.response.data.msg },
      });
    }
  }
);

const initialState = [];

const donorEventSlice = createSlice({
  name: 'donor',
  initialState,
  reducers: {
    get_verified_donor: (state, action) => {
      return action.payload;
    },
    delete: (state, action) => {
      return state.filter((item) => item._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => {
        return (
          action.type.startsWith('donor/') && action.type.endsWith('/fulfilled')
        );
      },
      (_, action) => {
        return action.payload;
      }
    );
  },
});

export default donorEventSlice.reducer;
