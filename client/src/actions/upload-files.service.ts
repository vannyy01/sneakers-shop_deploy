import axios, {AxiosResponse} from 'axios';

class UploadFilesService {
    /**
     * @param commID
     * @param file
     * @param onUploadProgress
     */
    public upload(commID: string, file: File, onUploadProgress: (event: any) => void): Promise<AxiosResponse> {
        const formData = new FormData();

        formData.append("file", file)

        return axios({
            method: "post",
            url: "/api/files/upload",
            data: formData,
            params: {id: commID},
            headers: {"Content-Type": "multipart/form-data"},
            onUploadProgress
        });
    }

    public async getFiles(commID: string): Promise<AxiosResponse> {
        return axios.get(`/api/files/${commID}`);
    }
}

export default new UploadFilesService();