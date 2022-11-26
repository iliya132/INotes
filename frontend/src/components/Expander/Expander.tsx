import React from "react";
import { IExpanderProps } from "./types";

export function Expander(props: IExpanderProps) {
    const { isExpanded, children, expanderBody, onClick } = props;

    return (
        <div >
            <div className="expander-head" onClick={onClick}>
                {expanderBody}
            </div>
            {isExpanded ?
                <div className="expander-body">
                    {children}
                </div> :
                undefined}
        </div>
    )
}
