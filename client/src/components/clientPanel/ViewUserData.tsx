import React from 'react'
import { Link } from 'react-router-dom';
import { UserInterface } from 'src/actions/types';
import Button from '../button';
import { useLinkStyles } from '../commonStyles';
import ProductField from '../productPage/ProductField'

const ViewUserData: React.FC<{ client: UserInterface }> = ({ client }) => {
    const linkStyles = useLinkStyles();

    return (
        <div className="d-flex flex-column justify-content-around" >
            <ProductField size="col" label="Ім'я" value={client.givenName} />
            <ProductField size="col" label="По-батькові" value={client.secondName} />
            <ProductField size="col" label="Прізвище" value={client.familyName} />
            <ProductField size="col" label="Стать" value={client.sex === 'male' ? 'чоловіча' : 'жіноча'} />
            <ProductField size="col" label="Дата народження" value={client.birthday?.toDateString()} />
            <ProductField size="col" label="Email" value={client.email} />
            <ProductField size="col" label="Тел.номер" value={client.phone} />
            <Link to={`/client/${client._id}/user_data/edit`} className={linkStyles.link}> 
                <Button text="Змінити данні" />
            </Link>
        </div>
    )
}

export default ViewUserData;
