import * as React from "react";
import {ReactElement} from "react";
import {ActionMeta, components, OptionProps} from "react-select";
import CreatableSelect from "react-select/creatable";
import {ItemDataType} from "../types";
import IconButton from "@material-ui/core/IconButton";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import Placeholder from "./Placeholder";

interface SelectProps {
    required: boolean,
    isLoading: boolean,
    name: string,
    optionValue: string,
    options: ItemDataType[],
    errorMessage: string,
    showDeleteOptionDialog: (event: React.MouseEvent<HTMLButtonElement>, optionName: string) => void,
    changeList: (newValue: ItemDataType, actionMeta: ActionMeta<ItemDataType>) => void,
    createOption: (inputValue: string) => void,
}

const EditableSelect: React.FC<SelectProps> = ({
                                                   required,
                                                   isLoading,
                                                   name,
                                                   optionValue,
                                                   options,
                                                   errorMessage,
                                                   showDeleteOptionDialog,
                                                   changeList,
                                                   createOption
                                               }): ReactElement<SelectProps> => {

    const Option: React.FC<OptionProps<ItemDataType>> = (props) => {
        return <components.Option {...props} className="d-flex justify-content-between">
            <span>{props.label}</span>
            {!props.data.__isNew__ &&
                <IconButton size="small" onClick={(event) => showDeleteOptionDialog(event, props.label)}>
                    <CloseRoundedIcon fontSize="small"/>
                </IconButton>
            }
        </components.Option>;
    };

    return (
        <>
            <CreatableSelect
                key={name}
                aria-required={required}
                closeMenuOnSelect={true}
                isClearable={true}
                isDisabled={isLoading}
                isLoading={isLoading}
                name={name}
                components={{Option, Placeholder}}
                placeholder="Бренд"
                onChange={changeList}
                onCreateOption={createOption}
                formatCreateLabel={(inputValue) => `Додати "${inputValue}"`}
                styles={{
                    container: (base) => ({
                        ...base,
                        width: '50%',
                        margin: '5px 5px 5px 50px',
                        minHeight: '45px'
                    }),
                    control: (base) => ({
                        ...base,
                        minHeight: '45px'
                    })
                }}
                options={options}
                value={{label: optionValue, value: optionValue}}
                aria-errormessage={errorMessage}
            />
            {errorMessage.length > 0 &&
                <p style={{
                    color: '#f44336',
                    margin: '3px 5px 5px 50px',
                    fontSize: '0.75rem',
                    textAlign: 'left',
                    fontFamily: "Helvetica",
                    fontWeight: 400,
                    lineHeight: 1.66,
                    letterSpacing: '0.03333em'
                }}
                   id={`${name}-select-helper-text`}>{errorMessage}</p>}
        </>
    )
};

export default EditableSelect;