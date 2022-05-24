import {RouteComponentProps} from "react-router-dom";
import {UserInterface} from "../../../actions/types";
import * as React from "react";
import {validateEmail} from "../../../actions/validation";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import ArrowBack from "@material-ui/icons/ArrowBackIos";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import {Alert, PaperComponent} from "../goods/BaseGood";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Snackbar from "@material-ui/core/Snackbar";
import {ItemDataType} from "../../types";

export const roles:ItemDataType[] = [
    {
        label: 'заблокований',
        value: 0,
    },
    {
        label: 'клієнт',
        value: 10,
    },
    {
        label: 'адміністратор',
        value: 20,
    }
];

interface PathParams {
    userID: string
}

export interface PropsTypeUser extends RouteComponentProps<PathParams> {
    classes: { alert: string, button: string, paper: string },
}

export interface StateTypeUser {
    showAlert: boolean,
    showDialog: boolean,
    showDeleteDialog: boolean,
    formErrors: { givenName: string, familyName: string, email: string, photo: string, role: string },
    formValid: boolean
    user: UserInterface,
    isValid: { givenNameValid: boolean, familyNameValid: boolean, emailValid: boolean, photoValid: boolean, roleValid: boolean },
}

export abstract class BaseUser<P extends PropsTypeUser, S extends StateTypeUser> extends React.Component<P, S> {

    protected defaultState = (): StateTypeUser => ({
        showAlert: false,
        showDialog: false,
        showDeleteDialog: false,
        isValid: {
            givenNameValid: true, familyNameValid: true, emailValid: true, photoValid: true, roleValid: true
        },
        formErrors: {
            givenName: '', familyName: '', email: '', photo: '', role: ''
        },
        formValid: false,
        user: {
            _id: '',
            givenName: '',
            familyName: '',
            email: '',
            photo: '',
            role: 10
        }
    });


