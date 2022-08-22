import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import {
  deleteDataAPI,
  getDataAPI,
  patchDataAPI,
  postDataAPI,
} from './../../utils/fetchData';
import { uploadImages } from './../../utils/imageHelper';

// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const getEvent = createAsyncThunk('event/get', async (_, thunkAPI) => {
  try {
    thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

    const res = await getDataAPI('event');

    thunkAPI.dispatch({
      type: 'event/get',
      payload: res.data.events,
    });

    thunkAPI.dispatch({ type: 'alert/alert', payload: {} });
  } catch (err) {
    thunkAPI.dispatch({
      type: 'alert/alert',
      payload: { errors: err.response.data.msg },
    });
  }
});

export const createEvent = createAsyncThunk(
  'event/create',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    const imageRes = await uploadImages([jobData.picture]);
    let imageUrl = imageRes[0];
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await postDataAPI(
        'event',
        { ...jobData.eventData, picture: imageUrl },
        accessToken
      );

      thunkAPI.dispatch({
        type: 'event/create',
        payload: res.data.event,
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

export const registerEvent = createAsyncThunk(
  'event/register',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await patchDataAPI(`event/${jobData.id}`, {}, accessToken);

      thunkAPI.dispatch({
        type: 'event/register',
        payload: { ...jobData.id, user: jobData.user._id },
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

export const getEventDonor = createAsyncThunk(
  'event/get_event_donor',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      const res = await getDataAPI(`event/donor`, accessToken);

      thunkAPI.dispatch({
        type: 'event/get_event_donor',
        payload: res.data.events,
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { errors: err.response.data.msg },
      });
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'event/delete',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await deleteDataAPI(`event/${jobData.id}`, accessToken);

      thunkAPI.dispatch({
        type: 'event/delete',
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

export const updateEvent = createAsyncThunk(
  'event/update',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    let imageResult = '';
    if (jobData.picture && typeof jobData.picture !== 'string') {
      imageResult = await uploadImages([jobData.picture]);
    }
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await patchDataAPI(
        `event/edit/${jobData.id}`,
        {
          ...jobData.eventData,
          picture: imageResult ? imageResult[0] : jobData.picture,
        },
        accessToken
      );

      thunkAPI.dispatch({
        type: 'event/update',
        payload: res.data.event,
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

const initialState = {
  data: [],
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    get: (state, action) => {
      return {
        ...state,
        data: action.payload,
      };
    },
    delete: (state, action) => {
      return {
        ...state,
        data: state.data.filter((item) => item._id !== action.payload),
      };
    },
    register: (state, action) => {
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.payload.id
            ? { ...item, registrant: [...item.registrant, action.payload.user] }
            : item
        ),
      };
    },
  },
});

export default eventSlice.reducer;
