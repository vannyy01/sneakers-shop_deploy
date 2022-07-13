import * as React from "react";
import {ReactElement} from "react";
import {ShoeInterface, SizeInterface} from "../../../actions/types";
import {RouteComponentProps} from "react-router-dom";
import MuiAlert, {AlertProps} from "@material-ui/lab/Alert";
import Paper, {PaperProps} from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import {createStyles, Theme} from "@material-ui/core";
import {validateNumberInput} from "../../../actions/validation";
import {ItemDataType, ItemsType} from "../../types";
import {ActionMeta, components, OptionProps, PlaceholderProps} from "react-select";
import IconButton from "@material-ui/core/IconButton";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";

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
    },
    root: {height: 27},
});

interface PathParams {
    commID: string
}

export interface BaseGoodPropsType extends RouteComponentProps<PathParams> {
    classes: { alert: string, button: string, paper: string },
    brands?: ItemsType,
    fetchBrands: () => void,
    createBrand: (brand: ItemDataType) => void,
    deleteBrand: (brandName: string, onSuccessCallback: () => void) => void,
}

export interface BaseGoodStateType {
    showAlert: boolean,
    showDialog: boolean,
    showDeleteOptionDialog: boolean,
    optionToDelete?: string,
    typing: boolean,
    isLoading: boolean,
    typingTimeout?: NodeJS.Timeout,
    formErrors: { title: string, brand: string, description: string, mainImage: string, images: string, type: string, color: string, sex: string, price: string },
    formValid: boolean
    good: ShoeInterface,
    isValid: { titleValid: boolean, brandValid: boolean, descriptionValid: boolean, mainImageValid: boolean, imagesValid: boolean, typeValid: boolean, colorValid: boolean, sexValid: boolean, priceValid: boolean },
}

abstract class BaseGood<P extends BaseGoodPropsType, S extends BaseGoodStateType> extends React.Component<P, S> {

    protected static defaultState(): BaseGoodStateType {
        return {
            showAlert: false,
            showDialog: false,
            showDeleteOptionDialog: false,
            typing: false,
            isLoading: false,
            good: {
                _id: '',
                title: '',
                description: '',
                mainImage: '',
                sizes: [],
                type: '',
                sex: '',
                price: 0,
                brand: '',
                color: ''
            },
            isValid: {
                titleValid: true,
                brandValid: true,
                descriptionValid: true,
                mainImageValid: true,
                imagesValid: true,
                typeValid: true,
                colorValid: true,
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
                color: '',
                sex: '',
                price: ''
            },
            formValid: false,
        }
    };

    protected handleComeBack = (): void => {
        this.props.history.goBack();
    };

    protected handleAddChips = (chipArray: SizeInterface[]): void => {
        const newState: ShoeInterface = this.state.good;
        newState.sizes = chipArray;
        this.setState({good: newState});
    };

    protected handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (!this.state.formValid) {
            this.setState({showAlert: true});
            return;
        }
        const {_id, title, description, mainImage, type, sex, price, brand, color, sizes} = this.state.good;
        const good: ShoeInterface = {
            _id,
            title: title.trim(),
            brand: brand.trim(),
            description: description.trim(),
            price,
            mainImage: mainImage.trim(),
            sizes,
            type: type.trim(),
            sex: sex.trim(),
            color: color.trim()
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
            case 'color':
                if (typeof value !== 'string') {
                    fieldValidationErrors.color = 'некоректний тип';
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
                if (+value === 0) {
                    fieldValidationErrors.price = 'ви ввели 0';
                    isValid.priceValid = false;
                    break;
                }
                if (+value > 99999) {
                    fieldValidationErrors.price = 'товари за такою ціною відсутні';
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

    protected setMainImage = (mainImage: string): void => {
        const newState: ShoeInterface = this.state.good;
        newState.mainImage = mainImage;
        this.setState({good: newState});
    }

    protected handleOnChange = ({
                                    target: {name, value},
                                }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const self = this;
        if (self.state.typingTimeout) {
            clearTimeout(self.state.typingTimeout);
        }

        const newState: ShoeInterface = this.state.good;
        if (name === "price") {
            newState[name] = validateNumberInput(value);
        } else if (name !== "sizes") {
            newState[name] = value;
        }

        self.setState({
            typing: false,
            typingTimeout: setTimeout(() => {
                    self.setState({
                        good: newState
                    }, () => {
                        self.validateField(name, newState[name]);
                    });
                }
                , 200)
        });
    };

    protected handleChangeList = (newValue: ItemDataType, actionMeta: ActionMeta<ItemDataType>): void => {
        const newState: ShoeInterface = this.state.good;
        newState[actionMeta.name] = newValue?.label || "";
        this.setState({
            good: newState
        }, () => {
            this.validateField(actionMeta.name, newState[actionMeta.name]);
        });
    };

    protected handleCreateBrand = (inputValue: string): void => {
        this.validateField('brand', inputValue);
        if (this.state.isValid.brandValid) {
            this.setState({isLoading: true});
            setTimeout(() => {
                this.props.createBrand({label: inputValue, value: inputValue});
                const newState: ShoeInterface = this.state.good;
                newState.brand = inputValue;
                this.setState({
                    isLoading: false,
                    good: newState,
                });
            }, 1000);
        }
    };

    protected showDeleteOptionDialog = (event: React.MouseEvent<HTMLButtonElement>, brandName: string): void => {
        event.stopPropagation();
        this.setState({showDeleteOptionDialog: true, optionToDelete: brandName});
    };

    protected handleDeleteOption = (): void => {
        this.setState({isLoading: true});
        setTimeout(() => {
            this.props.deleteBrand(this.state.optionToDelete, () => {
                this.setState({
                    showDeleteOptionDialog: false, optionToDelete: undefined, isLoading: false,
                })
            });
        }, 1000);
    };

    protected Option = (props: OptionProps<ItemDataType>): ReactElement => {
        return <components.Option {...props} className="d-flex justify-content-between">
            <span>{props.label}</span>
            {!props.data.__isNew__ &&
                <IconButton size="small" onClick={(event) => this.showDeleteOptionDialog(event, props.label)}>
                    <CloseRoundedIcon fontSize="small"/>
                </IconButton>
            }
        </components.Option>;
    };

    protected Placeholder: React.FC<PlaceholderProps<ItemDataType>> = (props): ReactElement => {
        return <components.Placeholder {...props} children={props.children}/>;
    };

    protected abstract handleSave(): void;

    protected abstract handleDelete(): void;

}

export default BaseGood;