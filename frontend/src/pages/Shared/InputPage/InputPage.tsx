import React, { useRef } from "react";
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import { NavLink } from 'react-router-dom';
import styles from './InputPage.scss';
import { InputPageProps } from "./type";

export function InputPage(props: InputPageProps) {
    const { children } = props;
    const containerRef = useRef(null);
    return (
        <div className={styles.container}>
            <div className={styles['column']}>
                <NavLink to="/" className={styles['logo-link']}>
                    <h1 className={styles.logo}>I-Note</h1>
                </NavLink>
                <SwitchTransition mode="out-in">
                    <CSSTransition
                        key={'login'}
                        classNames="fade"
                        timeout={300}
                        appear
                        mountOnEnter={true}
                        unmountOnExit={true}
                        nodeRef={containerRef}>
                        <div className={styles['form-wrapper']}
                        ref={containerRef}>
                            {children}
                        </div>
                    </CSSTransition>
                </SwitchTransition>
            </div>
        </div>
    )
}