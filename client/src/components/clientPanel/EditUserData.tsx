import {makeStyles, MenuItem, withStyles} from '@material-ui/core';
import {escape, isEmpty} from 'lodash';
import React, {useState} from 'react'
import {UserInterface} from 'src/actions/types';
import {CssDatePicker, CssPhoneInput, CssTextField} from '../SingIn/SingUpWindow';
import useAsyncValidationHook from './useAsyncValidationHookEditUser';
import Button from "@material-ui/core/Button";
import ArrowBack from "@material-ui/icons/ArrowBackIos";
import SaveIcon from '@material-ui/icons/Save';
import Grid from "@material-ui/core/Grid";
import {useDispatch} from "react-redux";
import {updateUserByClient} from "../../actions";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    container: {
        height: "90%",
        maxWidth: "900px",
        borderRadius: 15,
        backgroundColor: "#fff",
    },
    paper: {
        [theme.breakpoints.up('md')]: {
            maxWidth: "75%",
        },
        marginLeft: theme.spacing(2),
        maxWidth: "100%",
    }
}));

const PrimaryButton = withStyles(() => ({
    root: {
        color: "#fff",
        backgroundColor: "var(--primary-color)",
        '&:hover': {
            backgroundColor: "#007bff",
        },
    },
}))(Button);

const SecondaryButton = withStyles(() => ({
    root: {
        color: "#fff",
        backgroundColor: "#1fbd3a",
        '&:hover': {
            backgroundColor: "#28a745",
        },
    },
}))(Button);

const EditUserData: React.FC<{ client: UserInterface }> = ({client}) => {
    const [user, setUser] = useState<UserInterface>(client);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();
    const {formErrors, validateField, validateForm} = useAsyncValidationHook({user});
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (!validateForm()) {
            alert("Перевірте правильність введених даних.");
            return;
        }
        const userCredentials: Omit<UserInterface, 'role' | 'password'> = {
            _id: user._id,
            email: escape(user.email.trim()),
            givenName: escape(user.givenName.trim()),
            familyName: escape(user.familyName.trim()),
            secondName: escape(user.secondName?.trim()) || undefined,
            sex: user.sex,
            phone: escape(user.phone.trim()),
            birthday: user.birthday,
        };
        dispatch(updateUserByClient(userCredentials, () => {
            history.replace(`/client/${user._id}`)
        }));
    };

    const handleComeBack = (): void => {
        history.replace(`/client/${user._id}`)
    };

    const handleChangeBirthday = (date: Date): void => {
        setUser(prevState => ({...prevState, birthday: date}));
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
            setTypingTimeout(undefined);
        }
        const {name, value} = event.target;
        setUser((prevState) => ({...prevState, [name]: value}));

        setTypingTimeout(setTimeout(() => {
            validateField(name, value);
        }, 400));
    };

    const handleChangePhoneNumber = (newValue: string): void => {
        const PHONE_LENGTH = 13;
        const trimmedValue = newValue.replace(/ /g, '');
        const correctInput = trimmedValue.length <= PHONE_LENGTH && trimmedValue.includes('+380');
        correctInput
        && setUser((prevState) => ({
            ...prevState,
            phone: trimmedValue
        }));
        validateField("phone", newValue);
    }

    return (
        !isEmpty(user) && <div className={classes.paper}>
            <div>Зміна данних</div>
            <form onSubmit={handleSubmit}>
                <div className="d-flex flex-wrap flex-column flex-md-row justify-content-between">
                    <CssTextField
                        disabled
                        className="col-12 col-lg-6"
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        onChange={handleChange}
                        name="email"
                        autoComplete="email"
                        value={user.email}
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
                        value={user.givenName}
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
                        value={user.familyName}
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
                        value={user.secondName || ""}
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
                        value={user.sex}
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
                        value={user.birthday || null}
                        onChange={handleChangeBirthday}
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
                        value={user.phone}
                        onChange={handleChangePhoneNumber}
                        defaultCountry="UA"
                        fullWidth
                        disableDropdown
                        helperText={formErrors.phone}
                        error={formErrors.phone.length > 0}
                    />
                    <Grid container item xs={12}>
                        <SecondaryButton
                            variant="contained"
                            startIcon={<ArrowBack/>}
                            className={classes.button}
                            size="large"
                            style={{marginLeft: 0}}
                            onClick={handleComeBack}
                        >
                            Повернутися назад
                        </SecondaryButton>
                        <PrimaryButton
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon/>}
                            className={classes.button}
                            size="large"
                        >
                            Зберегти
                        </PrimaryButton>
                    </Grid>
                </div>
            </form>
        </div>
    )
}

export default EditUserData;
