import { GroupBase, StylesConfig } from "react-select";

export const selectStyle: StylesConfig<{
    value: string;
    label: string;
}, false, GroupBase<{
    value: string;
    label: string;
}>> | undefined = {
    control: (provided) => ({
        ...provided,
        backgroundColor: "rgb(218, 215, 205, 0.8)",
        marginLeft: "5px",
        marginRight: "5px",
        marginBottom: "5px"
    }),
    dropdownIndicator: (provided) => (
        {
            ...provided,
            color: "black"
        }
    ),
    menu: (provided) => ({
        ...provided,
        backgroundColor: "rgb(218, 215, 205, 1)",
    }),
}
