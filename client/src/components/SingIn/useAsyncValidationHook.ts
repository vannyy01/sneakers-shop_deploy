import {checkPassword, validateEmail} from "../../actions/validation";
import {checkUserEmail} from "../../actions";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {UserCredentialsType} from "./SingUpWindow";
import {isValidPhoneNumber} from "mui-tel-input";

const useAsyncValidationHook = ({credentials}: { credentials: UserCredentialsType }) => {
    const initialIsValid = {
        email: true,
        phone: true,
        givenName: true,
        familyName: true,
        password: true,
        repeatPassword: true
    };
    const initialFormErrors = {
        email: '', phone: '', sex: '', givenName: '', familyName: '', secondName: '', password: '', repeatPassword: ''
    };
    const [isValid, setIsValid] = useState({...initialIsValid});
    const [formValid, setFormValid] = useState(false);
    const [formErrors, setFormErrors] = useState<UserCredentialsType>({...initialFormErrors});
    const dispatch = useDispatch();
    const getSelector = ({users: {emailStatus}}: { users: { emailStatus: boolean } }): boolean => emailStatus;
    const status = useSelector(getSelector, shallowEqual);

    useEffect(() => {
        if (status) {
            setFormErrors(prevState => ({...prevState, email: 'Користувача з такою ел.поштою вже зареєстровано.'}));
            setIsValid(prevState => ({...prevState, email: false}))
        } else {
            setFormErrors(prevState => ({...prevState, email: ''}));
            setIsValid(prevState => ({...prevState, email: true}))
        }
    }, [status]);

    const validateForm = (): boolean => {
        let valid = true;
        for (const key in isValid) {
            if (!isValid[key]) {
                valid = false;
                break;
            }
        }
        setFormValid(valid);
        return valid;
    };

    const validateField = (fieldName: string, value: any): void => {
        const fieldValidationErrors = {...formErrors};
        const localIsValid = {...isValid};
        const wrongPasswordText = 'Неправильний пароль. Пароль має містити від 8 до 20 символів, які містять щонайменше одну цифру та по одній літері у верхньому ти нижньому регістрах.';
        switch (fieldName) {
            case 'email':
                // if (value === '') {
                //     fieldValidationErrors.email = '';
                //     localIsValid.email = true;
                //     break;
                // }
                if (!validateEmail(value)) {
                    fieldValidationErrors.email = 'неправильна пошта';
                    localIsValid.email = false;
                    break;
                }
                if (value.length < 5) {
                    fieldValidationErrors.email = 'занадто коротка пошта';
                    localIsValid.email = false;
                    break;
                }
                dispatch(checkUserEmail(value));
                break;
            case 'phone':
                if (!isValidPhoneNumber(value, "UA")) {
                    fieldValidationErrors.phone = 'неправильний телефонний номер';
                    localIsValid.phone = false;
                    break;
                }
                fieldValidationErrors.phone = '';
                localIsValid.phone = true;
                break;
            case 'password':
                if (!checkPassword(value)) {
                    fieldValidationErrors.password = wrongPasswordText;
                    localIsValid.password = false;
                    break;
                }
                fieldValidationErrors.password = '';
                localIsValid.password = true;
                break;
            case "repeatPassword":
                if (value !== credentials.password) {
                    fieldValidationErrors.repeatPassword = 'Паролі не співпадають';
                    localIsValid.repeatPassword = false;
                    break;
                }
                fieldValidationErrors.repeatPassword = '';
                localIsValid.repeatPassword = true;
                break;
            default:
                break;
        }
        setFormErrors(() => fieldValidationErrors);
        setIsValid(() => localIsValid);
    };

    return {formValid, formErrors, validateField, validateForm};
};

export default useAsyncValidationHook;