    protected baseRender = (operation: 'Створення' | 'Оновлення' | 'Видалення', {deleteButton}:
        { deleteButton: { renderDialog?: boolean, disabled?: boolean } } = {
        deleteButton: {
            renderDialog: false,
            disabled: false
        }
    }) => {
        const {email, role, givenName, familyName, photo} = this.state.user;
        return <React.Fragment>
            <Typography variant="h6" gutterBottom={true}>
                {operation}
            </Typography>
            <form noValidate={true} onSubmit={event => this.handleSubmit(event)}>
                <Grid container={true} spacing={3}>
                    <Grid item={true} xs={12} sm={6}>
                        <TextField
                            required={true}
                            id="givenName"
                            name="givenName"
                            label="Ім'я"
                            fullWidth={true}
                            autoComplete="givenName-name"
                            value={givenName}
                            onChange={event => this.handleChange(event)}
                            helperText={this.state.formErrors.givenName}
                            error={this.state.formErrors.givenName.length > 0}
                        />
                    </Grid>
                    <Grid item={true} xs={12} sm={6}>
                        <TextField
                            required={true}
                            id="familyName"
                            name="familyName"
                            label="Прізвище"
                            fullWidth={true}
                            autoComplete="familyName-name"
                            value={familyName}
                            onChange={event => this.handleChange(event)}
                            helperText={this.state.formErrors.familyName}
                            error={this.state.formErrors.familyName.length > 0}
                        />
                    </Grid>
                    <Grid item={true} xs={12} sm={6}>
                        <TextField
                            required={true}
                            id="email"
                            name="email"
                            label="Електронна пошта"
                            fullWidth={true}
                            autoComplete="email-name"
                            value={email}
                            onChange={event => this.handleChange(event)}
                            helperText={this.state.formErrors.email}
                            error={this.state.formErrors.email.length > 0}
                        />
                    </Grid>
                    <Grid item={true} xs={12} sm={6}>
                        <TextField
                            required={true}
                            id="role"
                            name="role"
                            label="Роль"
                            fullWidth={true}
                            autoComplete="role-name"
                            select={true}
                            value={role}
                            onChange={event => this.handleChange(event)}
                            helperText={this.state.formErrors.role}
                            error={this.state.formErrors.role.length > 0}
                        >
                            {roles.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item={true} xs={12}>
                        <TextField
                            required={true}
                            id="photo"
                            name="photo"
                            label="Аватар(фото)"
                            multiline={true}
                            fullWidth={true}
                            autoComplete="photo-name"
                            value={photo}
                            onChange={event => this.handleChange(event)}
                            helperText={this.state.formErrors.photo}
                            error={this.state.formErrors.photo.length > 0}
                        />
                    </Grid>
                    <Grid item={true} xs={12}>
                        <Button
                            variant="contained"
                            color="inherit"
                            style={{backgroundColor: "#1fbd3a", color: "#fff"}}
                            startIcon={<ArrowBack/>}
                            className={this.props.classes.button}
                            onClick={event => this.handleComeBack()}
                        >
                            Повернутися назад
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            startIcon={<DeleteIcon/>}
                            className={this.props.classes.button}
                        >
                            Зберегти
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<DeleteIcon/>}
                            className={this.props.classes.button}
                            disabled={deleteButton.disabled}
                            onClick={event => this.showDeleteDialog()}
                        >
                            Видалити
                        </Button>
                    </Grid>
                </Grid>
            </form>
            {deleteButton.renderDialog && <Dialog
                open={this.state.showDeleteDialog}
                onClose={event => this.handleClose("cancel")}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                    Видалити користувача
                </DialogTitle>
                <DialogActions>
                    <Button autoFocus={true} name="cancel" onClick={event => this.handleClose("cancel")}
                            color="primary">
                        Відміна
                    </Button>
                    <Button name="save" onClick={event => this.handleDelete()} color="primary">
                        Видалити користувача
                    </Button>
                </DialogActions>
            </Dialog>}
            <Dialog
                open={this.state.showDialog}
                onClose={event => this.handleClose("cancel")}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                    {operation === 'Створення' ? 'Створити користувача' : 'Оновити користувача'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {operation === 'Створення' ? 'Щоб створити користувача, натисність "Свторити"'
                            : 'Щоб оноваити користувача, натисність "Зберегти зміни"'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus={true} name="cancel" onClick={event => this.handleClose("cancel")}
                            color="primary">
                        Відміна
                    </Button>
                    <Button name="save" onClick={event => this.handleSave()} color="primary">
                        {operation === 'Створення' ? 'Створити' : 'Оновити користувача'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={this.state.showAlert}
                      autoHideDuration={6000} className={this.props.classes.alert}
                      onClose={event => this.handleClose("alert")}>
                <Alert onClose={event => this.handleClose("alert")} severity="error">Виправте помилки!</Alert>
            </Snackbar>
        </React.Fragment>
    };
    protected handleComeBack = (): void => {
        this.props.history.goBack();
    };

    protected handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newState: UserInterface = this.state.user;
        const {name, value} = event.target;
        newState[name] = value;
        this.setState({user: newState}, () => {
            this.validateField(name, newState[name]);
        });
    };
    protected handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (!this.state.formValid) {
            this.setState({showAlert: true});
            return;
        }
        const {email, googleID, _id, role, givenName, familyName, photo} = this.state.user;
        const user = {
            _id,
            googleID,
            email: email.trim(),
            givenName: givenName.trim(),
            familyName: familyName.trim(),
            photo: photo.trim(),
            role
        };
        this.setState({showDialog: true, user});
    };
    protected handleClose = (name: "cancel" | "alert" | "save"): void => {
        switch (name) {
            case "cancel":
                this.setState({showDialog: false, showDeleteDialog: false});
                break;
            case "alert":
                this.setState({showAlert: false});
                break;
            default:
                alert('Збережено');
                console.log(this.state.user);
                break;
        }
    };
    protected validateField = (fieldName: string, value: any): void => {
        const fieldValidationErrors = this.state.formErrors;
        const {isValid} = this.state;
        switch (fieldName) {
            case 'email':
                if (typeof value !== 'string') {
                    fieldValidationErrors.email = 'некоректний текст';
                    isValid.emailValid = false;
                    break;
                }
                if (value.length < 2) {
                    fieldValidationErrors.email = 'занадто коротка пошта';
                    isValid.emailValid = false;
                    break;
                }
                if (!validateEmail(value)) {
                    fieldValidationErrors.email = 'неправильна пошта';
                    isValid.emailValid = false;
                    break;
                }
                fieldValidationErrors.email = '';
                isValid.emailValid = true;
                break;
            case 'givenName':
                if (typeof value !== 'string') {
                    fieldValidationErrors.givenName = 'некоректний тип';
                    isValid.givenNameValid = false;
                }
                break;
            case 'familyName' :
                if (typeof value !== 'string') {
                    fieldValidationErrors.familyName = 'некоректний текст';
                    isValid.familyNameValid = false;
                    break;
                }
                if (value.length < 2) {
                    fieldValidationErrors.familyName = 'занадто коротка назва';
                    isValid.familyNameValid = false;
                    break;
                }
                fieldValidationErrors.familyName = '';
                isValid.familyNameValid = true;
                break;
            case 'photo':
                if (typeof value !== 'string') {
                    fieldValidationErrors.photo = 'некоректний текст';
                    isValid.photoValid = false;
                    break;
                }
                if (value.length < 6) {
                    fieldValidationErrors.photo = 'занадто короткий шлях';
                    isValid.photoValid = false;
                    break;
                }
                fieldValidationErrors.photo = '';
                isValid.photoValid = true;
                break;
            case 'role':
                if (isNaN(Number.parseInt(value))) {
                    fieldValidationErrors.role = 'некоректний тип даних';
                    isValid.roleValid = false;
                    break;
                }
                fieldValidationErrors.role = '';
                isValid.roleValid = true;
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
    protected showDeleteDialog = (): void => {
        this.setState({showDeleteDialog: true})
    };

    protected abstract handleDelete(): void;

    protected abstract handleSave(): void;
}
