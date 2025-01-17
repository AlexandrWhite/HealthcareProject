import { Button, Select, TextArea, TextInput, ThemeProvider } from "@gravity-ui/uikit";
import { useEffect, useState } from "react";
import {useParams,useNavigate} from 'react-router-dom'
import {Spin} from '@gravity-ui/uikit';
import {DisplayPulse} from '@gravity-ui/icons';

import axios from "axios";
import { AsideFallback, AsideHeader, PageLayout, Settings } from "@gravity-ui/navigation";
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

    const formatPhoneNumber = (number) => {
        const cleaned = ('' + number).replace(/\D/g, '');

        // Проверяем, что номер состоит из 10 цифр
        const match = cleaned.match(/^7?(\d{3})(\d{3})(\d{4})$/);
    
        if (match) {
            // Если номер начинается с 7, добавляем её отдельно
            return `+7 (${match[1]}) ${match[2]}-${match[3]}`;
        }
    };

    return (
        <ThemeProvider theme="light">
                {/* <AsideHeader compact={false} hideCollapseButton={true}
                    logo={{
                        text:curPatient['last_name']+" "+curPatient['first_name'] + " "+curPatient['patronym']
                    }}
                    
                    renderContent={(event) => {
                        return(

                            <h1>{JSON.stringify(event)}</h1>
                        )
                    }}

                    menuItems={[
                        {
                            id:"infoPatient",
                            title:"Информация о пациенте",
                            onItemClick(){
                                alert("Test")
                            }
                            
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
                
                </AsideHeader> */}



                <Settings title={curPatient['last_name']+" "+curPatient['first_name'] + " "+curPatient['patronym']} filterPlaceholder="Найти параметр" 
                emptyPlaceholder="Ничего">
                    <Settings.Group id="main" groupTitle="Параметры пациента">

                        <Settings.Page title="Информация о пациенте">
                            <Settings.Section title={curPatient['last_name']+" "+curPatient['first_name'] + " "+curPatient['patronym']}>
                                <Settings.Item title="Дата рождения">
                                    <p>{curPatient['birth_date']}</p>
                                </Settings.Item>
                                <Settings.Item title="Пол">
                                    <p>{curPatient['gender']}</p>
                                </Settings.Item>
                                <Settings.Item title="Социальный статус">
                                    <p>{curPatient['social_status']}</p>
                                </Settings.Item>
                                <Settings.Item title="Адрес проживания">
                                    <p>{curPatient['living_adress']}</p>
                                </Settings.Item>
                                <Settings.Item title="Адрес регистрации">
                                    <p>{curPatient['registration_adress']}</p>
                                </Settings.Item>
                                <Settings.Item title="Телефон">
                                    <p>
                                    {
                                        formatPhoneNumber(curPatient['phone_number'])
                                    }
                                    </p>
                                </Settings.Item>
                                <Settings.Item title="Номер страхового полиса">
                                    <p>{curPatient['insurance_number']}</p>
                                </Settings.Item>
                            </Settings.Section>
                        </Settings.Page>
                        

                        <Settings.Page title="Витальные параметры">
                                <Settings.Section title="">
                                    <Settings.Item title="Рост">
                                        <TextInput />
                                    </Settings.Item>

                                    <Settings.Item title="Вес">
                                        <TextInput />
                                    </Settings.Item>
                                    
                                    <Settings.Item title="Температура">
                                        <TextInput />
                                    </Settings.Item>
                                </Settings.Section>
                        </Settings.Page>

                    </Settings.Group>

                    <Settings.Group groupTitle="Опрос пациента">
                        <Settings.Page title="Опрос">
                            <Settings.Section title="">
                                <Settings.Item title="Наличие кровотечения">
                                    <Select width={170}>
                                        <Select.Option value="yes">Да</Select.Option>
                                        <Select.Option value="no">Нет</Select.Option>
                                    </Select>
                                </Settings.Item>

                                <Settings.Item title="Наличие на момент обследования восполительных заболеваний, онкологий">
                                    <Select width={170}>
                                        <Select.Option value="yes">Да</Select.Option>
                                        <Select.Option value="no">Нет</Select.Option>
                                    </Select>
                                </Settings.Item>

                                <Settings.Item title="Инфекции, переливание крови, отравление, интоксикация">
                                    <Select width={170}>
                                        <Select.Option value="yes">Да</Select.Option>
                                        <Select.Option value="no">Нет</Select.Option>
                                    </Select>
                                </Settings.Item>

                                <Settings.Item title="Результат ультразвукового исследования">
                                    <Select width={170}>
                                        <Select.Option value="yes">Отклонения есть</Select.Option>
                                        <Select.Option value="no">Отклонениий нет</Select.Option>
                                    </Select>
                                </Settings.Item>
                                
                                <Settings.Item>
                                    <Button view="outlined-success" children="Сохранить" size="l"/>
                                </Settings.Item>

                            </Settings.Section>
                        </Settings.Page>

                        <Settings title="Осмотр">
                            <Settings.Item title="">
                                <TextArea minRows={20}/>
                            </Settings.Item>
                            <Settings.Item title="">
                            <Button view="outlined-success" children="Сохранить" size="l"/>
                            </Settings.Item>
                        </Settings>
                    </Settings.Group>

                    

                </Settings>
        </ThemeProvider>
    )
}