import React, { useState } from "react";
import { toast } from "react-toastify";
import filesController from "../../../controllers/FilesController";
import { IFileUploaded } from "../../../controllers/types";
import properties from "../../../properties/properties";
import SmallButton from "../../SmallButton";
import { Icons } from "../../Svg/types";
import styles from "./File.scss";

export function File(file: IFileUploaded) {
    const extension = getExtension(file.fileName)
    const [deleted, setDeleted] = useState(false);
    const handleDeleteFile = async () => {
        const answer = await filesController.deleteFile(file.id);
        toast.success("Файл \"" + file.fileName + "\" успешно удален")
        setDeleted(answer);
    }

    return deleted ? <></> :
        <div className={styles["file-row"]}>
            <div className={styles["extension"]}>{extension}</div>
            <div className={styles["content-container"]}>
                <div className={styles["content"]}>{file.fileName} [{getHumanReadableSize(file.size)}]</div>
                <div className={styles["actions"]}>
                    <SmallButton icon={Icons.Remove} tooltip="Удалить" onClick={handleDeleteFile} />
                    <a href={`${properties.apiUrl}api/file/download/${file.id}`}>
                        <SmallButton icon={Icons.download} tooltip="Скачать" />
                    </a>
                </div>
            </div>
        </div>
}

const extensionPattern = /\.[0-9a-z]+$/i;
function getExtension(name: string) {
    return extensionPattern.exec(name)
}

function getHumanReadableSize(size: number) {
    if(size < 1024) {
        return size + "b";
    }
    return (size / 1024) + "mb"
}
