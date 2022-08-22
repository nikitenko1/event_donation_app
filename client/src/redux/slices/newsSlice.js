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
export const getNews = createAsyncThunk(
  'news/get',
  async (jobData, thunkAPI) => {
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await getDataAPI('news');

      thunkAPI.dispatch({
        type: 'news/get',
        payload: res.data.news,
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

export const createNews = createAsyncThunk(
  'news/create',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    let imageUrl = await uploadImages([jobData.picture]);
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await postDataAPI(
        'news',
        { ...jobData.newsData, picture: imageUrl[0] },
        accessToken
      );

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

export const deleteNews = createAsyncThunk(
  'news/delete',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await deleteDataAPI(`news/${jobData.id}`, accessToken);

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

export const updateNews = createAsyncThunk(
  'news/update',
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
        `news/${jobData.id}`,
        {
          ...jobData.newsData,
          picture: imageResult ? imageResult[0] : jobData.picture,
        },
        accessToken
      );
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
  totalPage: 0,
  data: [],
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    create: (state, action) => {
      return [action.payload, ...state];
    },
    get: (state, action) => {
      return action.payload;
    },
    update: (state, action) => {
      return state.map((item) =>
        item._id === action.payload._id ? action.payload : item
      );
    },
    delete: (state, action) => {
      return state.filter((item) => item._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => {
        return (
          action.type.startsWith('news/') && action.type.endsWith('/fulfilled')
        );
      },
      (_, action) => {
        return action.payload;
      }
    );
  },
});

export default newsSlice.reducer;
