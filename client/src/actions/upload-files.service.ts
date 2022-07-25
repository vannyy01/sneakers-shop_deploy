import axios, {AxiosResponse} from 'axios';

class UploadFilesService {
    /**
     * @param dirName
     * @param file
     * @param onUploadProgress
     */
    public upload(dirName: string, file: File, onUploadProgress: (event: any) => void): Promise<AxiosResponse> {
        const formData = new FormData();

        formData.append("file", file)

        return axios({
            method: "post",
            url: "/api/files/upload",
            data: formData,
            params: {dirName},
            headers: {"Content-Type": "multipart/form-data"},
            onUploadProgress
        });
    }

    public async getFiles(dirName: string): Promise<AxiosResponse> {
        return axios.get(`/api/files`, {params: {dirName}});
    }

    public async deleteFile(imageName: string, dirName: string): Promise<AxiosResponse> {
        return axios.delete(`/api/files/delete`, {params: {imageName, dirName}});
    }

    // public async swapDir(goodBody: { brand: string, title: string, sex: string }) {
    //     return await axios.post(`/api/files/swap`, goodBody);
    // }
}

export default new UploadFilesService();