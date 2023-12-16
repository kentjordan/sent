import axios from "axios";
import jwt, { JsonWebTokenError } from 'jsonwebtoken';

const ax = new axios.Axios()

ax.interceptors.request.use(async (val) => {

    const token = val.headers.Authorization?.toString().split(" ").at(1);

    try {
    
        jwt.verify(token as string, 'TOP_SECRET_KEY');
    
    } catch (error) {
        
        if (error instanceof JsonWebTokenError) {
            
            const res = await axios.patch('http://localhost:3001/auth/refresh', {
                access_token: token
            });

            val.headers.Authorization = ''
        }
    }

    return val

}, (err) => {
    return err;
});

export default axios