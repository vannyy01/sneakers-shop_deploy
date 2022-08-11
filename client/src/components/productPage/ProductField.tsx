import React from 'react';

const ProductField: React.FC<{label: string; value: string}> = ({label, value}) => {
    return (
        <div className="col-12" style={{margin: "10px 0"}}>
                            <span className="d-inline-block"
                                  style={{minWidth: 110, fontWeight: 700}}>{label}:</span> {value}
        </div>
    );
}

export default ProductField;