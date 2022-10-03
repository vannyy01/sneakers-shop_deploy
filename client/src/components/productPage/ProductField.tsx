import React from 'react';

const ProductField: React.FC<{label: string; value: string, size?: "col-12" | "col-6" | "col-4" | "col-3" | "col"}> = ({label, value, size = "col-12"}) => {
    
    return (
        <div className={size} style={{margin: "10px 0"}}>
                            <span className="d-inline-block"
                                  style={{minWidth: 110, fontWeight: 700}}>{label}:</span> {value}
        </div>
    );
}

export default ProductField;