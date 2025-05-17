import React from 'react';

const Topbar = () => {
  const bannerImageUrl = 'https://cdnv2.tgdd.vn/mwg-static/dmx/Banner/e2/72/e272b852da2d5ac3d652a7cd3d1560fe.jpg';

  return (
    <div 
      style={{ backgroundColor: 'rgb(58, 140, 239)' }} 
      className="w-full flex justify-center items-center overflow-hidden relative"
    >
      <img
        src={bannerImageUrl}
        alt="Promotional Banner"
        className="w-full max-w-screen-xl object-cover h-[44px] sm:h-[60px] md:h-[80px] lg:h-[44px] xl:h-[44px] transition-all duration-300 ease-in-out"
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '100%',
        }}
      />
    </div>
  );
};

export default Topbar;
