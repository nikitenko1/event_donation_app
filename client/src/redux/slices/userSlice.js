import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import { deleteDataAPI, getDataAPI } from './../../utils/fetchData';

// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const getUser = createAsyncThunk(
  'user/get',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await getDataAPI('user', accessToken);

      thunkAPI.dispatch({
        type: 'user/get',
        payload: res.data.users,
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

export const deleteUser = createAsyncThunk(
  'user/delete',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await deleteDataAPI(`user/${jobData.id}`, accessToken);

      thunkAPI.dispatch({
        type: 'user/delete',
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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    get: (state, action) => {
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
          action.type.startsWith('user/') && action.type.endsWith('/fulfilled')
        );
      },
      (_, action) => {
        return action.payload;
      }
    );
  },
});

export default userSlice.reducer;
