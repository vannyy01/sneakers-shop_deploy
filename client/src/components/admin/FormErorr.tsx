import * as React from 'react';

export const FormErrors = ({formErrors}: {
    formErrors: { title: string, brand: string, description: string, mainImage: string, images: string, type: string, sex: string, price: string },
}) =>
    <div className='formErrors'>
        {Object.keys(formErrors).map((fieldName, i) => {
            if (formErrors[fieldName].length > 0) {
                return (
                    <p key={i}>{fieldName} {formErrors[fieldName]}</p>
                )
            } else {
                return '';
            }
        })}
    </div>;