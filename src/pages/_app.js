// pages/_app.js
import '../styles/globals.css';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import Link from 'next/link';
import Header from '../components/Header'; // Import Header component

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Header /> {/* Use Header component */}
      <main>
        <Component {...pageProps} />
      </main>
    </Provider>
  );
}

export default MyApp;
