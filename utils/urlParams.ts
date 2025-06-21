/**
 * Extract URL parameter value by key
 * @param key - The parameter key to extract
 * @returns The parameter value or null if not found
 */
export const getUrlParameter = (key: string): string | null => {
  if (typeof window === 'undefined') {
    console.log('getUrlParameter: window is undefined'); // Debug log
    return null;
  }
  
  console.log('getUrlParameter: current URL search:', window.location.search); // Debug log
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(key);
  console.log(`getUrlParameter: ${key} = ${value}`); // Debug log
  return value;
};

/**
 * Set URL parameter without page reload
 * @param key - The parameter key
 * @param value - The parameter value
 */
export const setUrlParameter = (key: string, value: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set(key, value);
  
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  window.history.replaceState(null, '', newUrl);
};

/**
 * Remove URL parameter
 * @param key - The parameter key to remove
 */
export const removeUrlParameter = (key: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.delete(key);
  
  const newUrl = urlParams.toString() 
    ? `${window.location.pathname}?${urlParams.toString()}`
    : window.location.pathname;
    
  window.history.replaceState(null, '', newUrl);
};