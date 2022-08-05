import React, {useCallback, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {ShoeInterface} from 'src/actions/types';
import {fetchGoodByID, setCartItem} from "../../actions";
import '../landing/landing.css';
import {isEmpty} from "lodash";
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/scss/image-gallery.scss';
import 'react-image-gallery/styles/css/image-gallery.css';
import UploadService from "../../actions/upload-files.service";
import {colors} from "../admin/goods/goodTypes";
import {ParagraphHeader} from "../landing";
import he from "he";
import {Chip, createStyles, makeStyles} from "@material-ui/core";
import {v4 as uuid} from "uuid";
import Counter from "./Counter";
import Button from "../button";
import IconButton from "@material-ui/core/IconButton";
import Star from "@material-ui/icons/Star";
import StarBorder from "@material-ui/icons/StarBorder";
import {checkStorage, removeStorage, setStorage} from "../../actions/validation";

const useStyles = makeStyles(() => createStyles({
    chip: {
        height: 40,
        width: 60,
        marginRight: 10,
        fontSize: "inherit",
    },
    price: {
        fontSize: 20,
        fontWeight: 600
    },
    description: {
        color: "#777777",
        borderBottom: "1px solid #ededed",
        paddingBottom: 20
    },
    color: {
        width: 20, height: 20, marginRight: 10,
    },
    full: {
        backgroundColor: "#fafafa",
        fontFamily: "system-ui",
        padding: "25px 15px 15px 30px"
    }
}));

interface ImageType {
    name: string,
    original: string,
    thumbnail: string,
    thumbnailHeight: number,
    originalHeight: number,
}

const ProductPage: React.FC = () => {
        const {id} = useParams<{ id: string }>();
        const dispatch = useDispatch();
        const getSelector = ({goods: {goods: good}}: { goods: { goods: ShoeInterface[] } }): ShoeInterface => good[0];
        const initialProduct: ShoeInterface = useSelector(getSelector, shallowEqual);
        const [product, setProduct] = useState<ShoeInterface>(initialProduct);
        const [images, setImages] = useState<ImageType[]>();
        const [checkedSize, setCheckedSize] = useState<number>();
        const [count, setCount] = useState<number>(1);
        const [fav, setFav] = useState<boolean>();
        const classes = useStyles();

        const loadImages = useCallback(async () => {
            let imageInfos: ImageType[];

            const uploadFiles = await UploadService.getFiles(`commodities/${id}`);
            imageInfos = uploadFiles.data.map((item: { name: string, url: string }) => (
                {name: item.name, original: item.url, thumbnail: item.url, thumbnailHeight: 100, originalHeight: 550}
            ));

            //     imageInfos.sort(item => (product.mainImage || initialProduct.mainImage) === item.name ? -1 : 1);
            setImages(imageInfos);
        }, []);

        useEffect(() => {
            dispatch(fetchGoodByID(id, () => history.back()));
        }, [dispatch]);

        useEffect(() => {
            loadImages().catch((error) => console.error(error));
            setFav(!checkStorage("FavouritesGoods", id));
        }, []);

        useEffect(() => {
            setProduct(initialProduct);
        }, [initialProduct]);

        const handleCheckedSizeClick = (sizeValue: number): void => {
            checkedSize !== sizeValue ? setCheckedSize(sizeValue) : setCheckedSize(undefined);
        };

        const handleAddCartItems = async () => {
            if (!checkedSize) {
                alert("Виберіть розмір.");
                return;
            }
            for (let i = 0; i < count; i++) {
                await dispatch(setCartItem({
                    [uuid()]: {
                        ...product,
                        size: product.sizes.find(item => item.sizeValue === checkedSize)
                    }
                }));
            }
        }

        const likeGood = (): void => {
            setStorage("FavouritesGoods", id);
            setFav(!checkStorage("FavouritesGoods", id));
        };

        const dislikeGood = (): void => {
            removeStorage("FavouritesGoods", id);
            setFav(!checkStorage("FavouritesGoods", id));
        };

        return (
            !isEmpty(product) && !isEmpty(classes) && !isEmpty(images) &&
            <section className="special-area bg-white section_padding_100" style={{marginTop: 100}}>
                <div className="container">
                    <div className="d-flex flex-column flex-lg-row">
                        <div className="d-flex col-12 col-lg-6">
                            <ImageGallery items={images} showPlayButton={false}/>
                        </div>
                        <div className="d-flex flex-wrap col-12 col-lg-6">
                            <h1 className="product__title d-flex align-items-center col-12" style={{fontSize: 23}}>
                                {product.brand + " " + product.title} <span
                                style={{textTransform: "capitalize"}}>{" " + colors[product.color].label}</span>
                                <div style={{marginLeft: 15}}>
                                    {fav ?
                                        <IconButton aria-label="Додати в улюблені" onClick={dislikeGood}>
                                            <Star style={{color: '#FFDF00'}}/>
                                        </IconButton> :
                                        <IconButton aria-label="Додати в улюблені" onClick={likeGood}>
                                            <StarBorder/>
                                        </IconButton>
                                    }
                                </div>
                            </h1>
                            <div className="price-product col-12" style={{marginBottom: 0}}>
                                <div className="product-price" style={{float: "left", width: 100}}>
                                    <div className={"price price--large price--on-sale align-items-start " + classes.price}>
                                        <dl className="d-flex" style={{margin: 0, float: "left",}}>
                                            <div className="price__sale d-flex justify-content-start flex-row">
                                                <dd style={{margin: "0 1rem 0 0"}}>
                                            <span className="price-item price-item--sale">
                                             {product.price}грн
                                            </span>
                                                </dd>
                                                <dd className="price__compare" style={{margin: "0 1rem 0 0"}}>
                                                    <s className="price-item price-item--regular"
                                                       style={{textDecoration: "line-through", color: "#777777"}}>
                                                        $19.00
                                                    </s>
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className={"col-12 " + classes.description}>
                                {product.description}
                            </div>
                            <div className="product__type col-12" style={{margin: "10px 0"}}>
                            <span className="d-inline-block product-type"
                                  style={{minWidth: 110, fontWeight: 700}}>Тип:</span> {product.type}
                            </div>
                            <div className="product__type col-12" style={{margin: "10px 0"}}>
                            <span className="d-inline-block product-type"
                                  style={{minWidth: 110, fontWeight: 700}}>Бренд:</span> {product.brand}
                            </div>
                            <div className="product__type col-12"
                                 style={{margin: "10px 0", textTransform: "capitalize"}}>
                            <span className="d-inline-block product-type"
                                  style={{minWidth: 110, fontWeight: 700}}>Стать:</span> {product.sex}
                            </div>
                            <div className="product__type col-12" style={{margin: "10px 0"}}>
                            <span
                                className="d-inline-block product-type" style={{
                                minWidth: 110,
                                fontWeight: 700
                            }}>Наявність:</span> {product.availability ? "Доступні" : "Відсутні"}
                            </div>
                            <div className="product__type d-flex col-12"
                                 style={{margin: "10px 0", textTransform: "capitalize"}}>
                            <span className="d-inline-block product-type"
                                  style={{minWidth: 110, fontWeight: 700}}>Колір:</span>
                                <div className={classes.color} style={{backgroundColor: colors[product.color].value.toString()}}/>
                                {colors[product.color].label}
                            </div>
                            <div className="product__type d-flex align-items-center col-12">
                                <span className="d-inline-block product-type"
                                      style={{minWidth: 110, fontWeight: 700}}>Розміри:</span>
                                <div>
                                    {product.sizes.map(({sizeValue, count}) =>
                                        <Chip key={sizeValue}
                                              className={classes.chip}
                                              style={{
                                                  color: checkedSize === sizeValue ? "white" : "black",
                                                  backgroundColor: checkedSize === sizeValue ? "var(--primary-color)" : "#e0e0e0"
                                              }}
                                              disabled={count === 0}
                                              label={sizeValue}
                                              onClick={() => handleCheckedSizeClick(sizeValue)}/>
                                    )}
                                </div>
                            </div>
                            <div className="product__type d-flex col-12 align-items-center" style={{marginTop: 15}}>
                                <span className="d-inline-block product-type"
                                      style={{minWidth: 110, fontWeight: 700}}>Кількість:</span>
                                <Counter setCount={setCount} count={count}/>
                            </div>
                            <div className="d-flex col-12" style={{marginTop: 15}}>
                                <Button onClick={handleAddCartItems} text="Додати в кошик"/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <ParagraphHeader title="Детальний опис"/>
                        <div className={"w-100 " + classes.full}
                             dangerouslySetInnerHTML={{__html: he.decode(product.fullDescription)}}/>
                    </div>
                </div>
            </section>
        )
    }
;

export default ProductPage;
