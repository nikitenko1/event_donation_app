import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDataAPI } from '../../utils/fetchData';

// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const getFilteredEvent = createAsyncThunk(
  'home_event/get',
  async (jobData, thunkAPI) => {
    let categoryQueryStr = '';
    let locationQueryStr = '';

    if (jobData.category.length > 0) {
      for (let i = 0; i < jobData.category.length; i++) {
        if (i !== jobData.category.length - 1) {
          categoryQueryStr += `category=${jobData.category[i]}&`;
        } else {
          categoryQueryStr += `category=${jobData.category[i]}`;
        }
      }
    }

    if (jobData.location.length > 0) {
      for (let i = 0; i < jobData.location.length; i++) {
        if (i !== jobData.location.length - 1) {
          locationQueryStr += `location=${jobData.location[i]}&`;
        } else {
          locationQueryStr += `location=${jobData.location[i]}`;
        }
      }
    }

    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await getDataAPI(
        `event/filter?${categoryQueryStr}&${locationQueryStr}&sort=${jobData.sort}&page=${jobData.page}`
      );

      thunkAPI.dispatch({
        type: 'home_event/get',
        payload: {
          data: res.data.events,
          totalPage: res.data.totalPage,
        },
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

const initialState = {
  totalPage: 0,
  data: [],
};

const homeEventSlice = createSlice({
  name: 'home_event',
  initialState,
  reducers: {
    get: (state, action) => {
      return {
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => {
        return (
          action.type.startsWith('home_event/') &&
          action.type.endsWith('/fulfilled')
        );
      },
      (_, action) => {
        return action.payload;
      }
    );
  },
});

export default homeEventSlice.reducer;
