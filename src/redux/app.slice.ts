import { createSlice } from "@reduxjs/toolkit";

export interface IUserJWT {
    iat?: number | undefined;
    exp?: number | undefined;
    id?: string | undefined;
}

export interface IAppInitState {
    accessToken: string | undefined
    user: IUserJWT | undefined
}

export interface IAppState extends IAppInitState {
    setAccessToken: (token: string | undefined) => void
    setUser: (user: IUserJWT) => void
    resetAppState: (initialState: IAppInitState) => void
}

const initialState: IAppInitState = {
    accessToken: undefined,
    user: undefined,
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload
        },
        setUser(state, action) {
            state.user = action.payload;
        },
        resetAppState: (state) => {
            state = {
                ...initialState
            }
        }
    }
});

export const { resetAppState, setAccessToken, setUser } = appSlice.actions;
export const appReducers = appSlice.reducer;