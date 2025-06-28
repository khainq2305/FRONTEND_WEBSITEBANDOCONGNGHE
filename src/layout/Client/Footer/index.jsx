import React from 'react';
import { useSystemSetting } from '@/contexts/SystemSettingContext';

const Footer = () => {
  const { settings } = useSystemSetting() || {};
  if (!settings) return null;

  const {
    hotline,
    hotline_warranty,
    hotline_feedback,
    email_contact,
    address,
    facebook_enabled,
    instagram_enabled,
    tiktok_enabled,
    youtube_enabled,
    zalo_enabled,
    show_social_footer
  } = settings;

  return (
    <footer className="bg-white text-gray-800 pt-10 pb-4">
      <div className="max-w-[1200px] mx-auto">
        <div className="px-4 sm:px-6 md:px-8 lg:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {/* --- CỘT 1: THÔNG TIN LIÊN HỆ --- */}
            <div className="text-xs sm:text-sm">
              <h3 className="font-semibold text-sm md:text-base uppercase mb-4 text-gray-700">Thông tin liên hệ</h3>
              {hotline && (
                <p className="mb-1.5">
                  <a href={`tel:${hotline}`} className="hover:text-primary">
                    Mua nhanh Online: <strong className="text-primary">{hotline}</strong>
                  </a>{' '}
                  (8h-24h mỗi ngày)
                </p>
              )}
              {hotline_warranty && (
                <p className="mb-1.5">
                  <a href={`tel:${hotline_warranty}`} className="hover:text-primary">
                    Bảo hành - Sửa chữa: <strong className="text-primary">{hotline_warranty}</strong>
                  </a>{' '}
                  (8h-21h mỗi ngày)
                </p>
              )}
              {hotline_feedback && (
                <p className="mb-1.5">
                  <a href={`tel:${hotline_feedback}`} className="hover:text-primary">
                    Góp Ý/ Phản ánh về DV: <strong className="text-primary">{hotline_feedback}</strong>
                  </a>{' '}
                  (8h-24h mỗi ngày)
                </p>
              )}
              {email_contact && (
                <p className="mb-3">
                  <a href={`mailto:${email_contact}`} className="hover:text-primary">
                    Hỗ trợ khách hàng: <strong className="text-primary">{email_contact}</strong>
                  </a>
                </p>
              )}

              <h3 className="font-semibold text-sm md:text-base uppercase mb-3 mt-5 text-gray-700">Showroom Giá Kho</h3>
              <p className="mb-1.5">Giờ hoạt động Showroom: 8h30 - 21h30</p>

              <ul className="space-y-1.5 text-gray-600">
                <li>947 Quang Trung, P14, Quận Gò Vấp, TP. HCM</li>
                <li>56 Lê Văn Việt, Phường Hiệp Phú, TP. Thủ Đức</li>
                <li>1247, Đường 3 Tháng 2, P7, Quận 11, TP. HCM</li>
                <li>121 Chu Văn An, P26, Quận Bình Thạnh, TP. HCM</li>
              </ul>
            </div>

            {/* --- CỘT 2 + 3: THÔNG TIN KHÁC --- */}
            <div className="text-xs sm:text-sm">
              <h3 className="font-semibold text-sm md:text-base uppercase mb-4 text-gray-700">Thông tin & Chính sách</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-primary">Ưu đãi Giá Kho Member</a></li>
                <li><a href="#" className="hover:text-primary">Hướng dẫn mua hàng Online</a></li>
                <li><a href="#" className="hover:text-primary">Hướng dẫn thanh toán</a></li>
                <li><a href="#" className="hover:text-primary">Hướng dẫn trả góp</a></li>
                <li><a href="#" className="hover:text-primary">Chính sách giao nhận</a></li>
                <li><a href="#" className="hover:text-primary">Chính sách bảo hành</a></li>
              </ul>

              <h3 className="font-semibold text-sm md:text-base uppercase mb-4 mt-6 text-gray-700">Đối tác bảo hành</h3>
              <img
                src="https://cdn.dienthoaigiakho.vn/photos/1719201482724-CareCenter_Logo-Ngang.png"
                alt="CareCenter.vn"
                className="h-10 bg-blue-600 p-1 rounded"
              />
            </div>
            {/* --- CỘT 3: DỊCH VỤ & THÔNG TIN KHÁC --- */}
            <div className="text-xs sm:text-sm">
              <h3 className="font-semibold text-sm md:text-base uppercase mb-4 text-gray-700">Dịch vụ & Thông tin khác</h3>

              <ul className="space-y-2 text-gray-600 mb-6">
                <li>
                  <a href="#" className="hover:text-primary">
                    Khách hàng doanh nghiệp (B2B)
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Tuyển dụng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Điều khoản sử dụng
                  </a>
                </li>
              </ul>
              {/* Thay đổi text-gray-300 */}
              <h3 className="font-semibold text-sm md:text-base uppercase mb-3 text-gray-700">Đối tác sửa chữa & bảo hành</h3>
              <a href="#" title="CareCenter.vn">
                <img
                  src="https://cdn.dienthoaigiakho.vn/photos/1719201482724-CareCenter_Logo-Ngang.png"
                  alt="CareCenter.vn"
                  className="h-10 bg-blue-600 p-1 rounded"
                />
              </a>
            </div>
            {/* --- CỘT 4: KẾT NỐI MẠNG XÃ HỘI & THANH TOÁN --- */}
            <div className="text-xs sm:text-sm">
              {show_social_footer && (
                <>
                  <h3 className="font-semibold text-sm md:text-base uppercase mb-4 text-gray-700">Kết nối với chúng tôi</h3>
                  <div className="flex flex-wrap gap-2.5 mb-6">
                    {facebook_enabled && (
                      <a href="#" className="hover:opacity-80">
                        <img src="https://dienthoaigiakho.vn/icons/footer/icon-facebook.svg" alt="Facebook" className="w-8 h-8" />
                      </a>
                    )}
                    {instagram_enabled && (
                      <a href="#" className="hover:opacity-80">
                        <img src="https://dienthoaigiakho.vn/icons/footer/icon-instagram.svg" alt="Instagram" className="w-8 h-8" />
                      </a>
                    )}
                    {tiktok_enabled && (
                      <a href="#" className="hover:opacity-80">
                        <img src="https://dienthoaigiakho.vn/icons/footer/icon-tiktok.svg" alt="TikTok" className="w-8 h-8" />
                      </a>
                    )}
                    {youtube_enabled && (
                      <a href="#" className="hover:opacity-80">
                        <img src="https://dienthoaigiakho.vn/icons/footer/icon-youtube.svg" alt="YouTube" className="w-8 h-8" />
                      </a>
                    )}
                    {zalo_enabled && (
                      <a href="#" className="hover:opacity-80">
                        <img src="https://dienthoaigiakho.vn/icons/footer/icon-zalo.svg" alt="Zalo" className="w-8 h-8" />
                      </a>
                    )}
                  </div>
                </>
              )}

              <h3 className="font-semibold text-sm md:text-base uppercase mb-3 text-gray-700">Phương thức thanh toán</h3>
              <div className="flex flex-wrap gap-1.5 items-center mb-6">
                <img src="https://dienthoaigiakho.vn/icons/footer/visa.svg" alt="Visa" className="h-5" />
                <img src="https://dienthoaigiakho.vn/icons/footer/master.svg" alt="Mastercard" className="h-5" />
                <img src="https://dienthoaigiakho.vn/icons/footer/atm.svg" alt="ATM" className="h-5" />
                <img src="https://dienthoaigiakho.vn/icons/footer/alepay.svg" alt="VNPay" className="h-6" />
                <img src="https://dienthoaigiakho.vn/icons/footer/mpos.svg" alt="MPOS" className="h-6" />
              </div>

              <a href="#" title="Đã thông báo Bộ Công Thương">
                <img src="https://dienthoaigiakho.vn/icons/footer/bocngthuong.png" alt="Bộ Công Thương" className="h-10" />
              </a>
            </div>
          </div>
        </div>

        {/* --- CHÂN TRANG --- */}
        <div className="px-4 sm:px-6 md:px-8 lg:px-0">
          <div className="mt-8 pt-5 pb-2 border-t border-gray-300 text-xs text-gray-600">
            <p className="mb-1">
              © Công ty TNHH Giá Kho Group | Giấy CN ĐKDN số: 031669591 do Sở KHĐT TP. HCM cấp ngày 27/01/2021, đăng ký thay đổi lần 2, ngày 03/04/2023 - 0939 557 139 (Khối văn phòng)
            </p>
            <p className="mb-1">
              Trụ sở: {address} | Email:{' '}
              <a href={`mailto:${email_contact}`} className="text-primary hover:underline">
                {email_contact}
              </a>{' '}
              | Gọi mua hàng:{' '}
              <a href={`tel:${hotline}`} className="text-primary hover:underline">
                {hotline}
              </a>
            </p>
            <p>
              Chịu trách nhiệm nội dung: Vũ Viết Tuấn Anh | Email:{' '}
              <a href="mailto:ceo@giakho.vn" className="text-primary hover:underline">ceo@giakho.vn</a>
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;