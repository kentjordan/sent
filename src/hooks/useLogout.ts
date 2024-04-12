import { resetAppState } from "@/redux/app.slice";
import { resetSentState } from "@/redux/sent.slice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useRouter } from "next/navigation";

const useLogout = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    return () => {
        // TODO: Fix logout, it can't remove refreshToken in the cookies
        (async () => {
            dispatch(resetAppState());
            dispatch(resetSentState());
            await axios.get(`${process.env.API_HOSTNAME}/auth/logout`, {
                withCredentials: true,
            });
            router.replace("/login");
        })();

    }

};


export default useLogout;