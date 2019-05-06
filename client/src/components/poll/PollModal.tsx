import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PollWindow from './PollWindow';

const styles = {
    PositionProperty: 'fixed',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '!100%',
    left: 0,
    minHeight: '670px',
    top: 0,
    width: '100%',
    zIndex: 1111,
};

class PollModal extends React.Component<{ onClick: () => void }, any> {
    private readonly el: HTMLDivElement;
    private readonly modalRoot: HTMLElement = document.getElementById('PollModalRoot');

    constructor(props: any) {
        super(props);
        // Create a div that we'll render the modal into. Because each
        // Modal component has its own element, we can render multiple
        // modal components into the modal container.
        this.el = document.createElement('div');
    }

    public componentDidMount() {
        // Append the element into the DOM on mount. We'll render
        // into the modal container element (see the HTML tab).
        this.modalRoot.appendChild(this.el);
    }

    public componentWillUnmount() {
        // Remove the element from the DOM when we unmount
        this.modalRoot.removeChild(this.el);
    }

    public render() {
        // Use a portal to render the children into the element
        return ReactDOM.createPortal(
            // Any valid React child: JSX, strings, arrays, etc.
            this.modal(),
            // A DOM element
            this.el,
        );
    }

    protected modal = () =>
        <div className={`${styles} modal d-flex justify-content-center`}>
            <PollWindow onClick={this.props.onClick}/>
        </div>;
}

export default PollModal;