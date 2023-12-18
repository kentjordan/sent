export interface IGlobalState {
    access_token?: string | undefined,
    active_chat: IActiveChat,
    is_new_message_visible: boolean;
    setActiveChat: (active_chat: IActiveChat) => void;
    setAccessToken: (token: string) => void
    user: IUserJWT
    setUser: (user: IUserJWT) => void
    toggleNewMessage: () => void
}

export interface IUserJWT {
    iat?: number | undefined;
    exp?: number | undefined;
    id?: string | undefined;
}

export interface IActiveChat {
    is_visible: boolean,
    chat_id?: string | undefined,
    first_name: string,
    last_name: string,
    friend_id: string | undefined
    message_id?: string | undefined
}