import { INote } from "../../../../store/types";

export default interface ITagButtonProps {
    note: INote | null | undefined;
}

export interface ITag{
    label: string,
    value: string
}