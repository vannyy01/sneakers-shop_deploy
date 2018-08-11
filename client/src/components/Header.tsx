import * as React from 'react';

interface HeaderProps {
    styles?: object,
    title: string,
    description?: string
}

const Header = (props: HeaderProps) => (
    <div className="jumbotron p-3 p-md-5 text-white rounded d-flex justify-content-center" style={props.styles}>
        <div className="col-md-6 px-0 text-center" style={{marginTop: 100}}>
            <h1 className="display-4" style={{fontWeight: 420}}>{props.title}</h1>
            <p className="lead my-3">{props.description}</p>
        </div>
    </div>
);

export default Header;