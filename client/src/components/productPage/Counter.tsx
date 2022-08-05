import React from 'react';
import {IconButton, makeStyles, createStyles} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

const useStyles = makeStyles(() => createStyles({
    input: {
        maxWidth: 90,
        minHeight: 50,
        margin: "0 5px 0 5px"
    },
    button: {
        color: "#000000"
    }
}));

interface CounterPropsType {
    count: number;
    setCount: (count: number) => void;
}

const Counter: React.FC<CounterPropsType> = ({count, setCount}) => {
    const classes = useStyles();

    const handleSetCount = (event: React.ChangeEvent<HTMLInputElement>): void => {
        (+event.target.value) >= 1 && setCount(+event.target.value);
    };

    const increment = (): void => {
        count >= 1 && setCount(count + 1);
    };

    const decrement = (): void => {
        count > 1 && setCount(count - 1);
    };

    return (
        <div className={"d-flex"}>
            <IconButton className={"col-3 " + classes.button} onClick={increment}>
                <AddIcon/>
            </IconButton>
            <input className={"col-6 quantity__input " + classes.input}
                   type="number"
                   min="1" value={count}
                   onChange={handleSetCount}
            />
            <IconButton className={"col-3 " + classes.button} onClick={decrement}>
                <RemoveIcon/>
            </IconButton>
        </div>
    );
}

export default Counter;