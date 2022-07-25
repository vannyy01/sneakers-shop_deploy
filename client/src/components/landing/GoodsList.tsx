import * as _ from "lodash";
import {getComparator} from "../../utils";
import CommodityCard from "./CommodityCard";
import * as React from "react";
import {ShoeInterface} from "../../actions/types";
import {Order, OrderBy} from "../../types";
import {LoadCommodities} from "./index";
import {useState} from "react";

type CompareGoods = Omit<ShoeInterface, "description">;

interface GoodsListType {
    goods: ShoeInterface[],
    order: Order,
    orderBy: OrderBy,
    handleLoadClick: () => void
}

const GoodsList: React.FC<GoodsListType> = ({
                                                goods,
                                                order,
                                                orderBy,
                                                handleLoadClick
                                            }) => {
    const justifyCards = innerWidth < 767 ? "justify-content-around" : "justify-content-between";
    const [expanded, setExpanded] = useState<boolean>(false);

    const handleClick = (): void => {
        handleLoadClick();
        setExpanded(true);
    };

    return (
        <>
            <div className={`row ${justifyCards}`}>
                {goods.length > 0 ?
                    _.map(goods.sort(getComparator<CompareGoods>(order, orderBy.includes("price") ? "price" : orderBy)),
                        (good, index) =>
                            <CommodityCard key={index} good={good}/>
                    ) : <div>Loading...</div>
                }
            </div>
            <LoadCommodities onTransitionEnd={() => setExpanded(false)} expanded={expanded}
                             handleLoadClick={handleClick}/>
        </>
    )
};

export default GoodsList;