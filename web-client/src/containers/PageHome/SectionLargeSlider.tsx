import HandleApi from 'api/HandleApi';
import CardLarge1 from 'components/CardLarge1/CardLarge1';
import { FC, useEffect, useState } from 'react';

export interface SectionLargeSliderProps {
  className?: string;
}

const SectionLargeSlider: FC<SectionLargeSliderProps> = ({
  className = '',
}) => {
  // here

  const [indexActive, setIndexActive] = useState(0);
  const [products, setProducts] = useState<any>([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    const data = await HandleApi.APIGet('product/topExpensive');
    setProducts(data);
  };

  const handleClickNext = () => {
    setIndexActive((state) => {
      if (state >= products?.length - 1) {
        return 0;
      }
      return state + 1;
    });
  };

  const handleClickPrev = () => {
    setIndexActive((state) => {
      if (state <= products?.length - 1) {
        return products?.length - 2;
      }
      return state - 1;
    });
  };

  return (
    <div className={`nc-SectionLargeSlider relative ${className}`}>
      {Array.isArray(products) &&
        products?.map((item: any, index: number) =>
          indexActive === index ? (
            <CardLarge1
              key={index}
              isShowing
              featuredImgUrl={item?.uri}
              nameNft={item?.name}
              price={item?.price}
              creator={item?.user?.name}
              category={item?.category?.name}
              categoryImg={item?.category?.icon}
              creatorImg={item?.user?.avatar}
              id={item?.id}
              onClickNext={handleClickNext}
              onClickPrev={handleClickPrev}
            />
          ) : null
        )}
    </div>
  );
};

export default SectionLargeSlider;
