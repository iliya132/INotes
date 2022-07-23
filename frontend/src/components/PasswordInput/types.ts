import React from "react";

export default interface IInputProps{
    id: string;
    error?: string,
    className?: string,
    onChange?: React.ChangeEventHandler<HTMLInputElement>,
    autocomplete?: 'password' | 'new-password',
    placeholder?: string,
    name?: string
}
