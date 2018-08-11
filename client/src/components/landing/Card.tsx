import * as React from "react";
import {CSSTransition} from "react-transition-group";

interface CardI {
    animationProperties: {
        enter: number,
        exit: number,
    },
    headerText: string,
    Icon: any,
    showCard: boolean,
    styles:
        {
            headerStyle: object,
            iconStyle: object
        },
    text: string
}

class Card extends React.Component <CardI> {
    constructor(props: CardI) {
        super(props);
        this.onExited = this.onExited.bind(this);
    }

    public onExited = () => {
        this.setState({
            showCard: false,
        })
    };

    public render() {
        const {animationProperties, headerText, Icon, styles, text} = this.props;
        return (
            <div className="col-12 col-md-4">
                <CSSTransition
                    in={this.props.showCard}
                    timeout={animationProperties}
                    classNames="message"
                    unmountOnExit={true}
                >
                    {(state: any) =>
                        (
                            <div className="single-special text-center">
                                <div className="single-icon">
                                    <Icon style={styles.iconStyle}/>
                                </div>
                                <h4 style={styles.headerStyle}>{headerText}</h4>
                                <p>{text}</p>
                            </div>
                        )
                    }
                </CSSTransition>
            </div>
        )
    }
}

export default Card;