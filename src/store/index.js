import { proxy } from 'valtio';

const state = proxy({
  intro: true,
  color: '#090908',
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: './Rocky.jpg', 
  fullDecal: './Rocky.jpg',
  backLogoDecal: './Rocky2.jpg',
  pocketLogoDecal: './Rocky2.jpg', // New pocket logo decal
});

export default state;