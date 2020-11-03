import * as React from 'react';

import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import {createStyles, Theme} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import {RouteComponentProps} from 'react-router-dom';

import Button from "@material-ui/core/Button";
import DeleteIcon from '@material-ui/icons/Delete';
import {connect} from 'react-redux';
import {fetchGoodByID} from "../../actions";
import {ShoeInterface} from "../../actions/types";
import Snackbar from "@material-ui/core/Snackbar";

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}




const styles = (theme: Theme) => createStyles({
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

interface PropsType extends RouteComponentProps<PathParams> {
    classes: { button: string, paper: string },
    fetchGoodByID: (id: string) => void,
    good: ShoeInterface
}

interface StateType {
    showAlert: boolean,
    formErrors: { title: string, brand: string, description: string, mainImage: string, images: string, type: string, sex: string, price: string },
    formValid: boolean
    good: ShoeInterface | {},
    isValid: { titleValid: boolean, brandValid: boolean, descriptionValid: boolean, mainImageValid: boolean, imagesValid: boolean, typeValid: boolean, sexValid: boolean, priceValid: boolean },
}

const sexes = [
    {
        label: 'чоловічі',
        value: 'чоловічі',
    },
    {
        label: 'жіночі',
        value: 'жіночі',
    }
];

const types = [
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

class AddressForm extends React.Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            showAlert: false,
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
            formValid: true,
            good: {},
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
        }
    }

    public componentDidMount() {
        this.props.fetchGoodByID(this.props.match.params.commID);
        this.setState({good: this.props.good})
    }

    public componentDidUpdate(prevProps: Readonly<PropsType>, prevState: Readonly<StateType>, snapshot?: any): void {
        if (JSON.stringify(prevProps.good) !== JSON.stringify(this.props.good)) {
            this.setState({good: this.props.good})
        }
    }

    public render() {
        if (this.state.good.hasOwnProperty('_id')) {
            // @ts-ignore
            const {title, brand, description, mainImage, images, type, sex, price} = this.state.good;
            return <Paper className={this.props.classes.paper}>
                <Typography component="h1" variant="h4" align="center">
                    Товар
                </Typography>
                <React.Fragment>
                    <Typography variant="h6" gutterBottom={true}>
                        Редагування
                    </Typography>
                    <form noValidate={true} onSubmit={event => this.handleSubmit(event)}>
                        <Grid container={true} spacing={3}>
                            <Grid item={true} xs={12} sm={6}>
                                <TextField
                                    required={true}
                                    id="title"
                                    name="title"
                                    label="Назва моделі"
                                    fullWidth={true}
                                    autoComplete="title-name"
                                    value={title}
                                    onChange={event => this.handleChange(event, 'title')}
                                    helperText={this.state.formErrors.title}
                                    error={this.state.formErrors.title.length > 0}
                                />
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <TextField
                                    required={true}
                                    id="brand"
                                    name="brand"
                                    label="Бренд"
                                    fullWidth={true}
                                    autoComplete="brand-name"
                                    value={brand}
                                    onChange={event => this.handleChange(event, 'brand')}
                                    helperText={this.state.formErrors.brand}
                                    error={this.state.formErrors.brand.length > 0}
                                />
                            </Grid>
                            <Grid item={true} xs={12}>
                                <TextField
                                    required={true}
                                    id="description"
                                    name="description"
                                    multiline={true}
                                    rowsMax={4}
                                    label="Опис товару"
                                    fullWidth={true}
                                    autoComplete="description-name"
                                    value={description}
                                    onChange={event => this.handleChange(event, 'description')}
                                    helperText={this.state.formErrors.description}
                                    error={this.state.formErrors.description.length > 0}
                                />
                            </Grid>
                            <Grid item={true} xs={12}>
                                <TextField
                                    required={true}
                                    id="mainImage"
                                    name="mainImage"
                                    label="Заставка"
                                    multiline={true}
                                    fullWidth={true}
                                    autoComplete="mainImage-name"
                                    value={mainImage}
                                    onChange={event => this.handleChange(event, 'mainImage')}
                                    helperText={this.state.formErrors.mainImage}
                                    error={this.state.formErrors.mainImage.length > 0}
                                />
                            </Grid>
                            <Grid item={true} xs={12}>
                                <TextField
                                    required={true}
                                    id="images"
                                    name="images"
                                    label="Вводити через ','"
                                    fullWidth={true}
                                    multiline={true}
                                    autoComplete="mainImage-name"
                                    value={images}
                                    onChange={event => this.handleChange(event, 'images')}
                                    helperText={this.state.formErrors.images}
                                    error={this.state.formErrors.images.length > 0}
                                />
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <TextField
                                    required={true}
                                    id="type"
                                    name="type"
                                    label="Тип"
                                    fullWidth={true}
                                    autoComplete="type-name"
                                    select={true}
                                    value={type}
                                    onChange={event => this.handleChange(event, 'type')}
                                    helperText={this.state.formErrors.type}
                                    error={this.state.formErrors.type.length > 0}
                                >
                                    {types.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <TextField required={true}
                                           id="sex" name="sex" label="Стать" fullWidth={true}
                                           autoComplete="sex-name" select={true} value={sex}
                                           helperText={this.state.formErrors.sex}
                                           error={this.state.formErrors.sex.length > 0}
                                >
                                    {sexes.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <TextField
                                    required={true}
                                    id="price"
                                    name="price"
                                    label="Ціна"
                                    fullWidth={true}
                                    autoComplete="shipping postal-code"
                                    value={price}
                                    onChange={event => this.handleChange(event, 'price')}
                                    helperText={this.state.formErrors.price}
                                    error={this.state.formErrors.price.length > 0}
                                />
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <TextField
                                    required={false}
                                    disabled={true}
                                    id="price_vat"
                                    name="price_vat"
                                    label="ціна з пдв"
                                    fullWidth={true}
                                    autoComplete="price_vat-name"
                                    value={(price * 1.2).toFixed(2)}
                                    helperText={this.state.formErrors.price}
                                    error={this.state.formErrors.price.length > 0}
                                />
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<DeleteIcon />}
                                    className={this.props.classes.button}
                                >
                                    Зберегти
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<DeleteIcon />}
                                    className={this.props.classes.button}
                                >
                                    Видалити
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="success">
                            This is a success message!
                        </Alert>
                    </Snackbar>
                </React.Fragment>
            </Paper>
        }
        return <div>Loading...</div>;
    }


    protected handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, label: keyof ShoeInterface) => {
        const newState: ShoeInterface | {} = this.state.good;

        const {name, value} = event.target;
        if (label === "images") {
            newState[label] = value.split(",");
            console.log(newState[label]);
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
        if(!this.state.formValid){
            alert('Виправте помилки');
            this.setState({showAlert: true});
            return;
        }
        alert('Зміни збереженні');
        console.log(this.state.good);
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
    }
}

const mapStateToProps = ({goods}: { goods: ShoeInterface }) => ({good: goods});

export default connect(mapStateToProps, {fetchGoodByID})(withStyles(styles)(AddressForm));