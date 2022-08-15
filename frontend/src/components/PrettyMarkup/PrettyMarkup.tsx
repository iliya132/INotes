import React from 'react';
import { IPrettyMarkupProps } from './types';
import styles from './PrettyMarkup.scss';
import classNames from 'classnames';
import './PrettyMarkupStatic.css';
import sanitizeHtml from 'sanitize-html';

export function PrettyMarkup(props: IPrettyMarkupProps) {
    const { renderedValue, className } = props;
    const toRender = sanitize(renderedValue);
    return (
        <div
            data-testid="pretty-view"
            className={classNames(styles['workfield-content-display-field'], className)}
            dangerouslySetInnerHTML={{ __html: toRender }}></div>
    );
}

const defaults = sanitizeHtml.defaults
const config = {
    allowedTags: [...defaults.allowedTags, "img"],
    allowedAttributes: {...defaults.allowedAttributes, "*": ["class"]}
}

function sanitize(toSanitize: string): string {
    return sanitizeHtml(toSanitize, config)
}
