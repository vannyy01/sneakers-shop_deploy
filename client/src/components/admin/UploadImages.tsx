import * as React from 'react';
import UploadService from "../../actions/upload-files.service";
import LinearProgress from '@material-ui/core/LinearProgress';
import {
    Box,
    Typography,
    Button,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    IconButton,
    withStyles
} from '@material-ui/core';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import createStyles from "@material-ui/core/styles/createStyles";
import Star from "@material-ui/icons/Star";
import {DeleteOutline} from "@material-ui/icons";
import Dialog from "@material-ui/core/Dialog";
import {PaperComponent} from "./BaseGood";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

function Image({name, url}: { name: string, url: string }) {
    // let imgSrc;
    // if (process.env.NODE_ENV === 'production') {
    //     imgSrc = `../../../resources/commodities/${id}/${name}`;
    // } else {
    //     imgSrc = `/resources/commodities/${id}/${name}`;
    // }
    return (
        <a href={url} style={{cursor: "pointer"}}>
            <img src={url} alt={name} style={{height: "320px", width: "300px"}}
                 className="mr20"/>
        </a>
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
    }
}))(LinearProgress);

const styles = () => createStyles({
    imageList: {
        width: 600,
        height: 450,
        transform: 'translateZ(0)',
    },
    titleBar: {
        background:
            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    icon: {
        color: 'white',
    }
});

interface UploadImagesState {
    currentFile?: File,
    previewImage?: string,
    progress: number,
    renderImage?: { name: string, url: string },
    mainImage?: string,
    delImageName?: string,
    imageInfos: Array<{ name: string, url: string }>,
    message: string,
    isError: boolean,
    showDialog: boolean,
}

interface UploadImageProps {
    commID?: string,
    mainImage?: string,
    classes?: {
        imageList: string,
        titleBar: string,
        icon: string,
    },
    setMainImage: (mainImage: string) => void,
}

class UploadImages extends React.Component<UploadImageProps, UploadImagesState> {
    constructor(props: UploadImageProps) {
        super(props);
        this.state = {
            currentFile: undefined,
            previewImage: undefined,
            progress: 0,
            renderImage: undefined,
            mainImage: undefined,
            imageInfos: [],
            message: "",
            isError: false,
            showDialog: false,
        };
    }

    public async componentDidMount() {
        await this.loadImages();
    }

    public componentDidUpdate(prevProps: Readonly<UploadImageProps>, prevState: Readonly<UploadImagesState>) {
        if (this.state.mainImage !== prevState.mainImage) {
            this.setState({imageInfos: this.state.imageInfos.sort(this.sortImageInfos)},
                () => this.props.setMainImage(this.state.mainImage));
        }
    }

    public render() {
        const {
            currentFile,
            previewImage,
            progress,
            mainImage,
            imageInfos,
            message,
            isError
        } = this.state;
        const {classes} = this.props;
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
                        Виберіть зображення
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
                    Завантажити
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
                    Зображення товару
                </Typography>
                <ImageList rowHeight={280} gap={1} className={classes.imageList}>
                    {imageInfos.length > 0 &&
                        imageInfos.map((image: { name: string, url: string }) => (
                            <ImageListItem key={image.name}>
                                <Image name={image.name} url={image.url}/>
                                <ImageListItemBar
                                    title={image.name}
                                    position="top"
                                    actionIcon={
                                        <div style={{display: 'flex'}}>
                                            <IconButton aria-label={`star ${image.name}`}
                                                        onClick={() => this.pickMainImage(image.name)}>
                                                {mainImage === image.name ?
                                                    <Star style={{color: '#FFDF00'}}/>
                                                    :
                                                    <StarBorderIcon className={classes.icon}/>
                                                }
                                            </IconButton>
                                            <IconButton onClick={() => this.showDeleteDialog(image.name)}>
                                                <DeleteOutline className={classes.icon}/>
                                            </IconButton>
                                        </div>
                                    }
                                    actionPosition="left"
                                    className={classes.titleBar}
                                />
                            </ImageListItem>
                        ))}
                </ImageList>
                <Dialog
                    open={this.state.showDialog}
                    onClose={this.showDeleteDialog}
                    PaperComponent={PaperComponent}
                    aria-labelledby="draggable-dialog-title"
                >
                    <DialogContent>
                        <DialogContentText>
                            Ви справді бажаєте видалити зображення?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus={true} name="cancel" onClick={() => this.showDeleteDialog()}
                                color="primary">
                            Скасувати
                        </Button>
                        <Button name="delete" onClick={this.handleDeleteImage} color="primary">
                            Видалити
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    private loadImages = async (): Promise<void> => {
        try {
            let imageInfos;

            const uploadFiles = await UploadService.getFiles(this.props.commID);
            imageInfos = uploadFiles.data.map((item: { name: string, url: string }) => (
                {url: item.url, name: item.name}
            ));

            this.setState({mainImage: this.props.mainImage});
            imageInfos.sort(this.sortImageInfos);
            this.setState({
                imageInfos
            });
        } catch (error) {
            console.log(error);
        }
    };

    private upload = async () => {
        this.setState({
            progress: 0
        });

        try {
            const uploadResponse = await UploadService.upload(this.props.commID, this.state.currentFile, (event) => {
                this.setState({
                    progress: Math.round((100 * event.loaded) / event.total),
                });
            });
            this.setState({
                message: uploadResponse.data.message,
                isError: false
            });
            const uploadFiles = await UploadService.getFiles(this.props.commID);
            uploadFiles.data.sort(this.sortImageInfos);
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

    private pickMainImage = (imageName: string): void => {
        if (!this.state.mainImage || this.state.mainImage !== imageName) {
            this.setState({mainImage: imageName});
        } else {
            this.setState({mainImage: undefined});
        }
    }

    private handleDeleteImage = async (): Promise<void> => {
        try {
            await UploadService.deleteFile(this.state.delImageName, this.props.commID);
            await this.loadImages();
            this.showDeleteDialog();
        } catch (error) {
            alert(`Не вдалося видалити зображення ${this.state.delImageName}. ${error}`);
        }
    };

    private showDeleteDialog = (imageName?: string): void => {
        if (imageName) {
            this.setState({showDialog: !this.state.showDialog, delImageName: imageName});
        }
        this.setState({showDialog: !this.state.showDialog});
    };

    private sortImageInfos = (item: { name: string, url: string }) =>
        (this.state.mainImage === item.name ? -1 : 1);
}

export default withStyles(styles)(UploadImages);