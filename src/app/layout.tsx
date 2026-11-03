import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: {
    default: '池边影の影视小站',
    template: '%s - 池边影の影视小站',
  },
  description:
    '池边影の影视小站提供多源影视聚合搜索与在线观看服务，支持手机和电脑访问。',
  manifest: '/manifest.webmanifest',
  // 图标沿用 stillshadow.com 标识，并加入 TV 字样；同一张 SVG 导出多尺寸 + favicon.ico 兜底。
  // 只声明单张 512 时，抓取端只能拿大图缩放，小尺寸下易糊、看起来「没填满」。
  icons: {
    icon: [
      { url: '/favicon-tv.ico', sizes: '48x48' },
      { url: '/icons/icon-tv-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/icon-tv-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-tv-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon-tv.png', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#0b101a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 首屏前同步主题，避免亮暗闪烁 */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('libretv-theme')||'dark';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})()",
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
