import React from "react";
import styles from "./foundResult.scss";
import { IFoundResultProps } from "./types";

export function FoundResult(props: IFoundResultProps){
    const {onClick} = props;
    const contextHtml = {__html: props.context.replace("%%", `<div class=${styles["context-highlight"]}>`).replace("%%", "</div>")};
    
    return (
        <div className={styles["result-container"]} onClick={onClick}>
            <div className={styles["result-title"]}>{props.title}</div>
            <div className={styles["result-context"]} dangerouslySetInnerHTML={contextHtml}></div>
        </div>
    )
}
