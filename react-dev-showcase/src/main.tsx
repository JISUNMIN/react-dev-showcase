import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import ReactDOM from 'react-dom/client';

// import { ModalProvider } from '@hooks/useModal';
// import { ISDEV } from '@libs/Environment.ts';
// import ThemeProviderWrapper from '@src/providers/ThemeProviderWrapper.tsx';
// import GlobalStyles from '@src/styles/GlobalStyles.ts';

// import App from './App.tsx';

// const queryClient = new QueryClient();

// const init = async (): Promise<JSX.Element | null> => {
//   if (!ISDEV) {
//     return null;
//   }

//   // Dynamic import dev환경에서만 import 실행하여 배포환경 성능저해 방지
//   // ReactQueryDevtools 가 vite config 쪽 무언가와 충돌하는 것 같음. 그래서 production.js 직접 import 해서 가져옴.
//   // story book환경에서 ReactQueryDevtools는 정상동작함 bundling 하는 주체가 다른건지 공식문서대로 import 가능함
//   const ReactQueryDevtoolsVite = await import('@tanstack/react-query-devtools/build/modern/production.js').then(
//     (d) => ({
//       default: d.ReactQueryDevtools,
//     })
//   );
//   const ReactQueryDevtools = ReactQueryDevtoolsVite.default;
//   // const { worker } = await import('./mocks/browser.ts');

//   // await worker.start();

//   return <ReactQueryDevtools initialIsOpen={true} />;
// };

// init().then((devtools) => {
//   ReactDOM.createRoot(document.getElementById('root')!).render(
//     <QueryClientProvider client={queryClient}>
//       <ThemeProviderWrapper>
//         <ModalProvider>
//           <GlobalStyles />
//           <App />
//           {devtools}
//         </ModalProvider>
//       </ThemeProviderWrapper>
//     </QueryClientProvider>
//   );
// });
