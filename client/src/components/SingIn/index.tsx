import * as React from 'react';
import {useEffect} from 'react';
import * as ReactDOM from 'react-dom';
import {makeStyles} from "@material-ui/core";
import {useImperativeDisableScroll} from "../../utils";

const useStyles = makeStyles(() => ({
    singIn: {
        PositionProperty: 'fixed',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height: '!100%',
        left: 0,
        minHeight: '670px',
        top: 0,
        width: '100%',
        zIndex: 1111,
    }
}));

const SingInForm: React.FC = ({children}) => {
    useImperativeDisableScroll({element: document.documentElement, disabled: true});
    const el: HTMLDivElement = document.createElement('div');
    const modalRoot: HTMLElement = document.getElementById('SingInFormRoot');
    const classes = useStyles();

    useEffect(() => {
        modalRoot.appendChild(el);
        document.body.style.paddingRight = "14px";
        return () => {
            modalRoot.removeChild(el);
            document.body.style.removeProperty("padding-right");
        }
    }, []);


    const modal = (): JSX.Element =>
        <div className={`${classes.singIn} modal d-flex justify-content-center align-items-center`}>
            {children}
        </div>;

    return ReactDOM.createPortal(
        // Any valid React child: JSX, strings, arrays, etc.
        modal(),
        // A DOM element
        el,
    );
}

export default SingInForm;