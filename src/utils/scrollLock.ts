export const lockScroll = () => {
  const scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';
  document.documentElement.style.overflow = 'hidden';
  document.body.dataset.scrollY = String(scrollY);
};

export const unlockScroll = () => {
  const scrollY = document.body.dataset.scrollY || '0';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  document.documentElement.style.overflow = '';
  window.scrollTo(0, parseInt(scrollY));
};
