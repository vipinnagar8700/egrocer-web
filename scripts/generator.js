const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const addPage = (page) => {
  const path = page
    .replace('src/pages/', '')
    .replace('.js', '')
    .replace('.mdx', '')
    .replace('.jsx', '')
    .replace('.ts', '')
    .replace('.tsx', '')
    .replace('index', '')
    .replace('indexx', "")
    .replace('x', "")
    .replace('/x', "");

  const route = path === '/index' ? '' : path;
  const cleanRoute = route.endsWith('/') ? route.slice(0, -1) : route;

  return `  <url>
    <loc>${`${process.env.NEXT_PUBLIC_BASE_URL}/${cleanRoute}`}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>`;
};

const generateSitemap = async () => {
  const { globby } = await import('globby');

  // excludes Next.js files and API routes
  const pages = await globby([
    'src/pages/**/*{.js,.jsx,.ts,.tsx,.mdx}',
    '!src/pages/_*.js',
    '!src/pages/api',
    '!src/pages/_*.jsx',
  ]);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(addPage).join('\n')}
  </urlset>`;
  fs.writeFileSync('public/sitemap.xml', sitemap);

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
  const messagingTemplate = fs.readFileSync("./templates/firebase-messaging-template.js", 'utf-8');

  const messagingFile = messagingTemplate.replace(/FIREBASE_API_KEY/g, firebaseConfig.apiKey)
    .replace(/FIREBASE_AUTH_DOMAIN/g, firebaseConfig.authDomain)
    .replace(/FIREBASE_PROJECT_ID/g, firebaseConfig.projectId)
    .replace(/FIREBASE_STORAGE_BUCKET/g, firebaseConfig.storageBucket)
    .replace(/FIREBASE_MESSAGING_SENDER_ID/g, firebaseConfig.messagingSenderId)
    .replace(/FIREBASE_APP_ID/g, firebaseConfig.appId)
    .replace(/FIREBASE_MEASUREMENT_ID/g, firebaseConfig.measurementId);

  fs.writeFileSync("./public/firebase-messaging-sw.js", messagingFile);
};

generateSitemap();
