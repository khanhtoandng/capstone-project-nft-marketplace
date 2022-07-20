import { ContextProvider } from 'context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyRouter from 'routers/index';

function App() {
  // const notify = () => toast.error('Wow so easy!');

  return (
    <div className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
      <ContextProvider>
        <MyRouter />
        <ToastContainer />
      </ContextProvider>
    </div>
  );
}

export default App;
