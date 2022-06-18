import * as React from 'react';
import {RefObject} from "react";
import {connect} from "react-redux";
import Header from './Header';
import {Card, Goods, ParagraphHeader} from './landing';
import {fetchGoods, clearGoodsState} from '../actions';
import Shopping from '@material-ui/icons/ShoppingBasket';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
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

const animationProperties = {
    enter: 1200,
    exit: 1400
};

interface CardContent {
    id: string,
    headerText: string,
    text: string
}

const cardsContent: CardContent[] = [
    {
        id: '1',
        headerText: "Easy to use",
        text: "We build pretty complex tools and this allows us to take designs and turn them into functional quickly."
    },
    {
        id: '2',
        headerText: "Comfy",
        text: "We build pretty complex tools and this allows us to take designs and turn them into functional quickly."
    },
    {
        id: '3',
        headerText: "Customizable",
        text: "We build pretty complex tools and this allows us to take designs and turn them into functional quickly."
    }
];

interface LandingStateI {
    justifyCards: string,
    showCard: boolean,
}

// tslint:disable-next-line:no-empty-interface
interface LandingPropsI {}

class Main extends React.PureComponent<LandingPropsI, LandingStateI> {
    private readonly ScrollRef: RefObject<any>;

    constructor(props: LandingPropsI) {
        super(props);
        this.state = {
            justifyCards: innerWidth < 767 ? "justify-content-around" : "justify-content-between",
            showCard: false,
        };
        this.ScrollRef = React.createRef();
    }

    public componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    public componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    };

    public render() {
        return (
            <div ref={this.ScrollRef} onScroll={this.handleScroll}>
                <Header styles={styles} title="Брендове взуття" description="Купіть взуття за доступними цінами"/>
                <section style={{marginBottom: !this.state.showCard ? '300px' : '0px'}}
                         className="special-area bg-white section_padding_100" id="about">
                    <div className="container">
                        <div className="row">
                            <ParagraphHeader title="Чому ми?"/>
                            <TransitionGroup className="d-flex justify-content-around">
                                {this.state.showCard && cardsContent.map(({id, headerText, text}) =>
                                    <CSSTransition key={id} timeout={500} classNames="card">
                                        <Card Icon={Shopping}
                                              styles={{headerStyle, iconStyle: shoppingStyle}}
                                              headerText={headerText}
                                              text={text}/>
                                    </CSSTransition>
                                )}
                            </TransitionGroup>
                        </div>
                    </div>
                </section>
                <section className="special-area section_padding_100">
                    <ParagraphHeader title="Оберіть взуття"/>
                    <Goods justifyCards={this.state.justifyCards}/>
                </section>
            </div>
        )
    }

    protected handleScroll = (): void => {
        if (window.scrollY >= innerHeight / 2.2) {
            this.setState(() => ({showCard: true}))
        }
    };


}

/**
 * @param {any} goods
 * @returns {{goods}}
 */
const mapStateToProps = ({goods:{goods}}: any) => ({goods});

export default connect(mapStateToProps, {fetchGoods, clearGoodsState})(Main);