import { LoaderFunctionArgs, redirect } from 'react-router-dom';

const tableLoader = async ({ request }: LoaderFunctionArgs) => {
  let changed = false;
  const url = new URL(request.url);
  const size = url.searchParams.get('size');
  const page = url.searchParams.get('page');

  if (!size) {
    url.searchParams.set('size', '10');
    changed = true;
  }

  if (!page) {
    url.searchParams.set('page', '1');
    changed = true;
  }

  if (!changed) {
    return null;
  }
  return redirect(url.toString());
};

export default tableLoader;
