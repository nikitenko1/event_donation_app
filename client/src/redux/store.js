import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import alertSlice from './slices/alertSlice';
import authSlice from './slices/authSlice';
import approvalSlice from './slices/approvalSlice';
import donorEventSlice from './slices/donorEventSlice';
import donorSlice from './slices/donorSlice';
import eventSlice from './slices/eventSlice';
import homeEventSlice from './slices/homeEventSlice';
import newsSlice from './slices/newsSlice';
import ticketSlice from './slices/ticketSlice';
import userSlice from './slices/userSlice';

const store = configureStore({
  reducer: {
    alert: alertSlice,
    auth: authSlice,
    approval: approvalSlice,
    donor_event: donorEventSlice,
    donor: donorSlice,
    event: eventSlice,
    home_event: homeEventSlice,
    news: newsSlice,
    ticket: ticketSlice,
    user: userSlice,
  },
});

const ReduxProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
