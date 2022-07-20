import { Tab } from '@headlessui/react';
import HandleApi from 'api/HandleApi';
import { FC, useEffect, useState } from 'react';

export interface TabDetailProps {
  className?: string;
  owner?: any;
  productId?: any;
}

const TabDetail: FC<TabDetailProps> = ({ productId }) => {
  const TABS = ['History'];
  const [transactions, setTransactions] = useState<any>([]);

  useEffect(() => {
    getTransactions();
  }, []);

  const getTransactions = async () => {
    console.log('🚀 ~ productId', productId);

    const data =
      productId &&
      (await HandleApi.APIGet(`transaction?productId=${productId}`));
    console.log('🚀 ~ data', data);
    setTransactions(data);
  };

  const renderTabProvenance = () => {
    return (
      <ul className="divide-y divide-neutral-100 dark:divide-neutral-700">
        {transactions?.length > 0 &&
          transactions?.map((trx: any, index: any) => (
            <div
              key={index}
              className={` py-4 ${index % 2 === 1 ? 'bg-neutradl-100' : ''}`}
            >
              <div className="flex items-center">
                {/* <Avatar siass="h-10 w-10" radius="rounded-full" /> */}
                <span className="ml-4 text-neutral-500 dark:text-neutral-400 flex flex-col">
                  <span className="flex items-center text-sm">
                    <span className="">From</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-200 ml-1">
                      {trx?.sellerAccount.toString().substring(0, 15) + '...'}
                    </span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-200 ml-1">
                      To
                    </span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-200 ml-1">
                      {trx?.buyerAccount.toString().substring(0, 15) + '...'}
                    </span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-400 ml-1">
                      At
                    </span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-200 ml-1">
                      {/* {trx.transactionAddress.toString().substring(0, 15) +
                        '...'} */}
                      <div
                        style={{ zIndex: 1000 }}
                        onClick={() => {
                          console.log(
                            `https://rinkeby.etherscan.io/tx/${trx.transactionAddress.toString()}`
                          );
                          const newWindow = window.open(
                            `https://rinkeby.etherscan.io/tx/${trx.transactionAddress.toString()}`,
                            '_blank',
                            'noopener,noreferrer'
                          );
                          if (newWindow) newWindow.opener = null;
                        }}
                      >
                        {trx.transactionAddress.toString().substring(0, 15) +
                          '...'}
                      </div>
                    </span>
                  </span>
                  <span className="text-xs mt-1">
                    {new Date(trx.createdAt).toString()}
                  </span>
                </span>
              </div>
              {/* <span className="absolute inset-0 rounded-md focus:z-10 focus:outline-none focus:ring-2 ring-blue-400"></span> */}
            </div>
          ))}
      </ul>
    );
  };

  const renderTabItem = (item: string) => {
    switch (item) {
      case 'History':
        return renderTabProvenance();

      default:
        return null;
    }
  };

  return (
    <div className="w-full pdx-2 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex justify-start pd-1 space-x-2.5 rounded-full bordedr border-neutral-300 dark:border-neutral-500">
          {TABS.map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                `px-3.5 sm:px-8 py-1.5 sm:py-2 text-xs sm:text-sm leading-5 font-medium rounded-full focus:outline-none focus:ring-2 ring-primary-300 ${
                  selected
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'text-neutral-700 dark:text-neutral-300 bg-neutral-100/70 dark:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        {renderTabItem('History')}
        {/* <Tab.Panels className="mt-4">
          {TABS.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              // className={
              //   'rounded-xl focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60 '
              // }
            >
              
            </Tab.Panel>
          ))}
        </Tab.Panels> */}
      </Tab.Group>
    </div>
  );
};

export default TabDetail;
