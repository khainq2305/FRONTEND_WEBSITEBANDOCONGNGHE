import React from 'react';

const Topbar = () => {
  const bannerImageUrl = 'https://cdnv2.tgdd.vn/mwg-static/dmx/Banner/4a/b5/4ab556e7bd1b47072fb4c34bee4010ac.png';

  return (
    <div style={{
      width: '100%', 
      backgroundColor: '#007bff' 
    }}>
      <img
        src={bannerImageUrl}
        alt="Promotional Banner"
        style={{
          width: '100%',    
          display: 'block' 
        }}
      />
    </div>
  );
};

export default Topbar;