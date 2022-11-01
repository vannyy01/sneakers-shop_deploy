import React, {useRef} from 'react';
import {IconButton, makeStyles} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const useStyles = makeStyles(() => ({
    button: {
        minWidth: 50
    },
    itemsContainer: {
        display: "flex",
        padding: "1rem",
        overflowX: "scroll",
        position: "relative",
        "&::-webkit-scrollbar": {
            display: "none"
        }
    }
}));

const CardSwiper: React.FC<{ title?: string }> = ({children, title}) => {
    let containerRef = useRef<HTMLDivElement>();
    const classes = useStyles();

    const handleClickScroll = (scrollForward: boolean = true): void => {
        const scrollStep = containerRef.current.clientWidth / 2;
        scrollForward ? containerRef.current.scrollLeft += scrollStep : containerRef.current.scrollLeft -= scrollStep;
    };

    const handleClickNext = (): () => void => {
        return () => handleClickScroll(true);
    };

    const handleClickPrevious = (): () => void => {
        return () => handleClickScroll(false);
    };

    console.log(containerRef.current?.scrollWidth);
    return children &&
        <div className="row" style={{marginTop: 25}}>
            {title && <h1 className="w-100" style={{fontSize: 23, margin: 0, textAlign: "center"}}>{title}</h1>}
            <div className="d-flex justify-content-between w-100" style={{marginTop: 20}}>
                <div className={`${classes.button} d-flex justify-content-center align-items-center`}>
                    <IconButton onClick={handleClickPrevious()}>
                        <ArrowBackIosIcon/>
                    </IconButton>
                </div>
                <div className={"d-flex align-items-baseline " + classes.itemsContainer}
                     ref={ref => containerRef.current = ref}>
                    {children}
                </div>
                <div className={`${classes.button} d-flex justify-content-center align-items-center`}>
                    <IconButton onClick={handleClickNext()}>
                        <ArrowForwardIosIcon/>
                    </IconButton>
                </div>
            </div>
        </div>
};

export default CardSwiper;