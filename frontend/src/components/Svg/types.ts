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
    Plus = "plus",
    Dots = "dots",
    Circle = "circle",
    Pencil = "pencil",
    Copy = "copy",
    Tag = "tag",
    Share = "share",
    Remove = "remove",
    Bold = "bold-icon",
    Italic = "italic-icon",
    Underscoped = "underscoped-icon",
    DottedList = "dotted-list-icon",
    NumberList = "list-icon",
    H1 = "h1-icon",
    H2 = "h2-icon",
    H3 = "h3-icon",
    Code = "code-icon",
    Table = "table-icon",
    Markup = "markup-icon",
    Save = "save-icon",
    Read = "read-icon"
}

export const ICONS_DATA: TIconsData = {
    [Icons.EyeOpened]: { color: colors.TextColor, width: 48, height: 48 },
    [Icons.EyeClosed]: { color: colors.TextColor, width: 48, height: 48 },
    [Icons.Search]: { color: colors.TextColor, width: 48, height: 48 },
    [Icons.Plus]: { color: colors.TextColor, width: 48, height: 48 },
    [Icons.Dots]: { color: colors.TextColor, width: 25, height: 25 },
    [Icons.Circle]: { color: colors.TextColor, width: 25, height: 25 },
    [Icons.Pencil]: { color: colors.TextColor, width: 25, height: 25 },
    [Icons.Copy]: { color: colors.TextColor, width: 25, height: 25 },
    [Icons.Tag]: { color: colors.TextColor, width: 25, height: 25 },
    [Icons.Share]: { color: colors.TextColor, width: 25, height: 25 },
    [Icons.Remove]: { color: colors.TextColor, width: 25, height: 25 },
    [Icons.Bold]: { color: colors.TextColor, width: 25, height: 25 },
    [Icons.Italic]: { color: colors.TextColor, width: 25, height: 25 },
    [Icons.DottedList]: { color: colors.TextColor, width: 25, height: 25 },
    [Icons.H1]: { color: colors.TextColor, width: 25, height: 25 },
    [Icons.H2]: { color: colors.TextColor, width: 25, height: 25 },
    [Icons.H3]: { color: colors.TextColor, width: 25, height: 25 },
    [Icons.Code]: { color: colors.TextColor, width: 25, height: 25 },
    [Icons.Table]: { color: colors.TextColor, width: 25, height: 25 },
    [Icons.Markup]: { color: colors.TextColor, width: 25, height: 25 },
    [Icons.Underscoped]: { color: colors.TextColor, width: 25, height: 25 },
    [Icons.NumberList]: { color: colors.TextColor, width: 25, height: 25 },
    [Icons.Save]: { color: colors.TextColor, width: 25, height: 25 },
    [Icons.Read]: { color: colors.TextColor, width: 25, height: 25 },
};
