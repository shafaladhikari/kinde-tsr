export const trimTrailingSlash = (url: string | undefined) => {
  if (!url) {
    return null;
  }
  return url.replace(/\/$/, '');
};

export const stringbool = (value: string | undefined) => {
  if (!value) {
    return false;
  }
  return value.toLowerCase() === 'true' || value.toLowerCase() === '1';
};
