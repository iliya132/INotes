import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import ErrorFallback from './pages/ErrorFallback/errorFallback';
import App from './App';
import './Misc/root.scss';
// import { store } from './store/store';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            {/* <Provider store={store}> */}
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <App />
            </ErrorBoundary>
            {/* </Provider> */}
        </BrowserRouter>
    </React.StrictMode>,
);
