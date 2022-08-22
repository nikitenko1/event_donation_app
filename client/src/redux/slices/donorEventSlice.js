import { createSlice } from '@reduxjs/toolkit';

const initialState = { data: [] };

const donorEventSlice = createSlice({
  name: 'donor_event',
  initialState,
  reducers: {
    create: (state, action) => {
      return {
        ...state,
        data: [action.payload, ...state.data],
      };
    },
    get: (state, action) => {
      return {
        ...state,
        data: action.payload,
      };
    },
    update: (state, action) => {
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.payload._id ? action.payload : item
        ),
      };
    },
    delete: (state, action) => {
      return {
        ...state,
        data: state.data.filter((item) => item._id !== action.payload),
      };
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => {
        return (
          action.type.startsWith('donor_event/') &&
          action.type.endsWith('/fulfilled')
        );
      },
      (_, action) => {
        return action.payload;
      }
    );
  },
});

export default donorEventSlice.reducer;
