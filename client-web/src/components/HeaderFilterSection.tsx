import HandleApi from 'api/HandleApi';
import React, { FC, useEffect, useState } from 'react';
import Heading from 'shared/Heading/Heading';
import Nav from 'shared/Nav/Nav';
import NavItem from 'shared/NavItem/NavItem';

export interface HeaderFilterSectionProps {
  className?: string;
  setFilter?: any;
}

const HeaderFilterSection: FC<HeaderFilterSectionProps> = ({
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
      <Heading>{'Featured NFTs'}</Heading>
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
    </div>
  );
};

export default HeaderFilterSection;
