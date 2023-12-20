import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import * as jwt from "jsonwebtoken";
import useAppState from "./useAppState";
import { useDispatch } from "react-redux";
import { IUserJWT, setAccessToken, setUser } from "@/redux/app.slice";

const useRegisterAccount = <T>(router?: AppRouterInstance) => {

    const dispatch = useDispatch();

    const API_URL = `${process.env.API_HOSTNAME}/auth/signup`;

    return useMutation({
        mutationFn: (data: T) => axios.post(API_URL, data),
        onSuccess(res, variables, context) {
            const { access_token } = res.data;
            const user = jwt.decode(access_token) as IUserJWT;

            dispatch(setAccessToken(access_token));
            dispatch(setUser(user));

            router?.replace("/inbox");
        },
        onError(error, variables, context) {
            if (error instanceof AxiosError) {
                alert(`${error.response?.data.error}: ${error.response?.data.message}`)
            }
        },
    })
}

export default useRegisterAccount