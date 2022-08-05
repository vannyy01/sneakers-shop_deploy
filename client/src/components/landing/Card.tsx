import * as React from "react";

interface CardI {
    headerText: string,
    Icon: any,
    showCard?: boolean,
    styles:
        {
            headerStyle: object,
            iconStyle: object
        },
    text: string
}

const Card: React.FC<CardI> = ({headerText, Icon, styles, text}) => {
    return (
        <div className="col-md-4">
            <div className="single-special text-center">
                <div className="single-icon">
                    <Icon style={styles.iconStyle}/>
                </div>
                <h4 style={styles.headerStyle}>{headerText}</h4>
                <p>{text}</p>
            </div>
        </div>
    )
};

export default Card;