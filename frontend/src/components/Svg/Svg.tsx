import React from 'react';
import classNames from 'classnames';
import styles from './svg.scss';
import root from '../../Misc/root.scss';
import { ICONS_DATA, ISvgProps } from './types';
import sprite from '../../../static/assets/icons.svg';

export function Svg(props: ISvgProps) {
    const { icon, className: externalClassName, height, width, onClick } = props;
    const svgClasses = classNames(styles.image, externalClassName);

    return (
        <svg
            className={classNames(svgClasses, root['tooltip'])}
            fill={ICONS_DATA[icon].color}
            width={width || ICONS_DATA[icon].width}
            height={height || ICONS_DATA[icon].height}
            onClick={(e) => {
                onClick?.(e);
            }}>
            <use xlinkHref={`${sprite}#${icon}`} />
        </svg>
    );
}
