import { User } from "../../store/types";

export interface IProfileProps{
    hidden?: boolean | null;
    user: User;
}
