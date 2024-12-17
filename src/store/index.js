// store.jsx
import { proxy } from 'valtio';

const state = proxy({
  intro: false,
  color: '#090908',
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: './Rocky.jpg',
  fullDecal: './Rocky.jpg',
  backLogoDecal: './Rocky2.jpg',
  pocketLogoDecal: './Rocky2.jpg',
  logoText: '', // New state for logo text
  pocketLogoText: '', // New state for pocket logo text
  backLogoText: '', // New state for back logo text
});

export default state;
