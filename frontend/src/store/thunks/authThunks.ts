import axios from "axios";
import properties from "../../properties/properties";
import { auth, authError, setIsLoaded } from "../reducers/authReducer";
import { AppDispatch } from "../store";
import { User } from "../types";

const baseUrl = properties.apiUrl;
const authUrl = baseUrl + "auth/";

export function fetchUser() {
    return async function fetchUsr(dispatch: AppDispatch) {
        axios.get(authUrl + "user", { withCredentials: true })
            .then(response => {
                dispatch(auth(response.data as User));
                dispatch(setIsLoaded(true));
            })
            .catch(reason => {
                dispatch(authError(reason.message))
                dispatch(setIsLoaded(true));
            })
    }
}
