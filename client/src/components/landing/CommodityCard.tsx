import * as React from 'react';
import {connect} from "react-redux";

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {Theme, withStyles} from '@material-ui/core/styles';
import classnames from 'classnames';

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
import {getCartItems, setCartItem} from "../../actions";
import {ShoeInterface, SizeInterface} from "../../actions/types";
import {checkStorage, getStorage, removeStorage, setStorage} from "../../actions/validation";

const styles = (theme: Theme) => createStyles({
    actions: {
        display: 'flex',
    },
    bdHighlight: {
        color: 'blueviolet'
    },
    card: {
        margin: '0 5px 10px 0',
        maxWidth: 350,
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
    par: {fontSize: 15},
    pos: {
        marginBottom: 12,
    },
    title: {
        fontSize: 14,
        marginBottom: 16,
    },

});

interface CommodityCardStateI {
    expanded: boolean,
    likes: [string] | []
}

interface CommodityCardPropsI {
    classes: {
        actions?: string,
        bdHighlight: string,
        card?: string,
        expand?: string,
        expandOpen: string,
        media?: string,
        title?: string,
        par?: string,
        pos?: string,
    },
    getCartItems: () => void,
    good: ShoeInterface,
    setCartItem: (item: { [id: number]: ShoeInterface }) => void
}

class CommodityCard extends React.PureComponent<CommodityCardPropsI, CommodityCardStateI> {
    private static count: number = 0;
    constructor(props: any) {
        super(props);
        this.state = {
            expanded: false,
            likes: []
        };
    }

    public componentDidMount() {
        this.setState(() =>
            ({likes: getStorage("FavouritesGoods")})
        );
    }

    public render() {
        const {classes} = this.props;
        const {mainImage, description, title, price, brand, size, sex, _id} = this.props.good;
        return (
            <Card className={classes.card}>
                <CardMedia
                    className={classes.media}
                    image={mainImage}
                    title={brand + " " + title}
                />
                <CardContent>
                    <Typography className="d-flex justify-content-between" variant="headline" component="h2">
                        <a>{title}</a>
                        <span className={classes.bdHighlight}>{price} грн.</span>
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                        {brand}
                    </Typography>
                    <Typography component="p">
                        {description}
                    </Typography>
                </CardContent>
                <CardActions className={classes.actions} disableActionSpacing={true}>
                    {!checkStorage("FavouritesGoods", _id) ?
                        <IconButton aria-label="Додати в улюблені" onClick={this.dislikeGood}>
                            <Star style={{color: '#FFDF00'}}/>
                        </IconButton> :
                        <IconButton aria-label="Додати в улюблені" onClick={this.likeGood}>
                            <StarBorder/>
                        </IconButton>
                    }
                    <IconButton aria-label="Додати в корзину" onClick={this.handleAddGood}>
                        <AddShoppingCart/>
                    </IconButton>
                    <IconButton
                        className={classnames(classes.expand, {
                            [classes.expandOpen]: this.state.expanded,
                        })}
                        onClick={this.handleExpandClick}
                        aria-expanded={this.state.expanded}
                        aria-label="Show more"
                    >
                        <ExpandMoreIcon/>
                    </IconButton>
                </CardActions>
                <Collapse in={this.state.expanded} timeout="auto" unmountOnExit={true}>
                    <CardContent>
                        <Typography className="d-flex justify-content-between" variant="headline" component="h2">
                            <p className={classes.par}>Розміри:</p>
                            <div>
                                {size ? size.map((data: SizeInterface, index: number) =>
                                    (
                                        <Chip
                                            title={"В наявності " + data.count + " пари"}
                                            className="mr-1"
                                            key={index}
                                            label={data.sizeValue}
                                        />
                                    )
                                ) : <div color="red">
                                    Немає в наявності
                                </div>
                                }
                            </div>
                        </Typography>
                        <Typography className="d-flex justify-content-between" variant="headline" component="h2">
                            <p className={classes.par}>Стать:</p>
                            <p className={classes.par}><b>{sex}</b></p>
                        </Typography>
                    </CardContent>
                </Collapse>
            </Card>
        );
    }

    protected handleAddGood = (): void => {
        this.props.setCartItem({[CommodityCard.count]: this.props.good});
        CommodityCard.count++;
        this.props.getCartItems();
    };

    protected handleExpandClick = (): void => {
        this.setState((prevState: CommodityCardStateI) =>
            ({expanded: !prevState.expanded}))
    };

    protected likeGood = (): void => {
        setStorage("FavouritesGoods", this.props.good._id);
        this.setState(() =>
            ({likes: getStorage("FavouritesGoods")})
        );
    };

    protected dislikeGood = (): void => {
        removeStorage("FavouritesGoods", this.props.good._id);
        this.setState(() =>
            ({likes: getStorage("FavouritesGoods")})
        );
    };
}

export default connect(null, {setCartItem, getCartItems})
(withStyles(styles)(CommodityCard));