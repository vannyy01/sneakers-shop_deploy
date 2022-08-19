import React, {useState} from "react";
import {
    Avatar,
    Button, Container,
    CssBaseline,
    Grid, Link,
    makeStyles,
    TextField,
    Typography, withStyles
} from "@material-ui/core";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {KeyboardDatePicker} from '@material-ui/pickers';
import MenuItem from "@material-ui/core/MenuItem";
import {MuiTelInput} from "mui-tel-input";
import Scrollbars from "react-custom-scrollbars-2";
import {escape} from "lodash";
import useAsyncValidationHook from "./useAsyncValidationHook";
import {useDispatch} from "react-redux";
import {createUserByEmail} from "../../actions";
import {UserInterface} from "../../actions/types";

const CssTextField = withStyles((theme) => ({
    root: {
        [theme.breakpoints.up('md')]: {
            maxWidth: "49.5%",
        },
        '& label.Mui-focused': {
            color: 'var(--primary-color)',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'var(--primary-color)',
        },
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: 'var(--primary-color)',
            },
        },
    },
}))(TextField);

const CssPhoneInput = withStyles((theme) => ({
    root: {
        [theme.breakpoints.up('md')]: {
            maxWidth: "49.5%",
        },
        '& label.Mui-focused': {
            color: 'var(--primary-color)',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'var(--primary-color)',
        },
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: 'var(--primary-color)',
            },
        },
    },
}))(MuiTelInput);

const CssDatePicker = withStyles((theme) => ({
    root: {
        [theme.breakpoints.up('md')]: {
            maxWidth: "49.5%",
        },
        '& label.Mui-focused': {
            color: 'var(--primary-color)',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'var(--primary-color)',
        },
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: 'var(--primary-color)',
            },
        },
    },
}))(KeyboardDatePicker);

