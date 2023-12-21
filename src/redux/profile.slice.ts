import { createSlice } from "@reduxjs/toolkit";

export interface IProfileInitState {
    isEditProfileVisible: boolean
    isSendMessageVisible: boolean

}

export interface IProfileState extends IProfileInitState { }

const initialState: IProfileState = {
    isEditProfileVisible: false,
    isSendMessageVisible: false

}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        toggleEditProfile: (state) => {
            state.isEditProfileVisible = !state.isEditProfileVisible
        },
        toggleSendMessage: (state) => {
            state.isSendMessageVisible = !state.isSendMessageVisible
        }

    }
});

export const { toggleEditProfile, toggleSendMessage } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;