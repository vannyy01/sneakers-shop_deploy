import * as _ from "lodash";
import {getComparator} from "../../utils";
import CommodityCard from "./CommodityCard";
import * as React from "react";
import {ShoeInterface} from "../../actions/types";
import {Order, OrderBy} from "../../types";
import {LoadCommodities} from "./index";
import {useState} from "react";
import {useAutoAnimate} from "@formkit/auto-animate/react";

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
    const [expanded, setExpanded] = useState<boolean>(false);
    const [parent] = useAutoAnimate<HTMLDivElement>();

    const handleClick = (): void => {
        handleLoadClick();
        setExpanded(true);
    };

    return (
        <>
            <div className="row align-items-baseline justify-content-center justify-content-lg-around justify-content-xl-between" ref={parent}>
                {goods.length > 0 ?
                    _.map(goods.sort(getComparator<CompareGoods>(order, orderBy.includes("price") ? "price" : orderBy)),
                        (good, index) =>
                            <CommodityCard key={index} good={good} cardSize="col-12 col-md-6 col-lg-4"/>
                    ) : <div>Loading...</div>
                }
            </div>
            <LoadCommodities onTransitionEnd={() => setExpanded(false)} expanded={expanded}
                             handleLoadClick={handleClick}/>
        </>
    )
};

export default GoodsList;