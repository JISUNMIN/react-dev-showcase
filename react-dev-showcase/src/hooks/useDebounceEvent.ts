import { useMemo } from 'react';

import _ from 'lodash';

interface DebounceOptions {
  enabled: boolean;
  delay: number;
}

export const useDebounceEvent = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  handler?: T,
  debounce?: DebounceOptions
): T => {
  const debounceHandler = useMemo(() => {
    if (!handler || !debounce?.enabled) return handler;
    return _.debounce(handler, debounce.delay);
  }, [handler, debounce?.enabled, debounce?.delay]);

  return debounceHandler as T;
};

export default useDebounceEvent;
