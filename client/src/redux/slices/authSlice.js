import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import { getDataAPI, patchDataAPI, postDataAPI } from './../../utils/fetchData';
import { uploadImages } from './../../utils/imageHelper';

// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await postDataAPI('auth/register', userData);

      thunkAPI.dispatch({
        type: 'auth/auth',
        payload: {
          user: res.data.user,
          accessToken: res.data.accessToken,
        },
      });

      localStorage.setItem('learnify_firstLogin', 'true');

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { errors: err.response.data.msg },
      });
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await postDataAPI('auth/login', userData);

      localStorage.setItem('learnify_firstLogin', 'true');

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });

      return {
        user: res.data.user,
        token: res.data.accessToken,
      };
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { errors: err.response.data.msg },
      });
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      const res = await getDataAPI('auth/logout', accessToken);
      localStorage.removeItem('learnify_firstLogin');

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });

      return {};
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, thunkAPI) => {
    try {
      const firstLogin = localStorage.getItem('learnify_firstLogin');
      if (firstLogin !== 'true') return;

      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await getDataAPI('auth/refresh_token');

      thunkAPI.dispatch({ type: 'alert/alert', payload: {} });

      return {
        user: res.data.user,
        accessToken: res.data.accessToken,
      };
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const editProfile = createAsyncThunk(
  'auth/edit_profile',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      let avatarUrl = '';

      if (jobData.tempAvatar.length > 0) {
        let url = await uploadImages(jobData.tempAvatar, 'avatar');
        avatarUrl = url[0];
      }
      const res = await patchDataAPI(
        'auth/profile',
        {
          ...jobData,
          avatar: avatarUrl ? avatarUrl : jobData.tempAvatar,
        },
        accessToken
      );

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: res.data.msg,
        },
      });

      return {
        accessToken: jobData.token,
        user: res.data.user,
      };
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { errors: err.response.data.msg },
      });
    }
  }
);

const initialState = {};

const authSlice = createSlice({
  name: 'auth',
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
          action.type.startsWith('auth/') && action.type.endsWith('/fulfilled')
        );
      },
      (_, action) => {
        return action.payload;
      }
    );
  },
});

export default authSlice.reducer;
