import React, {ButtonHTMLAttributes} from "react";
import './button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    text: string,
    width?: string,
    height?: string
}

const Button: React.FC<ButtonProps> = ({text, width = "130", height = "inherit", ...props}) => {
    return <button className="button button-animation" style={{width, height}} {...props}>{text}</button>;
};

export default Button;