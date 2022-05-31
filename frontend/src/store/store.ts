/* eslint no-underscore-dangle: ["error", { "allow": ["__PRELOADED_STATE__"] }] */
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';


export const store = configureStore({
    reducer: {
    },
    middleware: [thunk],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
