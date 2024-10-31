import React from "react";
import { useSelector } from "react-redux";
import { selectCollections } from "../../redux/shop/shop.selector";

import "./collections-overview.styles.scss";

import CollectionPreview from '../collection-preview/collection-preview.component';

const CollectionsOverview = () => {
  
  const collections = useSelector(selectCollections);

  return (
    <div className="collections-overview">
      {Object.values(collections).map(({ id, ...otherCollectionProps }) => (
        <CollectionPreview key={id} {...otherCollectionProps} />
      ))}
    </div>
  );
};

export default CollectionsOverview;
