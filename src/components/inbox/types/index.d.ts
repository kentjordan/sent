export interface IChat {
    created_at: string;
    chat_id: string;
    friend_id: string;
    first_name: string;
    last_name: string;
    message: string;
    is_seen: boolean;
}