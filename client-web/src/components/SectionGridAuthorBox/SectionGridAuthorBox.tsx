import HandleApi from 'api/HandleApi';
import CardAuthorBox3 from 'components/CardAuthorBox3/CardAuthorBox3';
import CardAuthorBox4 from 'components/CardAuthorBox4/CardAuthorBox4';
import Heading from 'components/Heading/Heading';
import React, { FC, useEffect, useState } from 'react';

export interface SectionGridAuthorBoxProps {
  className?: string;
  sectionStyle?: 'style1' | 'style2';
  gridClassName?: string;
  boxCard?: 'box1' | 'box2' | 'box3' | 'box4';
  data?: any[];
}

const SectionGridAuthorBox: FC<SectionGridAuthorBoxProps> = ({
  className = '',
  boxCard = 'box1',
  sectionStyle = 'style1',
  gridClassName = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  data = Array.from('11111111'),
}) => {
  const [tabActive, setTabActive] = React.useState('Popular');
  const [authors, setAuthors] = useState<any>([]);

  useEffect(() => {
    getAuthors();
  }, []);

  const getAuthors = async () => {
    const data = await HandleApi.APIGet('user?limit=8');
    setAuthors(data);
  };

  const renderCard = (index: number, item?: any) => {
    switch (boxCard) {
      case 'box3':
        return (
          <CardAuthorBox3
            key={index}
            name={item?.name}
            avatar={item?.avatar}
            id={item?.id}
          />
        );
      case 'box4':
        return (
          <CardAuthorBox4
            authorIndex={index < 3 ? index + 1 : undefined}
            key={index}
            name={item?.name}
            avatar={item?.avatar}
            id={item?.id}
            address={item?.address}
          />
        );

      default:
        return null;
    }
  };

  const renderHeading1 = () => {
    return (
      <div className="mb-12 lg:mb-16  flex justify-between flex-col sm:flex-row">
        <Heading
          rightPopoverText="Creators"
          rightPopoverOptions={[
            {
              name: 'Creators',
              href: '#',
            },
          ]}
          className="text-neutral-900 dark:text-neutral-50"
        >
          Popular
        </Heading>
      </div>
    );
  };

  return (
    <div
      className={`nc-SectionGridAuthorBox relative ${className}`}
      data-nc-id="SectionGridAuthorBox"
    >
      {renderHeading1()}
      <div className={`grid gap-4 md:gap-7 ${gridClassName}`}>
        {authors.map((item: any, index: any) => renderCard(index, item))}
      </div>
    </div>
  );
};

export default SectionGridAuthorBox;
