import React from 'react';
import Note from '../../components/Note';
import { Page } from '../../components/Page/page';
import { Search } from '../../components/Search/search';
import Svg from '../../components/Svg';
import { Icons } from '../../components/Svg/types';
import styles from './notes.scss';
import ToolTip from '../../components/Tooltip';
import Select from 'react-select';
import { options, selectStyle } from './notes.constants';

export default function Notes() {
    return (
        <Page>
            <div className={styles['notes-container']}>
                <div className={styles['notes-nav']}>
                    <div className={styles['nav-commands']}>
                        <Search />
                        <ToolTip tooltip="Добавить новую записную книжку">
                            <Svg icon={Icons.Plus} width={25} height={25} className={styles['plus-icon']} />
                        </ToolTip>
                    </div>
                    <Select options={options} styles={selectStyle}/>
                    <div className={styles['notes-list']}>
                        <Note />
                    </div>
                </div>
                <div className={styles['work-field']}></div>
            </div>
        </Page>
    );
}
