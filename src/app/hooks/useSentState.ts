import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ISentInitState } from "@/redux/sent.slice";

const useSentState = () => {
    return useSelector<RootState, ISentInitState>(
        (state) => state.sent,
    );
}

export default useSentState;