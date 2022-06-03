import { MouseEventHandler } from "react";

export interface IButtonProps {
    title: string,
    className?: string,
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}