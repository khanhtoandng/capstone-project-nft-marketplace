import Header2 from 'components/Header/Header2';
import HeaderLogged from 'components/Header/HeaderLogged';
import { useConnect } from 'wagmi';

const SiteHeader = () => {
  // let location = useLocation();
  const [{ data: connectData }] = useConnect();

  return !connectData.connected ? <Header2 /> : <HeaderLogged />;
};

export default SiteHeader;
