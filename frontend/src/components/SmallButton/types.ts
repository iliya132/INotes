import { Icons } from "../Svg/types";

export interface ISmallButtonProps {
    icon: Icons;
    className?: string;
    size?: number;
    disabled?: boolean;
    onClick?: () => void;
    tooltip?: string
}

export interface IMediumButtonProps extends ISmallButtonProps {
    title: string;
}
