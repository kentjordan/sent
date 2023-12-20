import { createSlice } from "@reduxjs/toolkit";

export interface IActiveChat {
    is_visible: boolean,
    chat_id?: string | undefined,
    first_name: string,
    last_name: string,
    friend_id: string | undefined
    message_id?: string | undefined
}


export interface ISentInitState {
    active_chat: IActiveChat,
    is_new_message_visible: boolean
}

const initialState: ISentInitState = {
    active_chat: {
        is_visible: false,
        chat_id: undefined,
        first_name: '',
        last_name: '',
        friend_id: undefined,
        message_id: undefined,

    },
    is_new_message_visible: false
}

const sentSlice = createSlice({
    name: 'sent',
    initialState,
    reducers: {
        setActiveChat: (state, action) => {
            state.active_chat = action.payload;
        },
        toggleNewMessage: (state) => {
            state.is_new_message_visible = !state.is_new_message_visible;
        },
        resetSentState: (state) => {
            state = {
                ...initialState
            }
        }
    }
});

export const { setActiveChat, resetSentState, toggleNewMessage } = sentSlice.actions;
export const sentReducers = sentSlice.reducer;