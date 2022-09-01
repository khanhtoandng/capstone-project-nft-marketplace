import BgGlassmorphism from 'components/BgGlassmorphism/BgGlassmorphism';
import SectionGridAuthorBox from 'components/SectionGridAuthorBox/SectionGridAuthorBox';
import SectionHero from 'components/SectionHero/SectionHero';
import SectionHowItWork from 'components/SectionHowItWork/SectionHowItWork';
import SectionSliderCategories from 'components/SectionSliderCategories/SectionSliderCategories';
import Vector1 from 'images/Vector1.png';
import { Helmet } from 'react-helmet';
import SectionGridFeatureNFT from './SectionGridFeatureNFT';
import SectionLargeSlider from './SectionLargeSlider';

function PageHome() {
  return (
    <div className="nc-PageHome relative overflow-hidden">
      <Helmet>
        <title>Togethr</title>
      </Helmet>
      {/* GLASSMOPHIN */}
      <BgGlassmorphism />

      <div className="container relative space-y-20 mt-12 mb-20 sm:space-y-24 sm:my-24 lg:space-y-32 lg:my-32">
        {/* SECTION HERO */}
        <SectionHero
          className="pb-10"
          heading={
            <span>
              Discover 🖼
              <br /> collect, and sell <br /> extraordinary {` `}
              <span className="relative pr-3">
                <img
                  className="w-full absolute bottom-3 -left-1"
                  src={Vector1}
                  alt="Vector1"
                />
                <span className="relative">NFTs</span>
              </span>
            </span>
          }
        />

        {/* SECTION 2 */}
        <SectionHowItWork />
      </div>

      {/* SECTION LAERGE SLIDER */}
      <div className="bg-neutral-100/80 dark:bg-black/20 py-20 lg:py-32">
        <div className="container">
          <SectionLargeSlider />
        </div>
      </div>

      <div className="container relative space-y-24 my-24 lg:space-y-32 lg:my-32">
        {/* SECTION */}
        <SectionGridAuthorBox boxCard="box3" />

        {/* SECTION */}
        <SectionGridFeatureNFT />

        {/* SECTION 1 */}
        <SectionSliderCategories />
      </div>
    </div>
  );
}

export default PageHome;
