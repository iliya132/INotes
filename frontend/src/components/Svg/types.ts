/* eslint-disable no-unused-vars */
import React from 'react';
import colors from '../../Misc/colors.scss';

export interface ISvgProps {
    icon: Icons;
    height?: number;
    width?: number;
    className?: string;
    onClick?: (event?: React.MouseEvent<SVGSVGElement>) => void;
    toolTip?: string;
}

type TIconsData = {
    [key in Icons]: {
        color: string;
        width: number;
        height: number;
    };
};

export enum Icons {
    EyeOpened = 'eye-open',
    EyeClosed = 'eye-closed',
    Search = "search",
    Plus = "plus"
}

export const ICONS_DATA: TIconsData = {
    [Icons.EyeOpened]: { color: colors.TextColor, width: 48, height: 48 },
    [Icons.EyeClosed]: { color: colors.TextColor, width: 48, height: 48 },
    [Icons.Search]: { color: colors.TextColor, width: 48, height: 48 },
    [Icons.Plus]: { color: colors.TextColor, width: 48, height: 48 },
};
