import HandleApi from 'api/HandleApi';
import CardNFT from 'components/CardNFT';
import HeaderFilterSection from 'components/HeaderFilterSection';
import { FC, useEffect, useState } from 'react';

//
export interface SectionGridFeatureNFTProps {}

const SectionGridFeatureNFT: FC<SectionGridFeatureNFTProps> = () => {
  const [products, setProducts] = useState<any>([]);
  const [filter, setFilter] = useState<any>(' ');

  useEffect(() => {
    getProducts(filter);
  }, [filter]);

  const getProducts = async (filter: any) => {
    const data = await HandleApi.APIGet(`product?limit=8&categoryId=${filter}`);
    setProducts(data);
  };
  return (
    <div className="nc-SectionGridFeatureNFT relative">
      <HeaderFilterSection setFilter={setFilter} />
      <div
        className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 `}
      >
        {products?.map((item: any, index: any) => (
          <CardNFT key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default SectionGridFeatureNFT;
