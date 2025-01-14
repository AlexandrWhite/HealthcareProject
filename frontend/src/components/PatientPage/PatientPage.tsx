import { ThemeProvider } from "@gravity-ui/uikit";
import { useEffect, useState } from "react";
import {useParams,useNavigate} from 'react-router-dom'
import {Spin} from '@gravity-ui/uikit';

import axios from "axios";
const serverUrl = 'http://localhost:8000/'


export const PatientPage: React.FC = () =>{
    const [curPatient,setCurPatient] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const { patientId } = useParams();
    const navigate = useNavigate();

    const getPatient = () =>{
        axios.get(serverUrl+'/api/patient/'+patientId,{
            withCredentials:true
        })
        .then((res)=>{
            setCurPatient(res.data)
            setIsLoading(false)
        })
        .catch((err)=>{
            alert(err.data)
            navigate('/login')

        })
    }

    useEffect(()=>{
        getPatient()
    },[])

    if(isLoading){
        return(
            <ThemeProvider theme="light">
                <div style={
                    {
                        top:'50%',
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center',
                        height:'100%'
                    }
                }>
                    <Spin size="xl"/>
                </div>
            </ThemeProvider>
        )
    }

    return (
        <ThemeProvider theme="light">
            <h1>{curPatient['last_name']+" "+curPatient['first_name'] + " "+curPatient['patronym']}</h1>
        </ThemeProvider>
    )
}