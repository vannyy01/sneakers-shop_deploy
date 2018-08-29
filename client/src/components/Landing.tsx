import * as React from 'react';

import * as _ from 'lodash';
import {connect} from "react-redux";

import Header from "./Header";
import ParagraphHeader from "./landing/ParagraphHeader";

import {fetchGoods} from '../actions';

import Shopping from '@material-ui/icons/ShoppingBasket';

import Card from "./landing/Card";
import './landing/landing.css';

import CommodityCard from './landing/CommodityCard';

const shoppingStyle = {
    color: 'hotpink',
    fontSize: 60,
};

const headerStyle = {
    color: '#03A9F4'
};

const styles = {
    backgroundImage: "url(http://static1.uk.businessinsider.com/image/59b820f4ba785e45c50fbd69-1422/lede.jpg)",
    height: "100%",
    marginBottom: 0,
    marginTop: "2em",
    minHeight: 750,
};

interface LandingStateI {
    showCard: boolean
}

interface LandingPropsI {
    goods?: [any],
    fetchGoods: any
}

class Landing extends React.Component<LandingPropsI, LandingStateI> {
    constructor(props: LandingPropsI) {
        super(props);
        this.state = {
            showCard: false
        };
        this.Scroll = this.Scroll.bind(this);
    }

    public componentDidMount() {
        this.props.fetchGoods();
    }

    public render() {
        const animationProperties = {
            enter: 1200,
            exit: 1400
        };
        return (
            <div>
                <Header styles={styles} title="Брендове взуття" description="Купіть взуття за доступними цінами"/>
                <section onWheel={this.Scroll} onMouseEnter={this.Scroll}
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
                {this.state.showCard ?
                    <section className="special-area section_padding_100">
                        <ParagraphHeader title="Оберіть взуття"/>
                        <div className="container">
                            <div className="row">
                                {!this.props.goods ?
                                    <div>Loading...</div> :
                                    _.map(this.props.goods, (good, index) =>
                                        <CommodityCard key={index} good={good}/>
                                    )
                                }
                            </div>
                        </div>
                    </section>
                    : null}
            </div>
        )
    }

    protected Scroll = () => {
        this.setState(() => {
            return {showCard: true}
        });
    };
}

/**
 * @param {any} goods
 * @returns {{goods}}
 */
const mapStateToProps = ({goods}: any) => ({
    goods
});

export default connect(mapStateToProps, {fetchGoods})(Landing);