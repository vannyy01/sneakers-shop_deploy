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

const shoppingStyle = {
    color: 'hotpink',
    fontSize: 60,
};

const headerStyle = {
    color: '#03A9F4'
};

const styles = {
    // backgroundImage: "url(https://static.highsnobiety.com/thumbor/AtgJm2sPhxXbYXvsZcCtaK2YcQc=/1200x720/static.highsnobiety.com/wp-content/uploads/2019/09/04164635/custom-sneakers-good-bad-ugly-feature.jpg)",
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
            <section className="special-area section_padding_100">
                <ParagraphHeader title="Оберіть взуття"/>
                <Goods/>
            </section>
            <section style={{marginBottom: !showCard ? '300px' : '0px'}}
                     className="special-area bg-white section_padding_100" id="about">
                <div className="container">
                    <div className="row">
                        <ParagraphHeader title="Чому ми?"/>
                        <TransitionGroup className="d-flex justify-content-around">
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
                </div>
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