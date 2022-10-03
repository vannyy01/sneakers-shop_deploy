import React, {useEffect, useState} from "react";
import {
    Avatar,
    Button, Checkbox,
    Container,
    CssBaseline,
    FormControlLabel, Grid, Link,
    makeStyles,
    TextField,
    Typography, withStyles
} from "@material-ui/core";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {escape} from "lodash";
import {fetchUser, loginByEmail} from "../../actions";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {validateEmail} from "../../actions/validation";
import GoogleButton from "react-google-button";

const CssTextField = withStyles({
    root: {
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
})(TextField);

const CssCheckbox = withStyles({
    root: {
        color: 'var(--primary-color)',
        "&$checked": {
            color: 'var(--primary-color)',
        },
    },
    checked: {}
})(Checkbox);

const useStyles = makeStyles((theme) => ({
    container: {
        height: "60%",
        borderRadius: 15,
        backgroundColor: "#fff",
    },
    paper: {
        marginTop: theme.spacing(5),
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
    notchedOutline: {
        "&:focus": {
            borderColor: "yellow !important"
        }
    },
    submit: {
        backgroundColor: "var(--primary-color)",
        height: "3.5em",
        marginBottom: theme.spacing(1),
        "&:hover": {
            backgroundColor: "var(--primary)"
        }
    },
    googleSubmit: {
        height: "3.5em",
        width: "100% !important",
        margin: theme.spacing(1, 0, 2),
    }
}));

const SignInWindow: React.FC<{ goSingUp: (event: React.MouseEvent) => void, onClose: (event?: React.MouseEvent) => void }> = ({
                                                                                                                                  goSingUp,
                                                                                                                                  onClose
                                                                                                                              }) => {
    const [isValid, setIsValid] = useState({login: true, password: true});
    const [formValid, setFormValid] = useState(false);
    const [formErrors, setFormErrors] = useState({login: '', password: ''});
    const [credentials, setCredentials] = useState({login: '', password: ''});
    const dispatch = useDispatch();
    const getSelector = ({auth: {error}}: { auth: { error: { message: string, ERROR: string } } }): { message: string, ERROR: string } => error;
    const authError = useSelector(getSelector, shallowEqual);
    const classes = useStyles();

    useEffect(() => {
        authError && setFormErrors(prevFormErrors => {
            if (authError.ERROR === "USER_NOT_FOUND") {
                return {...prevFormErrors, login: "Користувача не знайдено."}
            }
            if (authError.ERROR === "WRONG_PASSWORD") {
                return {...prevFormErrors, password: "Неправильний пароль."}
            }
            return prevFormErrors;
        });
        validateForm();
    }, [authError]);

    const validateField = (fieldName: string, value: any): void => {
        const fieldValidationErrors = formErrors;
        const localIsValid = isValid;
        switch (fieldName) {
            case 'login':
                if (!validateEmail(value)) {
                    fieldValidationErrors.login = 'неправильний email';
                    localIsValid.login = false;
                    break;
                }
                fieldValidationErrors.login = '';
                localIsValid.login = true;
                break;
            case 'password':
                if (value.length < 8) {
                    fieldValidationErrors.password = 'закороткий пароль';
                    localIsValid.password = false;
                    break;
                }
                fieldValidationErrors.password = '';
                localIsValid.password = true;
                break;
            default:
                break;
        }
        setFormErrors(fieldValidationErrors);
        setIsValid(localIsValid);
        validateForm();
    };

    const validateForm = (): void => {
        let valid = true;
        for (const key in isValid) {
            if (!isValid[key]) {
                valid = false;
                break;
            }
        }
        setFormValid(valid);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (!formValid) {
            alert("Неправильний логін або пароль.");
            return;
        }
        const userCredentials = {
            email: escape(credentials.login.trim()),
            password: escape(credentials.password.trim()),
        };
        // authorize
        console.log(userCredentials);
        dispatch(loginByEmail(userCredentials, () => {
                dispatch(fetchUser());
                onClose();
            })
        );
    };

    const submitByGoogle = (): void => {
        window.location.replace("/auth/google");
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const {name, value} = event.target;
        setCredentials((prevState) => ({...prevState, [name]: value}));
        validateField(name, value);
    };

    return (
        <Container className={classes.container + " align-items-center col-12 col-lg-6"}
                   component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Вхід
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit} noValidate>
                    <CssTextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="login"
                        label="Email чи логін"
                        onChange={handleChange}
                        name="login"
                        autoComplete="login"
                        autoFocus={true}
                        helperText={formErrors.login}
                        error={formErrors.login.length > 0}
                    />
                    <CssTextField
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
                    <FormControlLabel
                        control={<CssCheckbox value="remember"/>}
                        label="Запам'ятати мене"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Увійти
                    </Button>
                    <GoogleButton
                        className={classes.googleSubmit}
                        type="light"
                        label="Увійти через Google"
                        onClick={submitByGoogle}
                    />
                    <Grid container direction="row" justifyContent="space-around">
                        <Grid container xs item direction="column">
                            <Link href="#" onClick={onClose} variant="body2">
                                Скасувати
                            </Link>
                        </Grid>
                        <Grid container xs justifyContent="flex-end">
                            <Link href="#" onClick={goSingUp} variant="body2" style={{textAlign: "end"}}>
                                Новий клієнт? Реєстрація
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}

export default SignInWindow;