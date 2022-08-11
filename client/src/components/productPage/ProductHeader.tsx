import React, {useEffect, useState} from 'react';
import {colors} from "../admin/goods/goodTypes";
import IconButton from "@material-ui/core/IconButton";
import Star from "@material-ui/icons/Star";
import StarBorder from "@material-ui/icons/StarBorder";
import {checkStorage, removeStorage, setStorage} from "../../actions/validation";
import {capitalize} from "@material-ui/core";

const ProductHeader: React.FC<{ id: string, brand: string, title: string, color: string }> = ({
                                                                                                  id,
                                                                                                  brand,
                                                                                                  title,
                                                                                                  color
                                                                                              }) => {
    const [fav, setFav] = useState<boolean>();

    useEffect(() => {
        setFav(!checkStorage("FavouritesGoods", id));
    }, []);

    const likeGood = (): void => {
        setStorage("FavouritesGoods", id);
        setFav(!checkStorage("FavouritesGoods", id));
    };

    const dislikeGood = (): void => {
        removeStorage("FavouritesGoods", id);
        setFav(!checkStorage("FavouritesGoods", id));
    };

    return (
        <div className="d-flex align-items-center col-12">
            <h1 style={{fontSize: 23, margin: 0}}>
                {(`${brand} ${title} ${capitalize(colors[color].label)}`)}
            </h1>
            <div style={{marginLeft: 15}}>
                {fav ?
                    <IconButton aria-label="Додати в обрані" onClick={dislikeGood}>
                        <Star style={{color: '#FFDF00'}}/>
                    </IconButton> :
                    <IconButton aria-label="Прибрати з обраних" onClick={likeGood}>
                        <StarBorder/>
                    </IconButton>
                }
            </div>
        </div>
    );
}

export default ProductHeader;