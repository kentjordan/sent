import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { IProfileInitState } from "@/redux/profile.slice";

const useProfileState = () => {
    return useSelector<RootState, IProfileInitState>(
        (state) => state.profile,
    );
}

export default useProfileState;