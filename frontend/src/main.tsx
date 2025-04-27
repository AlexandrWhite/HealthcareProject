import React from 'react';
import ReactDOM from 'react-dom/client';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import './styles.css';
import './styles/globals.scss';
import App from './App';
import { Toaster, ToasterComponent, ToasterProvider } from '@gravity-ui/uikit';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const toaster = new Toaster();

root.render(
    // <React.StrictMode>
    //     <App />
    // </React.StrictMode>,   
    <App/>
);
