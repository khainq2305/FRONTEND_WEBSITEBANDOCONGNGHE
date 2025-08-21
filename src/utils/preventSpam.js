import { toast } from "react-toastify";

const lastClicks = {};
const lastToasts = {};


/** 
 * @Đọc_kỹ_hướng_dẫn_nha
 * 
 * 
 * @param {*} type muốn đặt gì cũng được ví dụ preventSpam((select_all))
 * @param {*} delay mặc định là 1000 = 1giây, tùy chỉnh số giây preventSpam((select_all, 5000))
 * @param {*} toastDelay mặc định 4 giây, cho nó chạy hết thời gian rồi mới hiện toast mới, tránh hiện spam toast
 */

export function preventSpam(type = 'default', delay = 1000, toastDelay = 4000) {
  const now = Date.now();
  if (!lastClicks[type]) lastClicks[type] = 0;
  if (!lastToasts[type]) lastToasts[type] = 0;

  const elapsed = now - lastClicks[type];

  if (elapsed < delay) {
    const timeLeft = Math.ceil((delay - elapsed) / 1000);
    if (now - lastToasts[type] > toastDelay) {
      toast.warning(`Bạn thao tác quá nhanh! Vui lòng chờ khoảng ${timeLeft} giây nữa.`);
      lastToasts[type] = now;
    }
    return true; // bị chặn
  }

  lastClicks[type] = now;
  return false; // được phép
}