const useStyles = makeStyles((theme) => ({
    container: {
        height: "90%",
        maxWidth: "900px",
        borderRadius: 15,
        backgroundColor: "#fff",
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    scrollbar: {
        height: "50vh !important",
        width: "inherit !important",
        [theme.breakpoints.down('sm')]: {
            height: "55vh !important",
        }
    },
    notchedOutline: {
        "&:focus": {
            borderColor: "yellow !important"
        }
    },
    submit: {
        backgroundColor: "var(--primary-color)",
        height: "3.5em",
        margin: theme.spacing(1, 0, 2),
        "&:hover": {
            backgroundColor: "var(--primary)"
        }
    },
    actions: {
        [theme.breakpoints.down('sm')]: {
            margin: "0 !important",
            padding: "0 !important"
        },
    }
}));

export interface UserCredentialsType {
    email: string,
    givenName: string,
    familyName: string,
    secondName: string,
    sex: string,
    phone: string,
    password: string,
    repeatPassword: string
}

const SingUpWindow: React.FC<{ onSignUpCallback: () => void, goSingIn: (event: React.MouseEvent) => void, onClose: (event: React.MouseEvent) => void }> = ({onSignUpCallback, goSingIn, onClose}) => {
    const [credentials, setCredentials] = useState<UserCredentialsType>({
        sex: '',
        email: '',
        givenName: '',
        familyName: '',
        secondName: '',
        password: '',
        repeatPassword: '',
        phone: ''
    });
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();
    const [birthday, setBirthday] = useState<Date | null>(
        null
    );
    const {formErrors, validateField, validateForm} = useAsyncValidationHook({credentials});
    const dispatch = useDispatch();
    const classes = useStyles();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        console.log({formValid: validateForm(), formErrors});
        if (!validateForm()) {
            alert("Перевірте правильність введених даних.");
            return;
        }
        const userCredentials: Omit<UserInterface, "_id" | "role"> = {
            email: escape(credentials.email.trim()),
            password: escape(credentials.password.trim()),
            givenName: escape(credentials.givenName.trim()),
            familyName: escape(credentials.familyName.trim()),
            secondName: escape(credentials.secondName.trim()),
            sex: credentials.sex,
            phone: escape(credentials.phone.trim()),
            birthday,
        };
        // authorize
        console.log(userCredentials);
        dispatch(createUserByEmail(userCredentials, onSignUpCallback));
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
            setTypingTimeout(undefined);
        }
        const {name, value} = event.target;
        setCredentials((prevState) => ({...prevState, [name]: value}));

        setTypingTimeout(setTimeout(() => {
            validateField(name, value);
        }, 400));
    };

    const handleChangePhoneNumber = (newValue: string): void => {
        const PHONE_LENGTH = 13;
        const trimmedValue = newValue.replace(/ /g, '');
        const correctInput = trimmedValue.length <= PHONE_LENGTH && trimmedValue.includes('+380');
        correctInput
        && setCredentials((prevState) => ({
            ...prevState,
            phone: trimmedValue
        }));
        validateField("phone", newValue);
    }

    return (
        <Container className={classes.container + " align-items-center col-12 col-lg-6"}
                   component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Реєстрація
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Scrollbars className={classes.scrollbar}>
                        <div className="d-flex flex-wrap flex-column flex-md-row justify-content-between">
                            <CssTextField
                                className="col-12 mw-100"
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                onChange={handleChange}
                                name="email"
                                autoComplete="email"
                                autoFocus={true}
                                helperText={formErrors.email}
                                error={formErrors.email.length > 0}
                            />
                            <CssTextField
                                className="col-12 col-lg-6"
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="givenName"
                                label="Ім'я"
                                onChange={handleChange}
                                name="givenName"
                                autoComplete="givenName"
                                autoFocus={true}
                                helperText={formErrors.givenName}
                                error={formErrors.givenName.length > 0}
                            />
                            <CssTextField
                                className="col-12 col-lg-6"
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="familyName"
                                label="Прізвище"
                                onChange={handleChange}
                                name="familyName"
                                autoComplete="familyName"
                                autoFocus={true}
                                helperText={formErrors.familyName}
                                error={formErrors.familyName.length > 0}
                            />
                            <CssTextField
                                className="col-12 col-lg-6"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="secondName"
                                label="По-батькові"
                                onChange={handleChange}
                                name="secondName"
                                autoComplete="secondName"
                                autoFocus={true}
                                helperText={formErrors.secondName}
                                error={formErrors.secondName.length > 0}
                            />
                            <CssTextField
                                className="col-12 col-lg-6"
                                variant="outlined"
                                margin="normal"
                                id="sex"
                                name="sex"
                                label="Стать"
                                autoComplete="sex-name"
                                select={true}
                                fullWidth={true}
                                value={credentials.sex}
                                helperText={formErrors.sex}
                                error={formErrors.sex.length > 0}
                                onChange={handleChange}
                            >
                                <MenuItem value="male">
                                    Чоловіча
                                </MenuItem>
                                <MenuItem value="female">
                                    Жіноча
                                </MenuItem>
                            </CssTextField>
                            <CssDatePicker
                                className="col-12 col-lg-6"
                                margin="normal"
                                inputVariant="outlined"
                                id="date-picker-dialog"
                                label="Дата народження"
                                format="dd/MM/yyyy"
                                value={birthday}
                                onChange={setBirthday}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                fullWidth={true}
                            />
                            <CssPhoneInput
                                className="col-12 col-lg-6"
                                margin="normal"
                                required
                                id="phone"
                                name="phone"
                                label="Тел.номер"
                                autoComplete="phone-number"
                                value={credentials.phone}
                                onChange={handleChangePhoneNumber}
                                defaultCountry="UA"
                                fullWidth
                                disableDropdown
                                helperText={formErrors.phone}
                                error={formErrors.phone.length > 0}
                            />
                            <CssTextField
                                className="col-12 col-lg-6"
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Пароль"
                                onChange={handleChange}
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                helperText={formErrors.password}
                                error={formErrors.password.length > 0}
                            />
                            <CssTextField
                                className="col-12 col-lg-6"
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="repeatPassword"
                                label="Повторити пароль"
                                onChange={handleChange}
                                type="password"
                                id="repeat-password"
                                autoComplete="repeat-password"
                                helperText={formErrors.repeatPassword}
                                error={formErrors.repeatPassword.length > 0}
                            />
                        </div>
                    </Scrollbars>
                    <div className={"row col-12 justify-content-center " + classes.actions}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={"col-12 col-md-8 " + classes.submit}
                        >
                            Зареєструватись
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" onClick={goSingIn} variant="body2">
                                    Увійти
                                </Link>
                            </Grid>
                            <Grid item xs>
                                <Link href="#" onClick={onClose} variant="body2">
                                    Скасувати
                                </Link>
                            </Grid>
                        </Grid>
                    </div>
                </form>
            </div>
        </Container>
    );
}

export default SingUpWindow;