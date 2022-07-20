import { FC } from 'react';
import ButtonPrimary from 'shared/Button/ButtonPrimary';
import Input from 'shared/Input/Input';
import Logo from 'shared/Logo/Logo';
import MenuBar from 'shared/MenuBar/MenuBar';
import Navigation from 'shared/Navigation/Navigation';
import SwitchDarkMode from 'shared/SwitchDarkMode/SwitchDarkMode';
import AvatarDropdown from './AvatarDropdown';

export interface MainNav2LoggedProps {}

const MainNav2Logged: FC<MainNav2LoggedProps> = () => {
  return (
    <div className={`nc-MainNav2Logged relative z-10 ${'onTop '}`}>
      <div className="container py-5 relative flex justify-between items-center space-x-4 xl:space-x-8">
        <div className="flex justify-start flex-grow items-center space-x-3 sm:space-x-8 lg:space-x-10">
          <Logo />
          <div className="hidden sm:block flex-grow max-w-xs"></div>
        </div>
        <div className="flex-shrink-0 flex items-center justify-end text-neutral-700 dark:text-neutral-100 space-x-1">
          <div className="hidden items-center xl:flex space-x-2">
            <Navigation />
            <div className="hidden sm:block h-6 border-l border-neutral-300 dark:border-neutral-6000"></div>
            <div className="flex">
              <SwitchDarkMode />
            </div>
            <div></div>
            <ButtonPrimary
              href={'/page-upload-item'}
              sizeClass="px-4 py-2 sm:px-5"
            >
              Create
            </ButtonPrimary>
            <div></div>
            <AvatarDropdown />
          </div>
          <div className="flex items-center space-x-3 xl:hidden">
            <AvatarDropdown />
            <MenuBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav2Logged;
