export const debounce = (callback: () => void, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>;

  const debounced = () => {
    clearTimeout(timeout);

    timeout = setTimeout(callback, delay);
  };

  debounced.cancel = () => {
    clearTimeout(timeout);
  };

  return debounced;
};

