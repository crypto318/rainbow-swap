import {TonConnectUIProvider} from '@tonconnect/ui-react';
import React from 'react';
import {createRoot} from 'react-dom/client';

import App from './App';
import {ContextProvider} from './context/ContextProvider';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <React.StrictMode>
        <TonConnectUIProvider manifestUrl="https://musical-licorice-e034aa.netlify.app/tonconnect-manifest.json">
            <ContextProvider>
                <App />
            </ContextProvider>
        </TonConnectUIProvider>
    </React.StrictMode>
);
