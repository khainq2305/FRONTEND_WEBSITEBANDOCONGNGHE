import Lottie from 'lottie-react';
import loadingAnimation from '../../../assets/Client/animations/loader.json';

const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '2rem' }}>
    <Lottie animationData={loadingAnimation} style={{ height: 100 }} loop autoplay />
  </div>
);

export default Loader;
