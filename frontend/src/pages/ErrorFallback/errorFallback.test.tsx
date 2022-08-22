/* eslint-disable no-undef */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './errorFallback';

const ErrorComponent:JSX.Element = () => {
    throw new Error();
}

describe('error fallback test', () => {
    test('it can render', () => {
        wrapWithErrorFallback();
    });

    test('it can be shown', () => {
        wrapWithErrorFallback()
        const elem = screen.getByText('Sorry, something went wrong.')
        expect(elem).not.toBeNull();
    });
});

function wrapWithErrorFallback() {
    return render(
        <React.StrictMode>
            <BrowserRouter>
                <ErrorBoundary FallbackComponent={ErrorFallback}><ErrorComponent/></ErrorBoundary>
            </BrowserRouter>
        </React.StrictMode>,
    );
}
