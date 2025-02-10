import { Button, Select, TextArea, TextInput, ThemeProvider } from "@gravity-ui/uikit";
import { useEffect, useState } from "react";
import {useParams,useNavigate} from 'react-router-dom'
import {Spin} from '@gravity-ui/uikit';
import {DisplayPulse} from '@gravity-ui/icons';
import {dateTimeParse, dateTime} from '@gravity-ui/date-utils';
import {DatePicker} from '@gravity-ui/date-components';
import axios from "axios";
import { AsideFallback, AsideHeader, PageLayout, Settings } from "@gravity-ui/navigation";

const serverUrl = 'http://localhost:8000/'


export const PatientPage: React.FC = () =>{
    const [curPatient,setCurPatient] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    
    const[Firstname, setFirstName] = useState('')
    const[Lastname, setLastName] = useState('')



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

    useEffect(()=>{
        getPatient()
        getInfo()
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

                
               
               
                <Settings title={curPatient['last_name']+" "+curPatient['first_name'] + " "+curPatient['patronym']} 
                filterPlaceholder="Найти параметр"
                emptyPlaceholder="Ничего не найдено">

                    

                    
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
                        
                    </Settings.Group>
                    



                    <Settings.Group id="emk" groupTitle="ЭМК">
                        <Settings.Page title="Опрос">

                            <Settings.Section title="Витальные параметры">
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
                            
                            <Settings.Section title="Опрос">
                                <Settings.Item title="Наличие кровотечения">
                                        <Select width={320}>
                                            <Select.Option value="yes">Да</Select.Option>
                                            <Select.Option value="no">Нет</Select.Option>
                                        </Select>
                                    </Settings.Item>

                                    <Settings.Item title="Наличие на момент обследования восполительных заболеваний, онкологий">
                                        <Select width={320}>
                                            <Select.Option value="yes">Да</Select.Option>
                                            <Select.Option value="no">Нет</Select.Option>
                                        </Select>
                                    </Settings.Item>

                                    <Settings.Item title="Инфекции, переливание крови, отравление, интоксикация">
                                        <Select width={320}>
                                            <Select.Option value="yes">Да</Select.Option>
                                            <Select.Option value="no">Нет</Select.Option>
                                        </Select>
                                    </Settings.Item>

                                    <Settings.Item title="Результат ультразвукового исследования">
                                        <Select width={320}>
                                            <Select.Option value="yes">Отклонения есть</Select.Option>
                                            <Select.Option value="no">Отклонениий нет</Select.Option>
                                        </Select>
                                    </Settings.Item>

                                    <Settings.Item title="Наследственность">
                                        <Select width={320}>
                                            <Select.Option value="d564">D56.4 Наследственное персистирование фетального гемоглобина [НПФГ]</Select.Option>
                                            <Select.Option value="d573">D57.3 Носительство признака серповидно-клеточности</Select.Option>
                                            <Select.Option value="d580">D58.0 Наследственный сфероцитоз</Select.Option>
                                            <Select.Option value="d581">D58.1 Наследственный эллиптоцитоз</Select.Option>
                                            <Select.Option value="d588">D58.8 Другие уточненные наследственные гемолитические анемии</Select.Option>
                                            <Select.Option value="d589">D58.9 Наследственная гемолитическая анемия неуточненная</Select.Option>
                                        </Select>
                                    </Settings.Item>

                            </Settings.Section>

                            <Settings.Section title="Осмотр">
                                <Settings.Item title="">
                                    <TextArea minRows={10}/>
                                </Settings.Item>
                                
                                <Button size="xl" view="outlined-success">Сохранить</Button>
                            
                            </Settings.Section>

                        </Settings.Page>
                    </Settings.Group>


                    <Settings.Group id="arrival" groupTitle="Посещение">
                        
                        <Settings.Section title="Посещение пациента">
                            <Settings.Item title="Дата и время приема">
                                {/* <TextInput></TextInput> */}
                                <DatePicker/>
                                {/* <DateField></DateField> */}
                            </Settings.Item>

                            <Settings.Item title="Врач">
                                <p>{Lastname} {Firstname}</p>
                            </Settings.Item>

                            <Settings.Item title="Отделение">
                                <p>Гематология</p>
                            </Settings.Item>

                            <Settings.Item title="Характер заболевания">
                                <Select width={320}>
                                    <Select.Option value="pain">Острое</Select.Option>
                                    <Select.Option value="first_time">Впервые в жизни установленное хроническое</Select.Option>
                                    <Select.Option value="chronic">Ранее установленное хроническое</Select.Option>
                                </Select>
                            </Settings.Item>

                            <Settings.Item title="Состояние пациента">
                                <Select width={320}>
                                    <Select.Option value="1">Удовлетворительное</Select.Option>
                                    <Select.Option value="2">Средней тяжести</Select.Option>
                                    <Select.Option value="3">Тяжелое</Select.Option>
                                    <Select.Option value="4">Крайне тяжелое</Select.Option>
                                    <Select.Option value="5">Клиническая смерть</Select.Option>
                                    
                                </Select>
                            </Settings.Item>

                            <Settings.Item title="Основной диагноз">
                                <Select width={320}>
                                    <Select.Option value="1">Удовлетворительное</Select.Option>
                                    <Select.Option value="2">Средней тяжести</Select.Option>
                                    <Select.Option value="3">Тяжелое</Select.Option>
                                    <Select.Option value="4">Крайне тяжелое</Select.Option>
                                    <Select.Option value="5">Клиническая смерть</Select.Option>
                                </Select>
                            </Settings.Item>

                            <Settings.Item title="Клинический диагноз">
                                <TextInput/>
                            </Settings.Item>
                            
                           
                        </Settings.Section>
                       
                    </Settings.Group>

                </Settings>

                      
                    

                    

               
        </ThemeProvider>
    )
}