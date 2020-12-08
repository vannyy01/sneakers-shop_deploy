import * as React from "react";
import {ShoeInterface} from "../../actions/types";
import {RouteComponentProps} from "react-router-dom";
import MuiAlert, {AlertProps} from "@material-ui/lab/Alert";
import Paper, {PaperProps} from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import {createStyles, Theme} from "@material-ui/core";

export const sexes = [
    {
        label: 'чоловічі',
        value: 'чоловічі',
    },
    {
        label: 'жіночі',
        value: 'жіночі',
    }
];

export const types = [
    {
        label: "Кросівки",
        value: "Кросівки"
    },
    {
        label: "В'єтнамки",
        value: "В'єтнамки",
    },
    {
        label: "Туфлі",
        value: "Туфлі",
    }
];

export function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function PaperComponent(props: PaperProps) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

export const GoodStyles = (theme: Theme) => createStyles({
    alert: {
        marginTop: theme.spacing(7)
    },
    button: {
        margin: theme.spacing(1)
    },
    paper: {
        marginBottom: theme.spacing(3),
        marginTop: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginBottom: theme.spacing(6),
            marginTop: theme.spacing(6),
            padding: theme.spacing(3),
        },
        width: "60em"
    }
});

interface PathParams {
    commID: string
}

export interface PropsType extends RouteComponentProps<PathParams> {
    classes: { alert: string, button: string, paper: string },
}

export interface StateType {
    showAlert: boolean,
    showDialog: boolean,
    formErrors: { title: string, brand: string, description: string, mainImage: string, images: string, type: string, sex: string, price: string },
    formValid: boolean
    good: ShoeInterface,
    isValid: { titleValid: boolean, brandValid: boolean, descriptionValid: boolean, mainImageValid: boolean, imagesValid: boolean, typeValid: boolean, sexValid: boolean, priceValid: boolean },
}

abstract class BaseGood<P extends PropsType, S extends StateType> extends React.Component<P, S> {
    constructor(props: P) {
        super(props);
        this.state = this.defaultState() as S;
    }
    protected defaultState = ():StateType => ({
        showAlert: false,
        showDialog: false,
        good: {
            _id: '',
            title: '',
            description: '',
            mainImage: '',
            images: [''],
            type: '',
            sex: '',
            price: 0,
            brand: ''
        },
        isValid: {
            titleValid: true,
            brandValid: true,
            descriptionValid: true,
            mainImageValid: true,
            imagesValid: true,
            typeValid: true,
            sexValid: true,
            priceValid: true
        },
        formErrors: {
            title: '',
            brand: '',
            description: '',
            mainImage: '',
            images: '',
            type: '',
            sex: '',
            price: ''
        },
        formValid: false,
    });

    protected handleComeBack = (): void => {
        this.props.history.goBack();
    };

    protected handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, label: keyof ShoeInterface) => {
        const newState: ShoeInterface = this.state.good;
        const {name, value} = event.target;
        if (label === "images") {
            newState[label] = value.split(",");
            this.setState({good: newState}, () => {
                this.validateField(name, newState[label]);
            });
            return;
        }
        if (label === "price") {
            newState[label] = value !== '' ? Number.parseInt(value) : 0;
            this.setState({good: newState}, () => {
                this.validateField(name, newState[label]);
            });
            return;
        }
        newState[label] = value;
        this.setState({good: newState}, () => {
            this.validateField(name, newState[label]);
        });
    };
    protected handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (!this.state.formValid) {
            this.setState({showAlert: true});
            return;
        }
        const {_id, title, description, mainImage, images, type, sex, price, brand} = this.state.good;
        const good = {
            _id,
            title: title.trim(),
            description: description.trim(),
            mainImage: mainImage.trim(),
            images,
            type: type.trim(),
            brand: brand.trim(),
            sex: sex.trim(),
            price
        };
        this.setState({showDialog: true, good});
    };
    protected handleClose = (name: "cancel" | "alert" | "save"): void => {
        switch (name) {
            case "cancel":
                this.setState({showDialog: false});
                break;
            case "alert":
                this.setState({showAlert: false});
                break;
            default:
                alert('Збережено');
                console.log(this.state.good);
                break;
        }
    };
    protected validateField = (fieldName: string, value: any): void => {
        const fieldValidationErrors = this.state.formErrors;
        const {isValid} = this.state;
        switch (fieldName) {
            case 'title':
                if (typeof value !== 'string') {
                    fieldValidationErrors.title = 'некоректний текст';
                    isValid.titleValid = false;
                    break;
                }
                if (value.length < 2) {
                    fieldValidationErrors.title = 'занадто коротка назва';
                    isValid.titleValid = false;
                    break;
                }
                fieldValidationErrors.title = '';
                isValid.titleValid = true;
                break;
            case 'type':
                if (typeof value !== 'string') {
                    fieldValidationErrors.type = 'некоректний тип';
                    isValid.typeValid = false;
                }
                break;
            case 'brand' :
                if (typeof value !== 'string') {
                    fieldValidationErrors.brand = 'некоректний текст';
                    isValid.brandValid = false;
                    break;
                }
                if (value.length < 2) {
                    fieldValidationErrors.brand = 'занадто коротка назва';
                    isValid.brandValid = false;
                    break;
                }
                fieldValidationErrors.brand = '';
                isValid.brandValid = true;
                break;
            case 'description':
                if (typeof value !== 'string') {
                    fieldValidationErrors.description = 'некоректний текст';
                    isValid.descriptionValid = false;
                    break;
                }
                if (value.length < 15) {
                    fieldValidationErrors.description = 'короткий текст';
                    isValid.descriptionValid = false;
                    break;
                }
                fieldValidationErrors.description = '';
                isValid.descriptionValid = true;
                break;
            case 'sex':
                if (typeof value !== 'string') {
                    fieldValidationErrors.sex = 'некоректний текст';
                    isValid.sexValid = false;
                    break;
                }
                fieldValidationErrors.sex = '';
                isValid.sexValid = true;
                break;
            case 'mainImage':
                if (typeof value !== 'string') {
                    fieldValidationErrors.mainImage = 'некоректний текст';
                    isValid.mainImageValid = false;
                    break;
                }
                if (value.length < 6) {
                    fieldValidationErrors.mainImage = 'занадто коротка назва';
                    isValid.mainImageValid = false;
                    break;
                }
                fieldValidationErrors.mainImage = '';
                isValid.mainImageValid = true;
                break;
            case 'images':
                if (!Array.isArray(value)) {
                    fieldValidationErrors.images = 'некоректний тип даних';
                    isValid.imagesValid = false;
                    break;
                }
                if (value.join('').length < 6) {
                    fieldValidationErrors.images = 'додайте зображення';
                    isValid.imagesValid = false;
                    break;
                }
                fieldValidationErrors.images = '';
                isValid.imagesValid = true;
                break;
            case 'price':
                if (Number.parseInt(value) === 0 || value === '') {
                    fieldValidationErrors.price = 'ви ввели 0';
                    isValid.priceValid = false;
                    break;
                }
                if (isNaN(Number.parseInt(value))) {
                    fieldValidationErrors.price = 'некоректний тип даних';
                    isValid.priceValid = false;
                    break;
                }
                fieldValidationErrors.price = '';
                isValid.priceValid = true;
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            isValid
        }, this.validateForm);
    };

    protected validateForm = (): void => {
        let isValid = true;
        for (const key in this.state.isValid) {
            if (!this.state.isValid[key]) {
                isValid = false;
            }
        }
        this.setState({formValid: isValid});
    };

    protected abstract handleSave(): void;

    protected abstract handleDelete(): void;

}

export default BaseGood;