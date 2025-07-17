import axios from 'axios';

const PUBLIC_VAPID_KEY = 'YOUR_PUBLIC_VAPID_KEY'; // Thay bằng key bạn đã tạo

export async function subscribeUser() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('✅ SW registered');

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('❌ Không cấp quyền thông báo');
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });

      await axios.post('/api/client/push/subscribe', subscription);
      console.log('✅ Đã gửi subscription về server');
    } catch (error) {
      console.error('❌ Lỗi khi đăng ký push:', error);
    }
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  return new Uint8Array([...raw].map((c) => c.charCodeAt(0)));
}
