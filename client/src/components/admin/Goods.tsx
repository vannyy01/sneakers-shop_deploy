import * as React from 'react';

import {connect} from "react-redux";
import GridView from '../GridView';

import {fetchGoods} from "../../actions";

interface SizeInterface {
    sizeValue: number,
    count: number,
}

interface ShoeInterface {
    description: string,
    brand: string,
    price: number,
    _id: string,
    mainImage: string,
    images: [string],
    size: [
        SizeInterface
        ],
    type: string,
    title: string,
    sex: string
}

interface PropsInterface {
    goods: ShoeInterface[] | [],
    fetchGoods: () => (dispatch: any) => Promise<void>
}

class Goods extends React.Component<PropsInterface, any> {

    public componentDidMount() {
        this.props.fetchGoods();
    }

    public render() {
        if (this.props.goods) {
            for (const item of this.props.goods) {
                delete item.images;
                delete item.mainImage;
                delete item.size;
            }
            return <GridView idField="_id" data={this.props.goods} title="Товари"/>
        }
        return <div>Loading...</div>
    }
}

const mapStateToProps = ({goods}: any) => ({goods});

export default connect(mapStateToProps, {fetchGoods})(Goods);