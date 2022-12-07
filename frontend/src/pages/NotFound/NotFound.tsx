import React from "react";

export function NotFound(): JSX.Element {
    location.reload(); // handled by nginx on prod
    return (<></>);
}
