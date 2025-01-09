import { useEffect, useState } from "react";
import { Button, ThemeProvider, Table, withTableActions,ArrowToggle, Icon, RenderRowActionsProps} from '@gravity-ui/uikit';
import { TextInput, UserLabel, Tooltip} from "@gravity-ui/uikit";
import {CircleQuestion} from '@gravity-ui/icons';
import { useNavigate } from 'react-router-dom';
import {Magnifier} from '@gravity-ui/icons';

import './HomePage.scss';

import axios from "axios";
const serverUrl = 'http://localhost:8000/'


export const HomePage: React.FC = () => {
   

    const [isCsrf, setIsCsrf] = useState(null)
    const [Login, setLogin] = useState('')

    const [isAuth, setIsAuth] = useState(null)

    const[Firstname, setFirstName] = useState('')
    const[Lastname, setLastName] = useState('')
    const[Patients, setPatients] = useState([])

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

    const getRowActions = () => {
        return [
          {
            text: 'Принять',
            handler: () => {
                alert("Принято")
            },
          },
        ];
      };
      

    const MyTable = withTableActions(Table);
    const RowAction = ({item}: RenderRowActionsProps<Item>) => {
        const handleAcceptButton = () => {
            alert(`Принимаю : ${item.first_name}`);
        }
        return <Button onClick={handleAcceptButton}>{`Принять`}</Button>;
    };

    const columns = [
        {
            name: "Фамилия", 
            id: 'last_name'
        },
        {
            name: "Имя", 
            id: 'first_name'
        },
        {
            name:"Отчество",
            id: 'patronym'
        },
        {
            name:"Дата рождения",
            id: 'birth_date'
        }
    ];

    const getPatients = () =>{
        
        axios.get(serverUrl + 'api/patients', {
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
            },
        })
        .then((res)=>{
            //setPatients(JSON.stringify(res.data))
            setPatients(res.data)
        })
        
    }

    useEffect(() => {
        const checkAuthorization = async () => {
            const response = await axios.get(serverUrl+"api/session/", {withCredentials:true});
            setLogin(response.data.username)
            setIsAuth(response.data.isAuthenticated)
        }
        checkAuthorization()
        getPatients()
    }, [])

    if(isAuth === null){
        return null 
    }

    if(isAuth === false){
        navigate('/login')
    }



    if(isAuth === true){
        getInfo()
    }

   

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

                <div className="journal">
                    <div className='search-element'>
                        <div className='search-input'>
                            <TextInput size='l' placeholder='ФИО пациента'/>
                        </div>
                        <Button view="outlined-action" size="l">
                            <Icon data={Magnifier} size={18} />
                            Найти
                        </Button>
                    </div>
                    <MyTable data={Patients} columns={columns} renderRowActions={RowAction} getRowActions={getRowActions}/>
                </div>
            </div>
        </ThemeProvider>
    )
}