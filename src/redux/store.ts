import { configureStore } from '@reduxjs/toolkit';
import { sentReducers } from './sent.slice';
import { appReducers } from './app.slice';

export const store = configureStore({
    reducer: {
        app: appReducers,
        sent: sentReducers
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch