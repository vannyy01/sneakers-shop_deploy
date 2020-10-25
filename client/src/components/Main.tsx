import * as React from 'react';
import {RefObject} from "react";

import {connect} from "react-redux";

import Header from './Header';
import {Card, Goods, LoadCommodities, ParagraphHeader} from './landing';

import {fetchGoods} from '../actions';
import {ShoeInterface} from "../actions/types";

import Shopping from '@material-ui/icons/ShoppingBasket';

import './landing/landing.css';


const shoppingStyle = {
    color: 'hotpink',
    fontSize: 60,
};

const headerStyle = {
    color: '#03A9F4'
};

const styles = {
    backgroundImage: "url(https://static.highsnobiety.com/thumbor/AtgJm2sPhxXbYXvsZcCtaK2YcQc=/1200x720/static.highsnobiety.com/wp-content/uploads/2019/09/04164635/custom-sneakers-good-bad-ugly-feature.jpg)",
    height: innerHeight,
    marginBottom: 0,
    marginTop: "2em",
    minHeight: 750,
};

interface LandingStateI {
    expanded: boolean,
    goodsCount: number,
    justifyCards: string,
    showCard: boolean
}

interface LandingPropsI {
    goods?: ShoeInterface[],
    fetchGoods: (to: number) => void
}

class Main extends React.PureComponent<LandingPropsI, LandingStateI> {
    private readonly ScrollRef: RefObject<any>;

    constructor(props: LandingPropsI) {
        super(props);
        this.state = {
            expanded: false,
            goodsCount: 0,
            justifyCards: innerWidth < 767 ? "justify-content-around" : "justify-content-between",
            showCard: false
        };
        this.ScrollRef = React.createRef();
    }

    public componentDidMount() {
        this.props.fetchGoods(this.state.goodsCount);
        window.addEventListener('scroll', this.handleScroll);
    }

    public componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    };


    public render() {
        const animationProperties = {
            enter: 1200,
            exit: 1400
        };
        return (
            <div ref={this.ScrollRef} onScroll={this.handleScroll}>
                <Header styles={styles} title="Брендове взуття" description="Купіть взуття за доступними цінами"/>
                <section style={{marginBottom: !this.state.showCard ? '300px' : '0px'}}
                         className="special-area bg-white section_padding_100" id="about">
                    <div className="container">
                        <div className="row">
                            <ParagraphHeader title="Чому ми?"/>
                            <Card animationProperties={animationProperties} Icon={Shopping}
                                  showCard={this.state.showCard}
                                  styles={{headerStyle, iconStyle: shoppingStyle}}
                                  headerText="Easy to use"
                                  text="We build pretty complex tools and this allows us
                        to take designs and turn them"/>
                            <Card animationProperties={animationProperties} Icon={Shopping}
                                  showCard={this.state.showCard}
                                  styles={{headerStyle, iconStyle: shoppingStyle}}
                                  headerText="Easy to use"
                                  text="We build pretty complex tools and this allows us
                        to take designs and turn them
                        into functional quickly."/>
                            <Card animationProperties={animationProperties} Icon={Shopping}
                                  showCard={this.state.showCard}
                                  styles={{headerStyle, iconStyle: shoppingStyle}}
                                  headerText="Customizable"
                                  text="We build pretty complex tools and this allows us to take designs and turn them
                        into functional quickly."/>
                        </div>
                    </div>
                </section>
                <section className="special-area section_padding_100">
                    <ParagraphHeader title="Оберіть взуття"/>
                    <Goods justifyCards={this.state.justifyCards} goods={this.props.goods}/>
                    <LoadCommodities onTransitionEnd={this.onSpin} expanded={this.state.expanded}
                                     handleLoadClick={this.handleLoadClick}/>
                </section>
            </div>
        )
    }

    protected handleScroll = (): void => {
        if (window.scrollY >= innerHeight / 2.2) {
            this.setState(() => ({showCard: true}))
        }
    };

    protected onSpin = (): void => {
        this.setState(() => ({expanded: false}))
    };

    protected handleLoadClick = (): void => {
        this.setState((state) => ({expanded: true, goodsCount: state.goodsCount + 3}));
        this.props.fetchGoods(this.state.goodsCount + 3);
    }
}

/**
 * @param {any} goods
 * @returns {{goods}}
 */
const mapStateToProps = ({goods}: any) => ({goods});

export default connect(mapStateToProps, {fetchGoods})(Main);