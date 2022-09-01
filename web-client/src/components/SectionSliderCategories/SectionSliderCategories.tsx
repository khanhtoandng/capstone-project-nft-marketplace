import Glide from '@glidejs/glide';
import HandleApi from 'api/HandleApi';
import CardCategory5 from 'components/CardCategory5/CardCategory5';
import Heading from 'components/Heading/Heading';
import { FC, useEffect, useId, useRef, useState } from 'react';
import _ from 'lodash';

export interface SectionSliderCategoriesProps {
  className?: string;
  itemClassName?: string;
  heading?: string;
  subHeading?: string;
}

const SectionSliderCategories: FC<SectionSliderCategoriesProps> = ({
  heading = 'Browse by category',
  subHeading = 'Explore the NFTs in the most featured categories.',
  className = '',
  itemClassName = '',
}) => {
  const [categories, setCategories] = useState<any>([]);

  const sliderRef = useRef(null);
  const id = useId();
  const UNIQUE_CLASS = 'glidejs' + id.replace(/:/g, '_');

  const getCategories = async () => {
    const data = await HandleApi.APIGet('category');
    setCategories(data);
  };

  useEffect(() => {
    if (!sliderRef.current) {
      return;
    }

    const OPTIONS: Glide.Options = {
      perView: 5,
      gap: 32,
      bound: true,
      breakpoints: {
        1280: {
          perView: 4,
        },
        1024: {
          gap: 20,
          perView: 3.4,
        },
        768: {
          gap: 20,
          perView: 3,
        },
        640: {
          gap: 20,
          perView: 2.3,
        },
        500: {
          gap: 20,
          perView: 1.4,
        },
      },
    };

    let slider = new Glide(`.${UNIQUE_CLASS}`, OPTIONS);
    slider.mount();

    // @ts-ignore
    return () => slider.destroy();
  }, [sliderRef, UNIQUE_CLASS]);

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className={`nc-SectionSliderCategories ${className}`}>
      <div className={`${UNIQUE_CLASS} flow-root`} ref={sliderRef}>
        <Heading desc={subHeading} hasNextPrev>
          {heading}
        </Heading>

        <div className='flex gap-10 w-full overflow-auto h-72'>
          {categories?.map((item: any, index: any) => (
            <li key={index} className={`glide__slide ${itemClassName}`} style={{ height: 200, width: 200 }}>
              <CardCategory5 index={index} featuredImage={item.icon} name={item.name} />
            </li>
          ))}
        </div>
        <div className='glide' data-glide-el='track'>
          <ul className='glide flex'></ul>
        </div>
      </div>
    </div>
  );
};

export default SectionSliderCategories;
