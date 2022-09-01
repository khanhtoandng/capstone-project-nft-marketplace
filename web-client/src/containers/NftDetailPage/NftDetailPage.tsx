import HandleApi from 'api/HandleApi';
import BackgroundSection from 'components/BackgroundSection/BackgroundSection';
import SectionSliderCategories from 'components/SectionSliderCategories/SectionSliderCategories';
import VerifyIcon from 'components/VerifyIcon';
import { FC, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import Avatar from 'shared/Avatar/Avatar';
import ButtonPrimary from 'shared/Button/ButtonPrimary';
import NcImage from 'shared/NcImage/NcImage';
import { useAccount } from 'wagmi';
import AccordionInfo from './AccordionInfo';
import TabDetail from './TabDetail';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { nftMarketAddress } from 'config';
import NFTMarketplace from '../../eth/abi/NFTMarketplace.json';
import Input from 'shared/Input/Input';

export interface NftDetailPageProps {
  className?: string;
  isPreviewMode?: any;
  id?: string;
}

const NftDetailPage: FC<NftDetailPageProps> = ({
  className = '',
  isPreviewMode,
}) => {
  const { id } = useParams<NftDetailPageProps>();
  const [{ data: accountData }, disconnect] = useAccount();
  const [product, setProduct] = useState<any>();
  const [user, setUser] = useState<any>([]);
  const [isResell, setIsResell] = useState<any>(false);
  const [isBuy, setIsBuy] = useState<any>(false);
  const [isHide, setIsHide] = useState<any>(false);
  const [newPrice, setNewPrice] = useState<any>(0);

  const errorNotify = () => toast.error('Buy digital Error!');
  const successNotify = () => toast.success('Buy digital Successfully!');

  const errorResellNotify = () => toast.error('Resell digital Error!');
  const successResellNotify = () =>
    toast.success('Resell digital Successfully!');

  useEffect(() => {
    getProduct();
    getUser();
  }, [accountData, isResell]);

  const getProduct = async () => {
    const data = await HandleApi.APIGet(`product/detail/${id}`);
    setProduct(data);
  };

  const getUser = async () => {
    const data =
      accountData?.address &&
      (await HandleApi.APIGet(`user/detail/${accountData?.address}`));
    setUser(data);
  };

  const buyNft = async (nft: any) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      nftMarketAddress,
      NFTMarketplace,
      signer
    );

    try {
      const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });
      const tx = await transaction.wait();

      await HandleApi.APIPut(`product/update/${product.id}`, {
        ownerId: user.id,
        isSale: true,
      });

      await HandleApi.APIPost(`transaction`, {
        productId: product.id,
        contractAddress: nftMarketAddress,
        trx: tx.transactionHash,
        totalPrice: product.price,
        description: ' ',
        sellerAccount: tx.from,
        buyerAccount: tx.to,
        type: 'BUY',
      });
      setIsBuy(true);
      successNotify();
    } catch (error) {
      errorNotify();
    }
  };

  const resellNft = async (nft: any) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      nftMarketAddress,
      NFTMarketplace,
      signer
    );

    try {
      const price = ethers.utils.parseUnits(newPrice, 'ether');
      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();

      const transaction = await contract.resellToken(nft.tokenId, price, {
        value: listingPrice,
      });
      const tx = await transaction.wait();

      const productData = await HandleApi.APIPut(
        `product/update/${product.id}`,
        {
          price: newPrice,
          isSale: false,
        }
      );
      console.log('🚀 ~ productData', productData);

      const transactionData = await HandleApi.APIPost(`transaction`, {
        productId: product.id,
        contractAddress: nftMarketAddress,
        trx: tx.transactionHash,
        totalPrice: newPrice,
        description: ' ',
        sellerAccount: tx.from,
        buyerAccount: tx.to,
        type: 'RESELL',
      });
      console.log('🚀 ~ transactionData', transactionData);

      setIsResell(false);
      successResellNotify();
    } catch (error) {
      errorResellNotify();
    }
  };

  const renderSection1 = () => {
    return (
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {/* ---------- 1 ----------  */}
        <div className="pb-9 space-y-5">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
            {product?.name}
          </h2>

          {/* ---------- 4 ----------  */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm">
            <div className="flex items-center ">
              <Avatar
                sizeClass="h-9 w-9"
                radius="rounded-full"
                imgUrl={product?.user?.avatar}
              />
              <span className="ml-2.5 text-neutral-500 dark:text-neutral-400 flex flex-col">
                <span className="text-sm">Creator</span>
                <span className="text-neutral-900 dark:text-neutral-200 font-medium flex items-center">
                  <span>{product?.user?.name}</span>
                  <VerifyIcon iconClass="w-4 h-4" />
                </span>
              </span>
            </div>
            <div className="hidden sm:block h-6 border-l border-neutral-200 dark:border-neutral-700"></div>
            <div className="flex items-center">
              <Avatar
                imgUrl={product?.category?.icon}
                sizeClass="h-9 w-9"
                radius="rounded-full"
              />
              <span className="ml-2.5 text-neutral-500 dark:text-neutral-400 flex flex-col">
                <span className="text-sm">Category</span>
                <span className="text-neutral-900 dark:text-neutral-200 font-medium flex items-center">
                  <span>{product?.category?.name}</span>
                  <VerifyIcon iconClass="w-4 h-4" />
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* ---------- 7 ----------  */}
        {/* PRICE */}
        <div className="pb-9 pt-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1 flex flex-col sm:flex-row items-baseline p-6 border-2 border-green-500 rounded-xl relative">
              <span className="absolute bottom-full translate-y-1 py-1 px-1.5 bg-white dark:bg-neutral-900 text-sm text-neutral-500 dark:text-neutral-400">
                Price
              </span>
              <span className="text-3xl xl:text-4xl font-semibold text-green-500">
                {product?.price} ETH
              </span>
            </div>
          </div>
          {isResell && (
            <div className="mt-8 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="flex-1 flex flex-col sm:flex-row items-baseline p-6 border-2 border-green-500 rounded-xl relative">
                <span className="absolute bottom-full translate-y-1 py-1 px-1.5 bg-white dark:bg-neutral-900 text-sm text-neutral-500 dark:text-neutral-400">
                  New Price
                </span>
                <Input
                  defaultValue="0"
                  onChange={(e) => setNewPrice(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            {isBuy === false &&
            product?.isSale === false &&
            product?.user?.address !== accountData?.address ? (
              <ButtonPrimary className="flex-1" onClick={() => buyNft(product)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.5 12.4101V7.8401C2.5 6.6501 3.23 5.59006 4.34 5.17006L12.28 2.17006C13.52 1.70006 14.85 2.62009 14.85 3.95009V7.75008"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22.5588 13.9702V16.0302C22.5588 16.5802 22.1188 17.0302 21.5588 17.0502H19.5988C18.5188 17.0502 17.5288 16.2602 17.4388 15.1802C17.3788 14.5502 17.6188 13.9602 18.0388 13.5502C18.4088 13.1702 18.9188 12.9502 19.4788 12.9502H21.5588C22.1188 12.9702 22.5588 13.4202 22.5588 13.9702Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 12H14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="ml-2.5">Buy now</span>
              </ButtonPrimary>
            ) : product?.isSale === true &&
              product?.user?.address === accountData?.address &&
              isResell === false ? (
              <ButtonPrimary
                className="flex-1"
                onClick={() => setIsResell(true)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.5 12.4101V7.8401C2.5 6.6501 3.23 5.59006 4.34 5.17006L12.28 2.17006C13.52 1.70006 14.85 2.62009 14.85 3.95009V7.75008"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22.5588 13.9702V16.0302C22.5588 16.5802 22.1188 17.0302 21.5588 17.0502H19.5988C18.5188 17.0502 17.5288 16.2602 17.4388 15.1802C17.3788 14.5502 17.6188 13.9602 18.0388 13.5502C18.4088 13.1702 18.9188 12.9502 19.4788 12.9502H21.5588C22.1188 12.9702 22.5588 13.4202 22.5588 13.9702Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 12H14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="ml-2.5">Resell now</span>
              </ButtonPrimary>
            ) : (
              isResell === true && (
                <ButtonPrimary
                  className="flex-1"
                  onClick={() => resellNft(product)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2.5 12.4101V7.8401C2.5 6.6501 3.23 5.59006 4.34 5.17006L12.28 2.17006C13.52 1.70006 14.85 2.62009 14.85 3.95009V7.75008"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22.5588 13.9702V16.0302C22.5588 16.5802 22.1188 17.0302 21.5588 17.0502H19.5988C18.5188 17.0502 17.5288 16.2602 17.4388 15.1802C17.3788 14.5502 17.6188 13.9602 18.0388 13.5502C18.4088 13.1702 18.9188 12.9502 19.4788 12.9502H21.5588C22.1188 12.9702 22.5588 13.4202 22.5588 13.9702Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 12H14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span className="ml-2.5">Confirm Resell</span>
                </ButtonPrimary>
              )
            )}
          </div>
        </div>

        {/* ---------- 9 ----------  */}
        <div className="pt-9">
          <TabDetail productId={id} />
        </div>
      </div>
    );
  };

  return (
    <div
      className={`nc-NftDetailPage  ${className}`}
      data-nc-id="NftDetailPage"
    >
      <Helmet>
        <title>404 || Togethr</title>
      </Helmet>
      {/* MAIn */}
      <main className="container mt-11 flex ">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
          {/* CONTENT */}
          <div className="space-y-8 lg:space-y-10">
            {/* HEADING */}
            <div className="relative">
              <NcImage
                src={product?.uri}
                containerClassName="aspect-w-11 aspect-h-12 rounded-3xl overflow-hidden"
              />
            </div>

            <AccordionInfo
              desc={product?.description}
              tokenId={product?.tokenId}
              address={product?.address}
            />
          </div>

          {/* SIDEBAR */}
          <div className="pt-10 lg:pt-0 xl:pl-10 border-t-2 border-neutral-200 dark:border-neutral-700 lg:border-t-0">
            {renderSection1()}
          </div>
        </div>
      </main>

      {/* OTHER SECTION */}
      {!isPreviewMode && (
        <div className="container py-24 lg:py-32">
          {/* SECTION 1 */}
          <div className="relative py-24 lg:py-28">
            <BackgroundSection />
            <SectionSliderCategories />
          </div>
        </div>
      )}
    </div>
  );
};

export default NftDetailPage;
