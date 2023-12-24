import { z } from 'zod'

export const registerSchema = z.object({
    username: z.string().min(2),
    first_name: z.string().min(2),
    last_name: z.string().min(2),
    password: z.string().min(8),
    confirm_password: z.string().min(8),
}).refine((data) => {
    return data.password === data.confirm_password
}, {
    path: ["confirm_password"],
    message: "Password doesn't match"
});