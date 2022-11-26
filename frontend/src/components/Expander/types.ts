export interface IExpanderProps {
    isExpanded: boolean;
    expanderBody: JSX.Element;
    children: JSX.Element;
    onClick?: () => void;
}
