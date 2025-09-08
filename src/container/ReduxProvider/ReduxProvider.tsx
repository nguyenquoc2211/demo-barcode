'use client';

import { Provider } from 'react-redux';
import { store } from 'docker-manager-web/store'; // đường dẫn tới store của bạn


export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
