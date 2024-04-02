import { Discuss } from 'react-loader-spinner';

const LoadingScreen = () => {
  return (
    <Discuss
      visible={true}
      height="80"
      width="80"
      ariaLabel="discuss-loading"
      wrapperStyle={{}}
      wrapperClass="discuss-wrapper"
      color="#fff"
      backgroundColor="#F4442E"
    />
  )
}

export default LoadingScreen;
