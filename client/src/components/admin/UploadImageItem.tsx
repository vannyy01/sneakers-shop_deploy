import React from 'react';
import {createStyles, IconButton, ImageListItem, ImageListItemBar, makeStyles} from "@material-ui/core";
import Star from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import {DeleteOutline} from "@material-ui/icons";

const Image: React.FC<{ name: string, url: string }> = ({name, url}) => {
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

const useStyles = makeStyles(() => createStyles({
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
}));

interface UploadImageItemType {
    image: {
        name: string,
        url: string
    },
    mainImage?: string,
    pickMainImage: (imageName: string) => void,
    showDeleteDialog: (imageName: string) => void
}

const UploadImageItem: React.FC<UploadImageItemType> = ({
                                                            image: {name, url},
                                                            mainImage,
                                                            showDeleteDialog,
                                                            pickMainImage
                                                        }) => {
    const classes = useStyles();

    const handlePickImage = (): void => {
        pickMainImage(name);
    };

    const handleDeleteImage = (): void => {
        showDeleteDialog(name);
    };

    return (
        <ImageListItem>
            <Image name={name} url={url}/>
            <ImageListItemBar
                title={name}
                position="top"
                actionIcon={
                    <div style={{display: 'flex'}}>
                        <IconButton aria-label={`star ${name}`}
                                    onClick={handlePickImage}>
                            {mainImage === name ?
                                <Star style={{color: '#FFDF00'}}/>
                                :
                                <StarBorderIcon className={classes.icon}/>
                            }
                        </IconButton>
                        <IconButton onClick={handleDeleteImage}>
                            <DeleteOutline className={classes.icon}/>
                        </IconButton>
                    </div>
                }
                actionPosition="left"
                className={classes.titleBar}
            />
        </ImageListItem>
    );
}

export default UploadImageItem;