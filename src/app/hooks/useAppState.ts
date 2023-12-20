import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { IAppInitState } from "@/redux/app.slice";

const useAppState = () => {
    return useSelector<RootState, IAppInitState>(
        (state) => state.app,
    );
}

export default useAppState;