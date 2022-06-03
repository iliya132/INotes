import React, { HTMLInputTypeAttribute } from "react";
import { Icons } from "../Svg/types";

export default interface IInputProps{
    type: HTMLInputTypeAttribute;
    id: string;
    autocomplete?: 'username' | 'email' | 'password' | 'new-password' | 'current-password';
    error?: string,
    className?: string,
    onChange?: React.ChangeEventHandler<HTMLInputElement>,
    icon?: Icons
}