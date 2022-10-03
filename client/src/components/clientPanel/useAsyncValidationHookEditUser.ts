import {validateEmail} from "../../actions/validation";
import {checkUserEmail} from "../../actions";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {isValidPhoneNumber} from "mui-tel-input";
import { UserInterface } from "src/actions/types";

const useAsyncValidationHook = ({user}: { user: UserInterface }) => {
    const initialIsValid = {
        email: true,
        phone: true,
        givenName: true,
        secondName: true,
        familyName: true,
    };
    // TODO check useAsyncValidationHook in SingUpWindow for declaring $familyName
    const initialFormErrors: Omit<UserInterface, "_id" | "goodleID" | "password" | "role"> = {
        email: '', phone: '', sex: '', givenName: '', familyName: '', secondName: ''
    };
    const [isValid, setIsValid] = useState({...initialIsValid});
    const [formValid, setFormValid] = useState(false);
    const [formErrors, setFormErrors] = useState<Omit<UserInterface, "_id" | "goodleID" | "password" | "role">>({...initialFormErrors});
    const dispatch = useDispatch();
    const getSelector = ({users: {emailStatus}}: { users: { emailStatus: boolean } }): boolean => emailStatus;
    const emailStatus = useSelector(getSelector, shallowEqual);

    useEffect(() => {
        if (emailStatus) {
            setFormErrors(prevState => ({...prevState, email: 'Користувача з такою ел.поштою вже зареєстровано.'}));
            setIsValid(prevState => ({...prevState, email: false}))
        } else {
            setFormErrors(prevState => ({...prevState, email: ''}));
            setIsValid(prevState => ({...prevState, email: true}))
        }
    }, [emailStatus]);

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
        switch (fieldName) {
            case 'email':
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
                // For $firstName, $givenName and $familyName, checking is unnecessary 
                // because these fields can have only one character. Thus, required attribute is enabled on the TextField element.
            default:
                break;
        }
        setFormErrors(() => fieldValidationErrors);
        setIsValid(() => localIsValid);
    };

    return {formValid, formErrors, validateField, validateForm};
};

export default useAsyncValidationHook;