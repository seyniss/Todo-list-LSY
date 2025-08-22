import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 예: http://localhost:3000
  withCredentials: true,                 // 쿠키 포함
});

// 401이면 게스트 로그인 시도 후 재시도 (옵션: 깔끔함)
let isAuthing = false;
api.interceptors.response.use(
  r => r,
  async (err) => {
    if (err?.response?.status === 401 && !isAuthing) {
      try {
        isAuthing = true;
        await ensureGuestAuth();                  // 아래 함수
        isAuthing = false;
        // 원래 요청 재시도
        return api.request(err.config);
      } catch (e) {
        isAuthing = false;
      }
    }
    return Promise.reject(err);
  }
);

// 게스트 인증 (한 번만 수행)
export async function ensureGuestAuth() {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    // 브라우저 지원 시
    deviceId = (crypto?.randomUUID && crypto.randomUUID()) ||
      Math.random().toString(36).slice(2);
    localStorage.setItem('deviceId', deviceId);
  }
  await api.post('/api/auth/guest', { deviceId }); // 쿠키 내려옴
}
