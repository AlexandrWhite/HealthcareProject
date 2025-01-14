import { ThemeProvider } from "@gravity-ui/uikit";
import { useEffect, useState } from "react";
import {useParams,useNavigate} from 'react-router-dom'
import {Spin} from '@gravity-ui/uikit';
import {DisplayPulse} from '@gravity-ui/icons';

import axios from "axios";
import { AsideHeader, Settings } from "@gravity-ui/navigation";
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
            {/* <Settings filterPlaceholder="Найти параметр" 
            title={curPatient['last_name']+" "+curPatient['first_name'] + " "+curPatient['patronym']}>
                <Settings.Group groupTitle="Test">
                    <Settings.Page title="MyTest">
                        ...
                    </Settings.Page>
                </Settings.Group>
            </Settings> */}
            <AsideHeader compact={false} hideCollapseButton={true}
                logo={{
                    text:curPatient['last_name']+" "+curPatient['first_name'] + " "+curPatient['patronym']
                }}
                menuItems={[
                    {
                        id:"infoPatient",
                        title:"Информация о пациенте",
                    },
                    {
                        id:"vitalParams",
                        title:"Витальные параметры",
                    },
                    {
                        id: 'divider',
                        title: '-',
                        type: 'divider',
                    },
                    {
                        id:"diagnos",
                        title:"Поставить диагноз",
                        type:'action',
                        icon:DisplayPulse,
                        onItemClick(){
                            alert("Куда жмешь?")
                        }
                    }
                ]}
            >
            </AsideHeader>
        </ThemeProvider>
    )
}