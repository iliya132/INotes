import axios from "axios";
import BaseController from "./base/BaseController";

class FilesController extends BaseController {
    private fileControllerUrl = this.baseUrl + "api/file"

    async uploadfile(files: File[], noteId: number): Promise<any> {
        const formData = new FormData();
        files.forEach(it =>
            formData.append("files", it));

        return axios.post(`${this.fileControllerUrl}/upload/${noteId}`, formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(resp => {
                return resp.data as Map<string, string>;
            })
            .catch(resp => {
                console.log("failed", resp);
                return {} as Map<string, string>
            })
    }
}

const filesController = new FilesController();
export default filesController;
