import * as React from 'react';
import {useEffect, useRef, useState} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {fetchSiteOptions} from "../actions/SiteOptionController";
import Header from './Header';
import {Card, Goods, ParagraphHeader} from './landing';
import Shopping from '@material-ui/icons/ShoppingBasket';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import {SiteOptionType} from "../actions/types";
import {isEmpty} from "lodash";
import './landing/landing.css';
import CardSwiper from "./CardSwiper";
import CommodityCard from "./landing/CommodityCard";
import {useLookOverGoods} from "./common/useLookOverGood";
import {useGoodsForSale} from "./common/useGoodsForSale";

const shoppingStyle = {
    color: 'hotpink',
    fontSize: 60,
};

const headerStyle = {
    color: '#03A9F4'
};

const styles = {
    height: innerHeight,
    marginBottom: 0,
    marginTop: "2em",
    minHeight: 750,
};

const animationProperties = {
    enter: 1200,
    exit: 1400
};

const Main: React.FC<{ siteOptions: SiteOptionType[] }> = ({siteOptions}) => {
    const lookedOverGoods = useLookOverGoods(true);
    const goodsForSale = useGoodsForSale();
    const [showCard, setShowCard] = useState<boolean>(false);
    const cards = siteOptions.filter(item => item.name !== "main_page_header");
    const mainHeader = siteOptions.find(item => item.name === "main_page_header");
    const backgroundImage = `url(resources/main_page_header/${mainHeader.backgroundImage})`;
    const ScrollRef = useRef();

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScroll = (): void => {
        if (!showCard && window.scrollY >= innerHeight / 2.2) {
            setShowCard(true);
        }
    };

    return (
        <div ref={ScrollRef} onScroll={handleScroll}>
            <Header styles={{...styles, backgroundImage}} title={mainHeader.title}
                    description={mainHeader.description}/>
            <section className="goods_for_sale special-area section_padding_100 container">
                <ParagraphHeader title="Акційні товари"/>
                <CardSwiper>
                    {goodsForSale.map(good =>
                        <CommodityCard key={good._id} good={good} cardSize="col-6 col-md-4"
                                       style={{minHeight: 420}}/>
                    )}
                </CardSwiper>
            </section>
            <section id="why_us" style={{marginBottom: !showCard ? '300px' : '0px'}}
                     className="why_us special-area bg-white section_padding_100 container">
                <div className="row justify-content-center">
                    <ParagraphHeader title="Чому ми?"/>
                    <TransitionGroup
                        className="d-flex flex-column flex-lg-row align-items-center justify-content-lg-around">
                        {showCard && cards.length > 0
                            && cards.map(({
                                              name,
                                              title,
                                              description
                                          }) =>
                                <CSSTransition key={name} timeout={500} classNames="card">
                                    <Card Icon={Shopping}
                                          styles={{headerStyle, iconStyle: shoppingStyle}}
                                          headerText={title}
                                          text={description}/>
                                </CSSTransition>
                            )}
                    </TransitionGroup>
                </div>
            </section>
            <section className="goodsList special-area section_padding_100">
                <ParagraphHeader title="Оберіть взуття"/>
                <Goods/>
            </section>
            <section className="looked_over_goods special-area section_padding_100 container">
                <ParagraphHeader title="Переглянуті товари"/>
                <CardSwiper>
                    {lookedOverGoods.map(good =>
                        <CommodityCard key={good._id} good={good} cardSize="col-6 col-md-4 col-lg-3"
                                       style={{minHeight: 420}}/>
                    )}
                </CardSwiper>
            </section>
        </div>
        // <div style={{marginTop: 100, marginLeft: 50}}>
        //     <p>Вибачте, сайт тимчасово не працює. Спробуйте зайти пізніше.</p>
        // </div>
    )
}

const MainWrapper: React.FC = () => {

    const dispatch = useDispatch();
    const getSelector = ({siteOptions: siteOpts}: { siteOptions: SiteOptionType[] }): SiteOptionType[] => siteOpts;
    const siteOptions = useSelector(getSelector, shallowEqual);

    useEffect(() => {
        dispatch(fetchSiteOptions(["*"]));
    }, [dispatch]);

    return !isEmpty(siteOptions) && <Main siteOptions={siteOptions}/>
}

export default MainWrapper;