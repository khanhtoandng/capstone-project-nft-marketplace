import { RadioGroup } from '@headlessui/react';
import HandleApi from 'api/HandleApi';
import FormItem from 'components/FormItem';
import Label from 'components/Label/Label';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ButtonPrimary from 'shared/Button/ButtonPrimary';
import ButtonSecondary from 'shared/Button/ButtonSecondary';
import Input from 'shared/Input/Input';
import NcImage from 'shared/NcImage/NcImage';
import NcModal from 'shared/NcModal/NcModal';
import Textarea from 'shared/Textarea/Textarea';
import { useAccount } from 'wagmi';
import Web3Modal from 'web3modal';
import { nftMarketAddress } from '../config';
import NFTMarketplace from '../eth/abi/NFTMarketplace.json';

export interface PageUploadItemProps {
  className?: string;
}

const projectId = '';
const projectSecret = '2';
const authorization = 'Basic ' + btoa(projectId + ':' + projectSecret);
let ipfs: any;

try {
  ipfs = create({
    url: 'https://ipfs.infura.io:5001/api/v0',
    headers: {
      authorization,
    },
  });
} catch (error) {
  console.error('IPFS error ', error);
  ipfs = undefined;
}

const PageUploadItem: FC<PageUploadItemProps> = ({ className = '' }) => {
  const [selected, setSelected] = useState('');
  const [fileUrl, setFileUrl] = useState(null);
  const [previewFile, setPreviewFile] = useState(' ');
  const [formInput, updateFormInput] = useState({
    name: '',
    price: '',
    desc: '',
    externalLink: '',
  });
  const [categories, setCategories] = useState<any>([]);
  const [user, setUser] = useState<any>();
  const [{ data: accountData }, disconnect] = useAccount();
  const [showModal, setShowModal] = useState(false);

  const errorNotify = () => toast.error('Create item Error!');
  const successNotify = () => toast.success('Create item Successfully!');
  const warningNotify = () => toast.warning('Input invalid!');

  useEffect(() => {
    getCategories();
    getUser();
  }, []);

  const getCategories = async () => {
    const data = await HandleApi.APIGet('category');
    setCategories(data);
  };

  const getUser = async () => {
    const data = await HandleApi.APIGet(`user/detail/${accountData?.address}`);
    setUser(data);
  };

  async function onChange(e: any) {
    const file = e.target.files[0];
    try {
      setPreviewFile(URL.createObjectURL(e.target.files[0]));
      const result = await ipfs.add(file);

      const url = `https://ipfs.infura.io/ipfs/${result.path}`;
      setFileUrl(url as any);
    } catch (error) {}
  }

  async function createItem() {
    if (
      !formInput?.name ||
      !formInput?.desc ||
      !formInput?.price ||
      !formInput?.externalLink ||
      !fileUrl
    ) {
      warningNotify();
      return;
    }

    const data = JSON.stringify({
      name: formInput.name,
      externalLink: formInput.externalLink,
      desc: formInput.desc,
      image: fileUrl,
      price: formInput.price,
    });

    try {
      const added = await ipfs.add(data);
      console.log('===', added);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      const body = {
        name: formInput.name,
        externalLink: formInput.externalLink,
        description: formInput.desc,
        uri: fileUrl,
        isSale: false,
        ownerId: user.id,
        categoryId: selected,
        price: formInput.price,
        address: nftMarketAddress,
        tokenId: '',
      };
      createSale(url, body);
    } catch (error) {}
  }

  async function createSale(url: any, body: any) {
    console.log('🚀 ~ body', body);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const price = ethers.utils.parseUnits(formInput.price, 'ether');

    let contract = new ethers.Contract(
      nftMarketAddress,
      NFTMarketplace,
      signer
    );
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    try {
      let transaction = await contract.createToken(url, price, {
        value: listingPrice,
      });

      let tx = await transaction.wait();

      let event = tx.events[0];
      let value = event.args[2];
      let tokenId = value.toNumber();

      body = { ...body, tokenId };

      const productResp = await HandleApi.APIPost(`product`, body);
      const data = await HandleApi.APIPost(`transaction`, {
        productId: productResp.id,
        contractAddress: nftMarketAddress,
        trx: tx.transactionHash,
        totalPrice: body.price,
        description: ' ',
        sellerAccount: tx.from,
        buyerAccount: tx.to,
        type: 'CREATE_NFT',
      });

      successNotify();
    } catch (error) {
      errorNotify();
    }
  }

  const renderContent = () => {
    return (
      <form action="#">
        <div className="p-5 border bg-white dark:bg-neutral-300 border-neutral-200 dark:border-neutral-700 rounded-xl flex items-center justify-center mt-4">
          <NcImage className="w-80 h-80" src={previewFile} />
        </div>

        <div className="mt-5 space-x-3">
          <ButtonPrimary type="button" onClick={() => setShowModal(false)}>
            OK
          </ButtonPrimary>
        </div>
      </form>
    );
  };

  return (
    <div
      className={`nc-PageUploadItem ${className}`}
      data-nc-id="PageUploadItem"
    >
      <div className="container">
        <div className="my-12 sm:lg:my-16 lg:my-24 max-w-4xl mx-auto space-y-8 sm:space-y-10">
          {/* HEADING */}
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-semibold">
              Create New Item
            </h2>
            <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
              You can set preferred display name, create your profile URL and
              manage other personal settings.
            </span>
          </div>
          <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-700"></div>
          <div className="mt-10 md:mt-0 space-y-5 sm:space-y-6 md:sm:space-y-8">
            <div>
              <h3 className="text-lg sm:text-2xl font-semibold">
                Image, Video, Audio, or 3D Model
              </h3>
              <span className="text-neutral-500 dark:text-neutral-400 text-sm">
                File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV,
                OGG, GLB, GLTF. Max size: 100 MB
              </span>
              <div className="mt-5 ">
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-6000 border-dashed rounded-xl">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-neutral-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                    <div className="flex text-sm text-neutral-6000 dark:text-neutral-300">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer  rounded-md font-medium text-primary-6000 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          onChange={(e) => onChange(e)}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ---- */}
            <FormItem label="Item Name">
              <Input
                defaultValue="NFT name"
                onChange={(e) =>
                  updateFormInput({ ...formInput, name: e.target.value })
                }
              />
            </FormItem>

            {/* ---- */}
            <FormItem label="Item Price">
              <Input
                defaultValue="0"
                onChange={(e) =>
                  updateFormInput({ ...formInput, price: e.target.value })
                }
              />
            </FormItem>

            {/* ---- */}
            <FormItem
              label="External link"
              desc="Togethr will include a link to this URL on this item's detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details."
            >
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                  https://
                </span>
                <Input
                  className="!rounded-l-none"
                  placeholder="abc.com"
                  onChange={(e) =>
                    updateFormInput({
                      ...formInput,
                      externalLink: e.target.value,
                    })
                  }
                />
              </div>
            </FormItem>

            {/* ---- */}
            <FormItem
              label="Description"
              desc={
                <div>
                  The description will be included on the item's detail page
                  underneath its image.{' '}
                  <span className="text-green-500">Markdown</span> syntax is
                  supported.
                </div>
              }
            >
              <Textarea
                rows={6}
                className="mt-1.5"
                placeholder="..."
                onChange={(e) =>
                  updateFormInput({
                    ...formInput,
                    desc: e.target.value,
                  })
                }
              />
            </FormItem>

            <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-700"></div>

            <div>
              <Label>Choose category</Label>
              <div className="text-neutral-500 dark:text-neutral-400 text-sm">
                Choose an exiting category
              </div>
              <RadioGroup value={selected} onChange={setSelected}>
                <RadioGroup.Label className="sr-only">
                  Server size
                </RadioGroup.Label>
                <div className="flex overflow-auto py-2 space-x-4 customScrollBar">
                  {categories.map((plan: any, index: any) => (
                    <RadioGroup.Option
                      key={plan.id}
                      value={plan.id}
                      className={({ active, checked }) =>
                        `${
                          active
                            ? 'ring-2 ring-offset-2 ring-offset-sky-300 ring-white ring-opacity-60'
                            : ''
                        }
                  ${
                    checked
                      ? 'bg-teal-600 text-white'
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }
                    relative flex-shrink-0 w-44 rounded-xl border border-neutral-200 dark:border-neutral-700 px-6 py-5 cursor-pointer flex focus:outline-none `
                      }
                    >
                      {({ active, checked }) => (
                        <>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <div className="text-sm">
                                <div className="flex items-center justify-between">
                                  <RadioGroup.Description
                                    as="div"
                                    className={'rounded-full w-16'}
                                  >
                                    <NcImage
                                      containerClassName="aspect-w-1 aspect-h-1 rounded-full overflow-hidden"
                                      src={plan.icon}
                                    />
                                  </RadioGroup.Description>
                                  {checked && (
                                    <div className="flex-shrink-0 text-white">
                                      <CheckIcon className="w-6 h-6" />
                                    </div>
                                  )}
                                </div>
                                <RadioGroup.Label
                                  as="p"
                                  className={`font-semibold mt-3  ${
                                    checked ? 'text-white' : ''
                                  }`}
                                >
                                  {plan.name}
                                </RadioGroup.Label>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* ---- */}
            <div className="pt-2 flex flex-col sm:flex-row space-y-3 sm:space-y-0 space-x-0 sm:space-x-3 ">
              <ButtonPrimary
                className="flex-1"
                onClick={async () => {
                  await createItem();
                }}
              >
                Upload item
              </ButtonPrimary>
              <ButtonSecondary
                className="flex-1"
                onClick={() => setShowModal(true)}
              >
                Preview item
              </ButtonSecondary>
            </div>
          </div>
        </div>
      </div>
      <NcModal
        renderTrigger={() => null}
        isOpenProp={showModal}
        renderContent={renderContent}
        contentExtraClass="max-w-md"
        onCloseModal={() => setShowModal(false)}
        modalTitle="Preview Product"
      />
    </div>
  );
};

function CheckIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default PageUploadItem;
