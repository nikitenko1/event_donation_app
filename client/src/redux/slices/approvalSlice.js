import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import { getDataAPI, patchDataAPI } from './../../utils/fetchData';

// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const getUnverifiedDonor = createAsyncThunk(
  'approval/get_unverified_donor',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await getDataAPI('donor/unverified', accessToken);

      thunkAPI.dispatch({
        type: 'approval/get_unverified_donor',
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

export const verifyDonor = createAsyncThunk(
  'approval/change_status',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await patchDataAPI(
        `donor/accept/${jobData.id}`,
        {},
        accessToken
      );

      thunkAPI.dispatch({
        type: 'approval/change_status',
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

export const rejectDonor = createAsyncThunk(
  'approval/change_status',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await patchDataAPI(
        `donor/reject/${jobData.id}`,
        {},
        accessToken
      );

      thunkAPI.dispatch({
        type: 'approval/change_status',
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

const approvalSlice = createSlice({
  name: 'approval',
  initialState,
  reducers: {
    get_unverified_donor: (state, action) => {
      return action.payload;
    },
    change_status: (state, action) => {
      return state.filter((item) => item._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => {
        return (
          action.type.startsWith('approval/') &&
          action.type.endsWith('/fulfilled')
        );
      },
      (_, action) => {
        return action.payload;
      }
    );
  },
});

export default approvalSlice.reducer;
