import { LoaderFunctionArgs, replace } from 'react-router-dom';

const contentsLgTableSubFilterLoader = async ({ request }: LoaderFunctionArgs) => {
  let changed = false;
  const url = new URL(request.url);
  const size = url.searchParams.get('size');
  const page = url.searchParams.get('page');
  const subFilter = url.searchParams.get('subFilter');

  if (!size) {
    url.searchParams.set('size', '10');
    changed = true;
  }

  if (!page) {
    url.searchParams.set('page', '1');
    changed = true;
  }

  if (!subFilter) {
    url.searchParams.set('subFilter', 'MCT000');
    changed = true;
  }

  if (!changed) {
    return null;
  }
  return replace(url.toString());
};

export default contentsLgTableSubFilterLoader;
