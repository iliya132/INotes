import React from 'react';
import Svg from '../Svg';
import { Icons } from '../Svg/types';
import styles from './search.scss';
import ISearchProps from './types';

export function Search(props: ISearchProps) {
    const { onChange } = props;
    return (
        <div className={styles['input-container']}>
            <input
                id="search"
                type="text"
                className={styles['search-field']}
                placeholder="Type here to search..."
                onChange={onChange}
                autoComplete="disabled"
            />
            <Svg icon={Icons.Search} className={styles['eye-icon']} />
        </div>
    );
}
