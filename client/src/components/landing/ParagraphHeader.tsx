import * as React from 'react';

interface ParagraphHeaderProps {
    title?: string,
    color?: string,
}

const ParagraphHeader = (props: ParagraphHeaderProps) => (
    <div className="col-12">
        <div className="section-heading text-center">
            <h2>{props.title}</h2>
            <div style={{backgroundColor: props.color}} className="line-shape"/>
        </div>
    </div>
);

export default ParagraphHeader;