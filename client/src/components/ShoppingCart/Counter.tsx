import * as React from "react";

import IconButton from '@material-ui/core/IconButton';

import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';

interface CounterPropsI {
    productQuantity: number,
    updateQuantity: (t: number) => any
}

interface CounterStateI {
    value: number
}

class Counter extends React.PureComponent<CounterPropsI, CounterStateI> {
    //  protected readonly feedQty: RefObject<any>;

    constructor(props: CounterPropsI) {
        super(props);
        this.state = {value: this.props.productQuantity};
        //  this.feedQty = React.createRef();
    }

   public render() {
        return (
            <div className="stepper-input">
                <IconButton className="decrement" onClick={this.decrement}>
                    <Remove/>
                </IconButton>
                <input
                    type="number"
                    className="quantity"
                    value={this.state.value}
                    onChange={this.feed}
                />
                <IconButton className="increment" onClick={this.increment}>
                    <Add/>
                </IconButton>
            </div>
        );
    }

    protected increment = (event: any) => {
        this.setState(
            prevState => ({
                value: Number(prevState.value) + 1
            }),
            () => this.props.updateQuantity(this.state.value)
        );
        event.preventDefault();
    };

    protected decrement = (event: any) => {
        event.preventDefault();
        if (this.state.value <= 1) {
            return this.state.value;
        }
        this.setState(
            prevState => ({
                value: Number(prevState.value) - 1
            }),
            () => this.props.updateQuantity(this.state.value)
        );
        return;
    };

    protected feed = (event: React.ChangeEvent): void => {
        console.log(event);
        this.setState(
            {
                value: Number(event.target)
            },
            () => this.props.updateQuantity(this.state.value)
        );
    }
}


export default Counter;