import { FC } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'shared/Avatar/Avatar';
import NcImage from 'shared/NcImage/NcImage';
import Prices from './Prices';

export interface CardNFTProps {
  className?: string;
  isLiked?: boolean;
  item?: any;
}

const CardNFT: FC<CardNFTProps> = ({ className = '', isLiked, item }) => {
  return (
    <div
      className={`nc-CardNFT relative flex flex-col group !border-0 [ nc-box-has-hover nc-dark-box-bg-has-hover ] ${className}`}
      data-nc-id="CardNFT"
    >
      <div className="relative flex-shrink-0 ">
        <div>
          <NcImage
            containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0 rounded-3xl overflow-hidden z-0"
            src={item?.uri}
            className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-300 ease-in-out will-change-transform"
          />
        </div>

        <div className="absolute top-3 inset-x-3 flex"></div>
      </div>

      <div className="p-4 py-5 space-y-3">
        <h2 className={`text-lg font-medium`}>{item?.name}</h2>

        <div className="w-2d4 w-full border-b border-neutral-100 dark:border-neutral-700"></div>

        <div className="flex justify-between items-end ">
          <Prices
            labelTextClassName="bg-white dark:bg-neutral-900 dark:group-hover:bg-neutral-800 group-hover:bg-neutral-50"
            price={item?.price}
          />
        </div>
      </div>

      <Link to={`/nft-detail/${item?.id}`} className="absolute inset-0"></Link>
    </div>
  );
};

export default CardNFT;
