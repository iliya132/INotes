import React from 'react';
import { Input } from '../../components/Input/Input';
import Note from '../../components/Note';
import { Page } from '../../components/Page/page';
import styles from './notes.scss';

export default function Notes() {
    return (
        <Page>
            <div className={styles['notes-container']}>
                <div className={styles["notes-nav"]}>
                    <div className={styles["nav-commands"]}>
                        <Input id='search' type="text"></Input>
                    </div>
                    <select name="notebook" id="selected-notebook">
                        <option value="first">Личная записная кникжа</option>
                    </select>
                    <div className={styles["notes-list"]}>
                        <Note />
                    </div>
                </div>
                <div className={styles["work-field"]}></div>
            </div>
        </Page>
    );
}
