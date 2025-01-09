import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
const serverUrl = 'http://localhost:8000/'


export const LoginProvider = ({children})=>{
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
        //alert("TOKEN SESSION: "+isCsrf);
        axios.get(serverUrl+"api/session/", {withCredentials:true})
        .then((res)=>{
            alert(JSON.stringify(res.data));
            if (res.data.isAuthenticated===false) {
                getCSRF()
            }
        })
    }
    
    const login = () => {
        //alert("TOKEN: "+isCsrf);
        const data = { username: isLogin, password: isPassword }
        axios.post(serverUrl + "api/login/", data,
            {   
                withCredentials: true, 
                headers:{
                    "Content-Type": "application/json",
                    "X-CSRFToken": isCsrf,
                }
            }
        ).then((res)=>{
            alert("Получилось войти");
        }).catch((err)=>{
            alert(JSON.stringify(err.response.data));
           
        });
    }
    
    
    const logout = () => {
        //alert("LOGOUT TOKEN "+isCsrf)
        alert("LOGIN PROVIDER")
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
}




