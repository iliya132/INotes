/* eslint-disable no-undef */
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { GuardRoute } from './guardRoute';
import { act } from 'react-dom/test-utils';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

//#region common setup
let root: Root | null = null;
let container: Element | null = null;
beforeEach(() => {
    act(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        root = createRoot(container);
    });
});

afterEach(() => {
    act(() => {
        root!.unmount();
        container!.remove();
        container = null;
    });
});
//#endregion

describe('Test GuardRoute component', () => {
    it('can be rendered', () => {
        act(() => {
            root!.render(
                <MemoryRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <GuardRoute canActivate={true} redirectTo="/false">
                                    <span>test</span>
                                </GuardRoute>
                            }
                        />
                        <Route path="/false" element={<span>false</span>} />
                    </Routes>
                </MemoryRouter>,
            );
        });

        let permittedComponent = container!.querySelector('span');

        expect(permittedComponent!.textContent).toEqual('test');
        expect(permittedComponent).toMatchSnapshot('guardRoute-permitted-snapshot');
    });

    it('should redirect on false', () => {
        act(() => {
            root!.render(
                <MemoryRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <GuardRoute canActivate={false} redirectTo="/false">
                                    <span>test</span>
                                </GuardRoute>
                            }
                        />
                        <Route path="/false" element={<span>false</span>} />
                    </Routes>
                </MemoryRouter>,
            );
        });

        let permittedComponent = container!.querySelector('span');

        expect(permittedComponent!.textContent).toEqual('false');
        expect(permittedComponent).toMatchSnapshot('guardRoute-restricted-snapshot');
    });
});
