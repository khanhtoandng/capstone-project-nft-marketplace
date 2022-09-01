import { CustomLink } from 'data/types';
import React from 'react';
import Logo from 'shared/Logo/Logo';

export interface WidgetFooterMenu {
  id: string;
  title: string;
  menus: CustomLink[];
}

const Footer: React.FC = () => {
  return (
    <div
      className="nc-Footer relative py-20 lg:pt-32 lg:pb-28 border-t border-neutral-200 dark:border-neutral-700"
      style={{ paddingTop: '16px', paddingBottom: '16px' }}
    >
      <div className="container grid grid-cols-2 gap-y-10 gap-x-5 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-10 ">
        <div className="grid grid-cols-4 gap-5 col-span-2 md:col-span-4 lg:md:col-span-1 lg:flex lg:flex-col">
          <div className="col-span-2 md:col-span-1">
            <Logo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
