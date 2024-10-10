import { useCallback } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

type GetAllQueryParamsType<T> = () => Map<keyof T, string>;
type GetFilteredQueryParams<T> = (blackList?: string[]) => Map<keyof T, string>;

const useQueryParams = <T>() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const getQueryParam = useCallback((key: keyof T) => searchParams.get(key as string), [searchParams]);

  const getAllQueryParams = useCallback<GetAllQueryParamsType<T>>(
    () => new Map(searchParams.entries()) as Map<keyof T, string>,
    [searchParams]
  );

  const getFilteredQueryParams = useCallback<GetFilteredQueryParams<T>>(
    (blackList) => {
      const filteredParams = getAllQueryParams();

      if (!blackList) {
        return filteredParams;
      }

      blackList.forEach((key) => {
        filteredParams.delete(key as keyof T);
      });

      return filteredParams;
    },
    [getAllQueryParams]
  );

  const setQueryParam = useCallback<(key: keyof T, value: string, replace?: boolean) => void>(
    (key, value, replace) => {
      searchParams.set(key.toString(), value);
      replace ? setSearchParams(searchParams, { replace: true }) : setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

  const deleteParam = (key: string) => {
    searchParams.delete(key);
    navigate({ search: searchParams.toString() });
  };

  const resetParam = () => {
    const url = new URL(window.location.href);
    url.search = '';
    window.history.replaceState({}, '', url);
  };

  return { getQueryParam, getAllQueryParams, getFilteredQueryParams, setQueryParam, deleteParam, resetParam };
};

export default useQueryParams;

/*
// NOTE 필요한 부분 합치기
import { useCallback, useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

type SearchParams = {
  [key: string]: string | number | undefined;
};

const useSearchParams = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState(new URLSearchParams(location.search));

  const setParam = (key: string, value: string | number) => {
    searchParams.set(key, String(value));
    navigate({ search: searchParams.toString() });
  };

  const getParam = (key: string) => {
    return searchParams.get(key);
  };

  const getParams = () => {
    return Object.fromEntries(searchParams.entries());
  };

  const addParamIfExists = (param: SearchParams, key: string, value: string | number | null | undefined) => {
    if (value !== null && value !== undefined) {
      return { ...param, [key]: value };
    }
    return param;
  };

  const createParams = (paramsObj: SearchParams) => {
    return Object.entries(paramsObj).reduce((param, [key, value]) => {
      return addParamIfExists(param, key, value);
    }, {});
  };

  const getSearchParamsObject = useCallback((): SearchParams => {
    const searchParamObj: SearchParams = {
      page: getParam('page') ? Number(getParam('page')) - 1 : 0,
      size: getParam('size') ? Number(getParam('size')) : 10,
      sortColumn: getParam('sortColumn') ?? undefined,
      sortDirection: getParam('sortDirection') ?? undefined,
      startDate: getParam('startDate') ?? undefined,
      endDate: getParam('endDate') ?? undefined,
    };
    return createParams(searchParamObj);
  }, [searchParams]);

  useEffect(() => {
    setSearchParams(new URLSearchParams(location.search));
  }, [location.search]);

  return { searchParams, setParam, getParam, getParams, getSearchParamsObject };
};

export default useSearchParams;
*/
