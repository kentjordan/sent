import { createSlice } from "@reduxjs/toolkit";

export interface IProfileInitState {
    activeProfile: {
        userId: string | undefined,
        first_name: string,
        last_name: string,
        bio: string
    }
    isEditProfileVisible: boolean
    isSendMessageVisible: boolean
}

export interface IProfileState extends IProfileInitState { }

const initialState: IProfileState = {
    activeProfile: {
        userId: undefined,
        first_name: '',
        last_name: '',
        bio: ''
    },
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
        },
        setActiveProfile: (state, action) => {
            state.activeProfile = action.payload
        }
    }
});

export const { toggleEditProfile, toggleSendMessage, setActiveProfile } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;