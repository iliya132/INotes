import React, { HTMLInputTypeAttribute } from "react";
import { Icons } from "../Svg/types";

export default interface IInputProps{
    type: HTMLInputTypeAttribute;
    id: string;
    autocomplete?: 'username' | 'email' | 'password' | 'new-password' | 'current-password' | 'disabled';
    error?: string,
    className?: string,
    onChange?: React.ChangeEventHandler<HTMLInputElement>,
    icon?: Icons,
    placeholder?: string,
    defaultValue?: string
}
