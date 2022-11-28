import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import filesController from "../../controllers/FilesController";
import { IFileUploaded } from "../../controllers/types";
import File from "./File";
import IUploadsProps from "./types";
import styles from "./uploads.scss";

export function Uploads(props: IUploadsProps) {
    const { noteId } = props
    const [noteFiles, setNoteFiles] = useState([] as IFileUploaded[])
    const [isLoaded, setLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const filesUploaded = await filesController.getNoteFiles(noteId);

            setNoteFiles(filesUploaded);
            setLoaded(true);
        }
        fetchData()
    }, [noteId])

    return (
        <div className={styles["uploads-container"]}>
            {!isLoaded ? <ReactLoading type="cylon" color="black" className={styles["loading-center"]} /> :
                noteFiles.length > 0 ?
                    noteFiles.map(it =>
                        <File fileName={it.fileName} size={it.size} key={it.fileName} id={it.id} />
                    ) :
                    <div className={styles["empty-label"]}>В этой заметке еще нет файлов.<br />Перетащите что-нибудь в поле редактирования!</div>

            }

        </div>
    )
}
