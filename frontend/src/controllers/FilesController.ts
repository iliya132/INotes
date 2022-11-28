import axios from "axios";
import { toast } from "react-toastify";
import BaseController from "./base/BaseController";
import { IFileUploaded } from "./types";

class FilesController extends BaseController {
    private fileControllerUrl = this.baseUrl + "api/file"

    async uploadfile(files: File[], noteId: number): Promise<any> {
        const formData = new FormData();
        files.forEach(it =>
            formData.append("files", it));

        return axios.post(`${this.fileControllerUrl}/upload/${noteId}`, formData,
            {
                withCredentials: true,
                maxContentLength: 10000000,
                maxBodyLength: 10000000,
                timeout: 60000,

                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(resp => {
                return resp.data as Map<string, string>;
            })
            .catch(resp => {
                toast.error("Не удалось загрузить файл. Вероятно он слишком большой")
                return {} as Map<string, string>
            })
    }

    async getNoteFiles(noteId: number) {
        return axios.get(`${this.fileControllerUrl}/for-note/${noteId}`, { withCredentials: true })
            .then(resp => {
                return resp.data as IFileUploaded[];
            })
            .catch(resp => {
                console.error("failed", resp)
                toast.error("Что-то пошло не так. Попробуйте повторить")
                return {} as IFileUploaded[]
            })
    }

    async deleteFile(fileId: number) {
        return axios.delete(`${this.fileControllerUrl}/delete/${fileId}`, { withCredentials: true })
            .then(_ => { return true })
            .catch(reason => {
                toast.error("Что-то пошло не так. Файл небыл удален ")
                return false;
            })
    }
}

const filesController = new FilesController();
export default filesController;
