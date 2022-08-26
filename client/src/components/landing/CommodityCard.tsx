import * as React from 'react';
import {useEffect, useMemo, useState} from "react";
import {v4 as uuid} from 'uuid';
import {useDispatch} from "react-redux";
import {makeStyles, Theme} from '@material-ui/core/styles';
import classnames from 'classnames';
import {setCartItem} from "../../actions";
import {ShoeInterface, SizeInterface} from "../../actions/types";
import {checkStorage, removeStorage, setStorage} from "../../actions/validation";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Chip from '@material-ui/core/Chip';
import Collapse from '@material-ui/core/Collapse';
import createStyles from "@material-ui/core/styles/createStyles";
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AddShoppingCart from '@material-ui/icons/AddShoppingCart';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import {colors} from "../admin/goods/goodTypes";
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => createStyles({
    actions: {
        display: 'flex',
    },
    bdHighlight: {
        color: 'var(--primary-color)'
    },
    card: {
        margin: "0 5px 15px 5px",
        maxWidth: 350,
        padding: 0
    },
    cardContentHeader: {
        textDecoration: "none",
        color: "inherit",
        "&:hover": {
            textDecoration: "none"
        }
    },
    expand: {
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -8,
        },
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    par: {fontSize: "1rem"},
    pos: {
        marginBottom: 12,
        width: "50%"
    },
    title: {
        fontSize: 14,
        marginBottom: 16,
    },

}));

interface CommodityCardPropsI {
    good: ShoeInterface,
}

const CommodityCard: React.FC<CommodityCardPropsI> = ({good}) => {

    const {mainImage, description, title, price, brand, sizes, sex, color, _id} = good;
    const imageUrl = `/resources/commodities/${_id}/${mainImage}`;
    const [expanded, setExpanded] = useState<boolean>(false);
    const [goodId, setGoodId] = useState<string>(uuid());
    const [checked, setChecked] = useState<boolean>(false);
    const shortDescription = useMemo(() => `${description.substring(0, 50)}...`, [description]);
    const [checkedSize, setCheckedSize] = useState<number>();
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        setChecked(!checkStorage("FavouritesGoods", _id));
    }, [good])

    const handleAddGood = (): void => {
        if (!checkedSize) {
            alert("Виберіть розмір.");
            return;
        }
        dispatch(setCartItem({[goodId]: {...good, size: good.sizes.find(item => item.sizeValue === checkedSize)}}));
        setGoodId(uuid());
    };

    const handleCheckedSizeClick = (sizeValue: number): void => {
        checkedSize !== sizeValue ? setCheckedSize(sizeValue) : setCheckedSize(undefined);
    };

    const handleExpandClick = (): void => {
        setExpanded(!expanded);
    };

    const likeGood = (): void => {
        setStorage("FavouritesGoods", _id);
        setChecked(!checkStorage("FavouritesGoods", _id));
    };

    const dislikeGood = (): void => {
        removeStorage("FavouritesGoods", _id);
        setChecked(!checkStorage("FavouritesGoods", _id));
    };

    return (
        <Card className={"col-12 col-md-6 col-lg-4 " + classes.card}>
            <Link to={`/good/${_id}`}>
                <CardMedia
                    className={classes.media}
                    image={imageUrl}
                    title={brand + " " + title}
                />
            </Link>
            <CardContent>
                <Typography className="d-flex align-items-baseline justify-content-between" variant="h5" component="h5">
                    <Link to={`/good/${_id}`} className={classes.cardContentHeader}>
                        <h3>{title}</h3>
                    </Link>
                    <span className={classes.bdHighlight}>{price} грн.</span>
                </Typography>
                <div className="d-flex">
                    <Typography className={classes.pos} color="textSecondary">
                        {brand}
                    </Typography>
                    <Typography className={"d-flex justify-content-end " + classes.pos} style={{color: color || ""}}>
                        {color ? colors[color].label : ""}
                    </Typography>
                </div>
                <Typography component="p">
                    {expanded ? description : shortDescription}
                </Typography>
            </CardContent>
            <CardActions className={classes.actions} disableSpacing={true}>
                {checked ?
                    <IconButton aria-label="Додати в улюблені" onClick={dislikeGood}>
                        <Star style={{color: '#FFDF00'}}/>
                    </IconButton> :
                    <IconButton aria-label="Додати в улюблені" onClick={likeGood}>
                        <StarBorder/>
                    </IconButton>
                }
                <IconButton aria-label="Додати в корзину" onClick={handleAddGood}>
                    <AddShoppingCart/>
                </IconButton>
                <IconButton
                    className={classnames(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="Show more"
                >
                    <ExpandMoreIcon/>
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit={true}>
                <CardContent>
                    <Typography className="d-flex justify-content-between" variant="h2" component="h2">
                        <p className={classes.par}>Стать:</p>
                        <p className={classes.par}><b>{sex}</b></p>
                    </Typography>
                    <Typography className="d-flex justify-content-between align-items-baseline" variant="inherit"
                                component="h2">
                        <p className={classes.par}>Розміри:</p>
                        <div>
                            {sizes && sizes.map((data: SizeInterface, index: number) =>
                                (
                                    <Chip
                                        key={index}
                                        className="mr-1"
                                        title={"В наявності " + data.count + " пари"}
                                        label={data.sizeValue}
                                        disabled={data.count === 0}
                                        style={{
                                            color: checkedSize === data.sizeValue ? "white" : "black",
                                            backgroundColor: checkedSize === data.sizeValue ? "var(--primary-color)" : "#e0e0e0",
                                            fontSize: "1rem"
                                        }}
                                        onClick={() => handleCheckedSizeClick(data.sizeValue)}
                                    />
                                ))}
                        </div>
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}

export default CommodityCard;
