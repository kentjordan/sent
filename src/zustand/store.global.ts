import { create } from 'zustand';
import { IActiveChat, IGlobalState, IUserJWT } from './types';

const useGlobalStore = create<IGlobalState>((set) => ({
    access_token: undefined,
    active_chat: {
        is_visible: false,
        chat_id: undefined,
        first_name: '',
        last_name: '',
        friend_id: undefined,
        message_id: undefined
    },
    user: {
        iat: undefined,
        exp: undefined,
        id: undefined
    },
    is_new_message_visible: false,
    setTokens: (access_token: string) => {
        set((state: IGlobalState) => ({
            ...state,
            access_token
        }));
    },
    setUser: (user: IUserJWT) => {
        set((state: IGlobalState) => ({
            ...state,
            user
        }));
    },
    setActiveChat(active_chat: IActiveChat) {
        set((state: IGlobalState) => ({
            ...state,
            active_chat
        }));
    },
    toggleNewMessage() {
        set((state: IGlobalState) => {
            return {
                ...state,
                is_new_message_visible: !state.is_new_message_visible
            }
        })
    }
}));

export default useGlobalStore;