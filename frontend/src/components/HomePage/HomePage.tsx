import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Button, ThemeProvider, User, UserLabel, Tooltip, ArrowToggle, Icon } from '@gravity-ui/uikit';
import {CircleQuestion} from '@gravity-ui/icons';
import { AuthContext } from '../../AppContexts/AppContext';
import { redirect, useNavigate } from 'react-router-dom';

import './HomePage.scss';

import axios from "axios";
const serverUrl = 'http://localhost:8000/'


export const HomePage: React.FC = () => {
   

    const [isCsrf, setIsCsrf] = useState(null)
    const [Login, setLogin] = useState('')

    const [isAuth, setIsAuth] = useState(null)

    const[Firstname, setFirstName] = useState('')
    const[Lastname, setLastName] = useState('')

    const navigate = useNavigate();

    const getCSRF = () => {
        axios.get(serverUrl + 'api/csrf/', { withCredentials: true })
        .then((res) => {
            const csrfToken = res.headers.get('X-CSRFToken')
            setIsCsrf(csrfToken)
        })
        .catch((err) => console.error(err))
    }

    const get_session = () => {
        //alert("TOKEN SESSION: "+isCsrf);
        axios.get(serverUrl+"api/session/", {withCredentials:true})
        .then((res)=>{
            // alert(JSON.stringify(res.data));
            if (res.data.isAuthenticated) {
                setLogin(res.data['username'])
            }else{
                navigate('/login')
            }
        })
    }

    const logout = () => {
        //alert("LOGOUT TOKEN "+isCsrf)
        axios.get(serverUrl + "api/logout/",
            {   
                withCredentials: true, 
                headers:{
                    "Content-Type": "application/json",
                    "X-CSRFToken": isCsrf,
                }
            }
        ).then((res)=>{
            // alert("Разлогинился")
            navigate('/login')
        })
    }

    const getInfo = () =>{
        axios.get(serverUrl + 'api/user_info/', {
            withCredentials:true,
            headers : {
                "Content-Type": "application/json",
            },
        })
        .then((res)=>{
            // alert(JSON.stringify(res.data))
            setFirstName(res.data['firstname'])
            setLastName(res.data['lastname'])
        })
    }

    // function logout(){
    //     navigate('/login/')
    // }


    useEffect(() => {
        const checkAuthorization = async () => {
            const response = await axios.get(serverUrl+"api/session/", {withCredentials:true});
            setLogin(response.data.username)
            setIsAuth(response.data.isAuthenticated)
        }
        checkAuthorization()
    }, [])

    if(isAuth === null){
        return null 
    }

    if(isAuth === false){
        navigate('/login')
    }

    getInfo()

    return(   
        <ThemeProvider theme='light'>
            <div>
               
                
                <nav className="navbar">
                    <div className="navbar-left">

                        <div>    
                            <div className='arrow-list'>
                                <p>АРМ врача поликлиники</p>
                                <ArrowToggle direction='right'/>
                                <p>МО1</p>
                                <ArrowToggle direction='right'/>
                                <p>Гематология поликлиника</p>
                                <ArrowToggle direction='right'/>
                                <p>Врач</p>
                            </div> 

                        
                        </div> 
                    
                    </div>

                    <div className="navbar-right">
                        <div>
                            <UserLabel type="person">{Lastname} {Firstname} </UserLabel>
                        </div>
                        <div>
                            <Button view='outlined-danger' size='m' children='Выйти' onClick={logout}/>
                        </div>
                        <div>
                            <Tooltip content="Справка">
                                <Button view='outlined-action'>
                                    <Icon data={CircleQuestion}/>
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </nav>
                <h1>Привет {Firstname} {Lastname}</h1>

            </div>
        </ThemeProvider>
    )
}