/* eslint-disable no-unused-vars */
export interface ICheckboxProps {
    defaultValue?: boolean;
    id: string;
    className?: string;
    onChanged? : (newValue:boolean) => void;
    title?: string;
}
