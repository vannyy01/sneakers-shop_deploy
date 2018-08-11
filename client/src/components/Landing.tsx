import * as React from 'react';
import Header from "./Header";
import ParagraphHeader from "./landing/ParagraphHeader";

import Shopping from '@material-ui/icons/ShoppingBasket';

import Card from "./landing/Card";
import './landing/landing.css';

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

export default class Landing extends React.Component<{}, { showCard: boolean }> {
    constructor(props: {}) {
        super(props);
        this.state = {
            showCard: false
        };
        this.onClick = this.onClick.bind(this);
        this.Scroll = this.Scroll.bind(this);
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
                <div style={{height: 500, width: '100%'}}/>
            </div>
        )
    }

    protected Scroll = () => {
        this.setState({showCard: true});
    };

    protected onClick = () => {
        this.setState((prevState) => {
            return {showCard: !prevState.showCard}
        });
    };
}