import * as React from "react";
import {components, PlaceholderProps} from "react-select";
import {ItemDataType} from "../../types";

const Placeholder: React.FC<PlaceholderProps<ItemDataType>> = (props) => {
    return <components.Placeholder {...props} children={props.children}/>;
};

export default Placeholder;