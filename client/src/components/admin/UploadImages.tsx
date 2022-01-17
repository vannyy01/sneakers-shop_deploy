import * as React from 'react';
import UploadService from "../../actions/upload-files.service";
import LinearProgress from '@material-ui/core/LinearProgress';
import {Box, Typography, Button, ListItem, withStyles} from '@material-ui/core';

function Image({id, name}: { id: string, name: string }) {
    let imgSrc;
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'production'){
        imgSrc = `../../../resources/commodities/${id}/${name}`;
    } else {
        imgSrc = require(`../../../public/resources/commodities/${id}/${name}`);
    }
    return (
        <img src={imgSrc} alt={name} style={{height: "120px"}}
             className="mr20"/>
    )
}

const BorderLinearProgress = withStyles(() => ({
    root: {
        height: 15,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: "#EEEEEE",
    },
    bar: {
        borderRadius: 5,
        backgroundColor: '#1a90ff',
    },
}))(LinearProgress);

interface UploadImagesState {
    currentFile?: File,
    previewImage?: string,
    progress: number,
    renderImage?: { name: string, url: string }
    message: string,
    isError: boolean,
    imageInfos: Array<{ name: string, url: string }>,
}

export default class UploadImages extends React.Component<{ commID: string }, UploadImagesState> {
    constructor(props: { commID: string }) {
        super(props);
        this.state = {
            currentFile: undefined,
            previewImage: undefined,
            progress: 0,
            renderImage: undefined,
            message: "",
            isError: false,
            imageInfos: [],
        };
    }

    public async componentDidMount() {
        try {
            const uploadFiles = await UploadService.getFiles(this.props.commID);
            const imageInfos = uploadFiles.data.map((item: { name: string, url: string }) => (
                    {url: item.url, name: item.name}
                ));
            this.setState({
                imageInfos
            });
        } catch (error) {
            console.log(error);
        }
    }


    public render() {
        const {
            currentFile,
            previewImage,
            progress,
            message,
            imageInfos,
            isError
        } = this.state;
        return (
            <div className="mg20">
                <label htmlFor="btn-upload">
                    <input
                        id="btn-upload"
                        name="btn-upload"
                        style={{display: 'none'}}
                        type="file"
                        accept="image/*"
                        onChange={this.selectFile}/>
                    <Button
                        className="btn-choose"
                        variant="outlined"
                        component="span">
                        Choose Image
                    </Button>
                </label>
                <div className="file-name">
                    {currentFile ? currentFile.name : null}
                </div>
                <Button
                    className="btn-upload"
                    color="primary"
                    variant="contained"
                    component="span"
                    disabled={!currentFile}
                    onClick={this.upload}>
                    Upload
                </Button>

                {currentFile && (
                    <Box className="my20" display="flex" alignItems="center">
                        <Box width="100%" mr={1}>
                            <BorderLinearProgress variant="determinate" value={progress}/>
                        </Box>
                        <Box minWidth={35}>
                            <Typography variant="body2" color="textSecondary">{`${progress}%`}</Typography>
                        </Box>
                    </Box>)
                }

                {previewImage && (
                    <div>
                        <img className="preview my20" src={previewImage} height="120px" alt=''/>
                    </div>
                )}

                {message && (
                    <Typography variant="subtitle2" className={`upload-message ${isError ? "error" : ""}`}>
                        {message}
                    </Typography>
                )}

                <Typography variant="h6" className="list-header">
                    List of Images
                </Typography>
                <ul className="list-group">
                    {imageInfos.length > 0 &&
                    imageInfos.map((image: { name: string, url: string }, index: number) => (
                        <ListItem
                            divider={true}
                            key={index}>
                            <Image id={this.props.commID} name={image.name}/>
                            <a href={image.url}>{image.name}</a>
                        </ListItem>
                    ))}
                </ul>
            </div>
        );
    }

    private upload = async () => {
        this.setState({
            progress: 0
        });

        try {
            const uploadResponse = await UploadService.upload(this.props.commID, this.state.currentFile, (event) => {
                this.setState({
                    progress: Math.round((100 * event.loaded) / event.total),
                });
            })
            this.setState({
                message: uploadResponse.data.message,
                isError: false
            });
            const uploadFiles = await UploadService.getFiles(this.props.commID);
            this.setState({
                imageInfos: uploadFiles.data,
            });
        } catch (error) {
            this.setState({
                progress: 0,
                message: "Could not upload the image!",
                currentFile: undefined,
                isError: true
            });
        }
    }

    private selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            currentFile: event.target.files[0],
            previewImage: URL.createObjectURL(event.target.files[0]),
            progress: 0,
            message: ""
        });
    }

}