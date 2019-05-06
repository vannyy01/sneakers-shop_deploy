import IconButton from "@material-ui/core/IconButton/IconButton";
import Poll from "@material-ui/icons/Poll";
import * as React from "react";

interface PollButtonI {
    onClick?: () => void,
}

const PollButton = (props: PollButtonI) => <IconButton
    onClick={props.onClick}
    color="inherit"
>
    <Poll/>
</IconButton>;

export default PollButton;