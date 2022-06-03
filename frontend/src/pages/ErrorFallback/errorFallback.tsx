import React from 'react';
import { FallbackProps } from 'react-error-boundary';

export default function errorFallback(errors: FallbackProps) {
    return (
        <div>
            <span>Sorry, something went wrong.</span>
            <br />
            <span>{errors.error.message}</span>
        </div>
    );
}
