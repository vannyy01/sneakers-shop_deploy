import * as React from "react";
import * as ReactCSSTransitionGroup from "react-addons-css-transition-group";

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
    public render() {
        const {animationProperties, headerText, Icon, styles, text} = this.props;
        // @ts-ignore
        return (
            <div className="col-12 col-md-4">
                <ReactCSSTransitionGroup
                    transitionEnterTimeout={animationProperties.enter}
                    transitionLeaveTimeout={animationProperties.exit}
                    transitionName="message"
                >
                    {this.props.showCard ?
                        (
                            <div className="single-special text-center">
                                <div className="single-icon">
                                    <Icon style={styles.iconStyle}/>
                                </div>
                                <h4 style={styles.headerStyle}>{headerText}</h4>
                                <p>{text}</p>
                            </div>
                        ) : null
                    }
                </ReactCSSTransitionGroup>
            </div>
        )
    }
}

export default Card;