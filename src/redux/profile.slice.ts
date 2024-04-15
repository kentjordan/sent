import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IProfileInitState {
    activeProfile: {
        userId: string | undefined,
        first_name: string,
        last_name: string,
        bio: string
    },
    activePost: {
        id: string | undefined,
        content?: string
    }
    isEditProfileVisible: boolean
    isSendMessageVisible: boolean
    isCreatePostVisible: boolean
    isDeletePostVisible: boolean
    isUpdatePostVisible: boolean
    isFollowersDialogVisible: boolean
}

export interface IProfileState extends IProfileInitState { }

const initialState: IProfileState = {
    activeProfile: {
        userId: undefined,
        first_name: '',
        last_name: '',
        bio: ''
    },
    activePost: {
        id: undefined
    },
    isEditProfileVisible: false,
    isSendMessageVisible: false,
    isCreatePostVisible: false,
    isUpdatePostVisible: false,
    isDeletePostVisible: false,
    isFollowersDialogVisible: false,
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
        },
        setActivePost: (state, action: PayloadAction<{ id: string, content: string }>) => {
            state.activePost = action.payload
        },
        toggleCreatePost: (state, action: PayloadAction<boolean>) => {
            state.isCreatePostVisible = action.payload
        },
        toggleUpdatePost: (state, action: PayloadAction<boolean>) => {
            state.isUpdatePostVisible = action.payload
        },
        toggleDeletePost: (state, action: PayloadAction<boolean>) => {
            state.isDeletePostVisible = action.payload
        },
        toggleFollowersDialog: (state, action: PayloadAction<boolean>) => {
            state.isFollowersDialogVisible = action.payload
        }
    }
});

export const {
    toggleEditProfile,
    toggleSendMessage,
    setActiveProfile,
    toggleCreatePost,
    toggleUpdatePost,
    toggleDeletePost,
    setActivePost,
    toggleFollowersDialog
} = profileSlice.actions;
export const profileReducer = profileSlice.reducer;