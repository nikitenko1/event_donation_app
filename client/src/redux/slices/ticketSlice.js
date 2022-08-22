import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import { getDataAPI } from './../../utils/fetchData';

// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const getTicket = createAsyncThunk(
  'ticket/get',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await getDataAPI('event/ticket', accessToken);

      thunkAPI.dispatch({
        type: 'ticket/get',
        payload: res.data.events,
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

const initialState = [];

const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    get: (state, action) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => {
        return (
          action.type.startsWith('ticket/') &&
          action.type.endsWith('/fulfilled')
        );
      },
      (_, action) => {
        return action.payload;
      }
    );
  },
});

export default ticketSlice.reducer;
