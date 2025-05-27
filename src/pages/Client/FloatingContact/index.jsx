import React from 'react';
import './FloatingContact.css'; // nhớ tạo file CSS riêng

const FloatingContact = () => {
  return (
    <div className="floating-contact">
      <a
        href="https://m.me/tenfanpagecuaban" // <- Thay bằng link Messenger thật
        target="_blank"
        rel="noopener noreferrer"
        className="contact-item messenger"
      >
        <img src="https://scontent.fvca1-2.fna.fbcdn.net/v/t39.8562-6/475210330_598195142840489_9172482348551739153_n.png?_nc_cat=1&ccb=1-7&_nc_sid=f537c7&_nc_ohc=zC_uMB-nXLAQ7kNvwFMo2o4&_nc_oc=AdlJeBc_OsvtrYBv9V3SAsw7M4Oea1qYH-CD0qsKdFJVuoWMZjTpuG9Gdj-5zp4KiFA&_nc_zt=14&_nc_ht=scontent.fvca1-2.fna&_nc_gid=Bd5Zt2r6km4dnBZgKPKqPQ&oh=00_AfIIM5oHIYx5JC0rDW_UgbxDq2I11EIuX-K9rs9XwD1OMQ&oe=6839A1D8" alt="Messenger" />
        <div className="contact-text">
          <span>Chat Messenger</span>
          <small>(8h - 24h)</small>
        </div>
      </a>

      <a href="tel:19008922" className="contact-item purchase">
        <img src="https://dienthoaigiakho.vn/_next/image?url=%2Ficons%2Fcommon%2Fbtn-call.svg&w=48&q=75" alt="Gọi mua hàng" />
        <div className="contact-text">
          <span>Gọi mua hàng</span>
          <small>1900 8922 (8h-24h)</small>
        </div>
      </a>

      <a href="tel:19008174" className="contact-item warranty">
        <img src="https://dienthoaigiakho.vn/_next/image?url=%2Ficons%2Fcommon%2Ficon-repair.svg&w=48&q=75" alt="Gọi bảo hành" />
        <div className="contact-text">
          <span>Gọi bảo hành</span>
          <small>1900 8174 (8h-21h)</small>
        </div>
      </a>
    </div>
  );
};

export default FloatingContact;
