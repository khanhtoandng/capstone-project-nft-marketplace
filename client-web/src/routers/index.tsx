import AccountPage from 'containers/AccountPage/AccountPage';
import AuthorPage from 'containers/AuthorPage/AuthorPage';
import NftDetailPage from 'containers/NftDetailPage/NftDetailPage';
import Page404 from 'containers/Page404/Page404';
import PageConnectWallet from 'containers/PageConnectWallet';
import { default as PageHome } from 'containers/PageHome/PageHome';
import PageSearch from 'containers/PageSearch';
import PageUploadItem from 'containers/PageUploadItem';
import SiteHeader from 'containers/SiteHeader';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Footer from 'shared/Footer/Footer';
import ScrollToTop from './ScrollToTop';
import { Page } from './types';

export const pages: Page[] = [
  { path: '/', exact: true, component: PageHome },
  { path: '/#', exact: true, component: PageHome },
  { path: '/home2', exact: true, component: PageHome },
  { path: '/nft-detail/:id', component: NftDetailPage },
  { path: '/page-search', component: PageSearch },
  { path: '/page-author/:id', component: AuthorPage },
  { path: '/account', component: AccountPage },
  { path: '/page-upload-item', component: PageUploadItem },
  { path: '/connect-wallet', component: PageConnectWallet },
  //
];

const Routes = () => {
  return (
    <BrowserRouter basename="/togethr">
      <ScrollToTop />
      <SiteHeader />
      <Switch>
        {pages.map(({ component, path, exact }) => {
          return (
            <Route
              key={path}
              component={component}
              exact={!!exact}
              path={path}
            />
          );
        })}
        <Route component={Page404} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
};

export default Routes;
