import { Transition } from '@headlessui/react';
import HandleApi from 'api/HandleApi';
import React, { FC, useEffect, useState } from 'react';
import Nav from 'shared/Nav/Nav';
import NavItem from 'shared/NavItem/NavItem';

export interface HeaderFilterSearchPageProps {
  className?: string;
  setFilter?: any;
}

const HeaderFilterSearchPage: FC<HeaderFilterSearchPageProps> = ({
  className = 'mb-12',
  setFilter = ' ',
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [tabActive, setTabActive] = React.useState('All NFTs');
  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const data = await HandleApi.APIGet('category');
    setCategories(data);
  };

  return (
    <div className={`flex flex-col relative ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0 lg:space-x-2 ">
        <Nav
          className="sm:space-x-2"
          containerClassName="relative flex w-full overflow-x-auto text-sm md:text-base hiddenScrollbar"
        >
          {[{ name: 'All NFTs', id: '' }, ...categories].map((item, index) => (
            <NavItem
              key={index}
              isActive={tabActive === item.name}
              onClick={() => {
                setTabActive(item.name);
                setFilter(item.id);
              }}
            >
              {item.name}
            </NavItem>
          ))}
        </Nav>
      </div>

      <Transition
        show={isOpen}
        enter="transition-opacity duration-150"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="w-full border-b border-neutral-200/70 dark:border-neutral-700 my-8"></div>
      </Transition>
    </div>
  );
};

export default HeaderFilterSearchPage;
