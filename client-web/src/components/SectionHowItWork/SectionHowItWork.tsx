import HIW1img from 'images/HIW1img.png';
import HIW2img from 'images/HIW2img.png';
import HIW3img from 'images/HIW3img.png';
import HIW4img from 'images/HIW4img.png';
import { FC } from 'react';
import NcImage from 'shared/NcImage/NcImage';

export interface SectionHowItWorkProps {
  className?: string;
  data?: typeof DEMO_DATA[0][];
}

const DEMO_DATA = [
  {
    id: 1,
    img: HIW1img,
    imgDark: HIW1img,
    title: 'Filter & Discover',
  },
  {
    id: 2,
    img: HIW2img,
    imgDark: HIW2img,
    title: 'Connect wallet',
  },
  {
    id: 3,
    img: HIW3img,
    imgDark: HIW3img,
    title: 'Earn money',
  },
  {
    id: 4,
    img: HIW4img,
    imgDark: HIW4img,
    title: 'Create NFT',
  },
];

const SectionHowItWork: FC<SectionHowItWorkProps> = ({
  className = '',
  data = DEMO_DATA,
}) => {
  return (
    <div
      className={`nc-SectionHowItWork  ${className}`}
      data-nc-id="SectionHowItWork"
    >
      <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-16 xl:gap-20">
        {/* <img
          className="hidden md:block absolute inset-x-0 -top-1"
          src={VectorImg}
          alt="vector"
        /> */}
        {data.map((item: typeof DEMO_DATA[number], index: number) => (
          <div
            key={item.id}
            className="relative flex flex-col items-center max-w-xs mx-auto"
          >
            <NcImage
              containerClassName="mb-5 sm:mb-10 lg:mb-20 max-w-[200px] mx-auto"
              src={item.img}
            />
            <div className="text-center mt-auto space-y-5">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              {/* <span className="block text-neutral-500 dark:text-neutral-400">
                {item.desc}
              </span> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionHowItWork;
