import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Popup from "reactjs-popup";
import { Notebook } from "./components/notebook/Notebook";
import Profile from './components/profile'
import NotebookPopup from "../NotebookCreatePopup";
import SmallButton from "../SmallButton";
import Svg from "../Svg";
import { Icons } from "../Svg/types";
import styles from './Navbar.scss';
import { Search } from "../Search/search";
import { useSelector } from "react-redux";
import { allNotes, notebooks } from "../../store/reducers/notebooksReducer";
import { INotebookWithNotes } from "../../store/types";
import classNames from "classnames";

export function Navbar() {
    const notebooksArr = useSelector(notebooks);
    const notes = useSelector(allNotes);
    const [isCollapsed, setCollapsed] = useState(false);

    const notebooksWithNotes = notebooksArr.map((it) => {
        return {
            id: it.id,
            name: it.name,
            color: it.color,
            notes: notes.filter((note) => note.parent.id === it.id),
            isExpanded: it.isExpanded
        } as INotebookWithNotes;
    });

    const handleCollapsedClick = () => {
        setCollapsed(!isCollapsed);
    }
    return (
        <div className={classNames(styles['notes-page-navbar'], isCollapsed ? styles['collapsed'] : null)}>
            <div className={styles['notes-page-navbar-logo']}>
                <NavLink to="/" className={styles['notes-page-navbar-logo-link']} hidden={isCollapsed}>
                    I-Note
                </NavLink>
                <SmallButton icon={isCollapsed ? Icons.arrowBarRight : Icons.arrowBarLeft} size={32} className={styles["expand-btn"]} onClick={handleCollapsedClick} />
            </div>
            <div className={styles['notes-page-navbar-profile']}>
                <Profile hidden={isCollapsed} />
            </div>
            <div className={styles['notes-page-navbar-search']}>
                <Search hidden={isCollapsed}/>
            </div>
            <div className={classNames(styles['notes-page-navbar-notes'], isCollapsed ? styles["hidden"] : null)}>
                {notebooksWithNotes
                    .sort((first, second) => first.name.localeCompare(second.name))
                    .map((it) => (
                        <Notebook key={`notebook_container#${it.id}`} notebook={it}/>
                    ))}
                <Popup
                    trigger={
                        <div className={styles['notebook-row']}>
                            <Svg icon={Icons.Notebook} className={styles['notebook-row-notebook-icon']} />
                            <span className={styles['notebook-title']}>Создать новый</span>
                        </div>
                    }
                    nested
                    position="bottom left">
                    {(close) => {
                        return <NotebookPopup afterClick={() => close()} />;
                    }}
                </Popup>
            </div>
        </div>
    )
}
