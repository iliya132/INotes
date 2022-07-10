import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import Svg from '../Svg';
import { Icons } from '../Svg/types';
import styles from './Checkbox.scss';
import { ICheckboxProps } from './types';

export function Checkbox(props: ICheckboxProps) {
    const { defaultValue, id, className, onChanged, title } = props;
    const [isPressed, setPressed] = useState(defaultValue ? defaultValue : false);
    const realInputRef = useRef(null);

    const handleCheckboxClick = () => {
        (realInputRef!.current! as HTMLInputElement).value = (!isPressed).toString();
        (realInputRef!.current! as HTMLInputElement).checked = !isPressed;
        if (onChanged) {
            onChanged(!isPressed);
        }
        setPressed(!isPressed);
    };

    return (
        <div className={styles['share-checkbox']} onClick={handleCheckboxClick}>
            <div className={classNames(styles['checkbox-container'], className)} >
                <input type="checkbox" id={id} hidden ref={realInputRef} defaultChecked={defaultValue} />
                <div hidden={!isPressed}>
                    <Svg icon={Icons.Check} />
                </div>
            </div>
            <span>{title}</span>
        </div>
    );
}
