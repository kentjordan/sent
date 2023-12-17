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