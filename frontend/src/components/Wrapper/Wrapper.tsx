// import React from 'react';
import block from 'bem-cn-lite';
import {Button, Icon, TextInput, Theme, ThemeProvider} from '@gravity-ui/uikit';
import Cookies from 'js-cookie';

import './Wrapper.scss';

const b = block('wrapper');

const DARK = 'dark';
const LIGHT = 'light';
const DEFAULT_THEME = LIGHT;

export const DEFAULT_BODY_CLASSNAME = `g-root g-root_theme_${DEFAULT_THEME}`;

export type AppProps = {
    children: React.ReactNode;
};

import React, { useState, useEffect } from 'react';
import axios from 'axios';
const serverUrl = 'http://localhost:8000/'

export const Wrapper: React.FC<AppProps> = ({children}) => {
    const [isCsrf, setIsCsrf] = useState(null)
    const [isLogin, setIsLogin] = useState('')
    const [isPassword, setIsPassword] = useState('')
    const [isError, setIsError] = useState(null)
    const [isAuth, setIsAuth] = useState(false)
    const [username, setUsername] = useState('')
    const [userId, setUserId] = useState(null)

    const getCSRF = () => {
        axios.get(serverUrl + 'api/csrf/', { withCredentials: true })
        .then((res) => {
            const csrfToken = res.headers.get('X-CSRFToken')
            setIsCsrf(csrfToken)
        })
        .catch((err) => console.error(err))
    }

    // При первой загрузке страницы мы спрашиваем, авторизован ли пользователь
    useEffect(() => {
        get_session()
    }, [])

    const get_session = () => {
        alert("TOKEN SESSION: "+isCsrf);
        axios.get(serverUrl+"api/session/", {withCredentials:true})
        .then((res)=>{
            alert(JSON.stringify(res.data));
            if (res.data.isAuthenticated===false) {
                getCSRF()
            }
        })
    }

    const login = () => {
        alert("TOKEN: "+isCsrf);
        const data = { username: "vboxuser", password: "changeme123" }
        axios.post(serverUrl + "api/login/", data,
            {   
                withCredentials: true, 
                headers:{
                    "Content-Type": "application/json",
                    "X-CSRFToken": isCsrf,
                }
            }
        ).then((res)=>{
        
        }).catch((err)=>{
            alert(JSON.stringify(err.response.data));
        });
    }


    const logout = () => {
        alert("LOGOUT TOKEN "+isCsrf)
        axios.get(serverUrl + "api/logout/",
            {   
                withCredentials: true, 
                headers:{
                    "Content-Type": "application/json",
                    "X-CSRFToken": isCsrf,
                }
            }
        ).then((res)=>{
        })
    }





    function submitForm(event){
        event.preventDefault()
        login()
    }


    const [theme, setTheme] = React.useState<Theme>(DEFAULT_THEME);
    const isDark = theme === DARK;



    return (

        <ThemeProvider theme={theme}>
            <form>
                <TextInput type='text' placeholder='Логин'/>
                <TextInput type='password' placeholder='Пароль'/>
                <Button onClick={submitForm} children='Войти' view='action' width='max'/>
            </form>
            <Button onClick={logout} children='Выйти' view='outlined-info' width='max'/>
        </ThemeProvider>
    );
};
