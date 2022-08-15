/* eslint-disable no-undef */
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { PrettyMarkup } from './PrettyMarkup';

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

describe("pretty markup tests", () => {
    it("can render", () => {
        act(() => {
            root!.render(<PrettyMarkup renderedValue='<div>test-case</div>'/>)
        })
    })

    it("renders value", () => {
        act(() => {
            root!.render(<PrettyMarkup renderedValue='<div id="test-id">test-case</div>'/>)
        })

        const renderedDiv = container!.querySelector("div")

        expect(renderedDiv).not.toBeNull()
        expect(renderedDiv?.textContent).toEqual("test-case")
    })

    it("should match snapshot", () => {
        act(() => {
            root!.render(<PrettyMarkup renderedValue='<div id="test-id">test-case</div>'/>)
        })

        const markup = container!.firstChild;

        expect(markup).toMatchSnapshot("pretty markup snapshot")
    })

    it("should be sanitized", () => {
        act(() => {
            root!.render(<PrettyMarkup renderedValue='<a onClick="alert(\"shoulnt fire\")>test</a>'/>)
        })
        const link = container!.querySelector("a");

        expect(link?.outerHTML).not.toContain('alert')
        expect(link?.outerHTML).not.toContain('onClick')

        act(() => {
            root!.render(<PrettyMarkup renderedValue='<script>console.log("atached server")</script>'/>)
        })

        expect(container!.innerHTML).not.toContain('script')
    })

    it("should keep classNames", () => {
        act(() => {
            root!.render(<PrettyMarkup renderedValue='<div class="test-class">press me</div>'/>)
        })

        const div = container!.querySelector('.test-class')
        expect(div).not.toBeNull()
    })
})