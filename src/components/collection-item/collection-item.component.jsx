import React from "react";
import { useDispatch } from 'react-redux';

import './collection-item.styles.scss';

import CustomButton from '../custom-button/custom-button.component';

import { addItem } from '../../redux/cart/cart.reducer';

const CollectionItem = ({item}) => {

    const dispatch = useDispatch();

    return (
        <div className="collection-item">
            <div
                className="image" 
                style={{
                    backgroundImage: `url(${item.imageUrl})`
                }}
            />
            <div className="collection-footer">
                <span className="name">{item.name}</span>
                <span className="price">{item.price}</span>
            </div>
            <CustomButton onClick={() => dispatch(addItem(item))} inverted> Add to Cart </CustomButton>
        </div>
    )
};

export default CollectionItem;