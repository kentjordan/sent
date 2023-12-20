export interface IPrivateMessage {
    id: string;
    created_at: string;
    updated_at: string;
    chat_id: string;
    friend_id: string;
    first_name: string;
    last_name: string;
    message: string;
}

export interface IMessage {
    id: string;
    created_at: string;
    updated_at: string;
    message: string;
    chat_id: string;
    user0_id: string;
    user1_id: string;
    is_seen: boolean;
}
