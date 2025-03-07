import { Button, Lang, Select, TextArea, TextInput, ThemeProvider } from "@gravity-ui/uikit";
import { useEffect, useState } from "react";
import {useParams,useNavigate} from 'react-router-dom'
import {Spin} from '@gravity-ui/uikit';
import {DisplayPulse} from '@gravity-ui/icons';
import { useRef } from 'react';

import {DatePicker} from '@gravity-ui/date-components';
import axios from "axios";
import { AsideFallback, AsideHeader, PageLayout, Settings } from "@gravity-ui/navigation";
const serverUrl = 'http://localhost:8000/'

import './PatientPage.scss';

import {dateTime, settings, UtcTimeZone} from '@gravity-ui/date-utils';
import { normalizeTimeZone } from "@gravity-ui/date-utils/build/timeZone";

// Locales management
settings.getLocale(); // default locale "en"
settings.loadLocale('ru').then(() => {
  settings.setLocale('ru');
  settings.getLocale(); // "de"
});

// Customization
settings.updateLocale({weekStart: 0}); // change first day of week

export const PatientPage: React.FC = () =>{
    const [curPatient,setCurPatient] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const [dummyState, setDummyState] = useState(null)

    const[Firstname, setFirstName] = useState('')
    const[Lastname, setLastName] = useState('')

    const { patientId } = useParams();
    const navigate = useNavigate();
    const myRef = useRef(null);

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

    const change_header = () =>{
        var headersOfSetting = document.getElementsByClassName("g-text g-text_variant_subheader-3 gn-title__text");
        if(headersOfSetting[1] !== undefined){
            
            for(const element of headersOfSetting){
                console.log(element.innerHTML);
            }
            console.log("end")
            //alert(headerOfSetting.innerHTML)
        }
    }

    const change_tap_style = () =>{
        const parent = document.querySelectorAll('[data-id="/main/tap"]');
        const allNestedElements = [];

        parent.forEach((element) => {
        const nestedElements = element.querySelectorAll('*');
            allNestedElements.push(...nestedElements); 
        });

        if (allNestedElements.length > 0){
            const span_el = allNestedElements[0]
            //span_el.style.color = "red";
            span_el.style.fontWeight = "bold";
            span_el.style.fontSize = "15px";
            //alert()
        }

// Output or use the collected nested elements
console.log(allNestedElements);
    }
    
    const test = (st) =>{
        
    }

    const hideFilter = () => {
        var filterElement = document.getElementsByClassName("gn-settings-search gn-settings__search");
        
        if (filterElement[0] !== undefined) {
            filterElement[0].style.display="none";
        }

        var group_header = document.getElementsByClassName("gn-settings-menu__group-heading");
        if (group_header[0] !== undefined) {
            group_header[0].style.display="none";
        }
    }



    useEffect(()=>{   
        getPatient()
        getInfo()
        hideFilter()
        change_header()
        change_tap_style()
    },[isLoading, dummyState])

    const formatPhoneNumber = (number) => {
        const cleaned = ('' + number).replace(/\D/g, '');

        // Проверяем, что номер состоит из 10 цифр
        const match = cleaned.match(/^7?(\d{3})(\d{3})(\d{4})$/);
    
        if (match) {
            // Если номер начинается с 7, добавляем её отдельно
            return `+7 (${match[1]}) ${match[2]}-${match[3]}`;
        }
    };


    const planStr = `Приём (осмотр, консультация) врача первичный

Жалобы

Анамнез заболевания

Анамнез жизни

Объективный статус

Диагноз основной (расшифровка)

Рекомендации назначения

Врач ${Lastname} ${Firstname} 
Дата ${dateTime()}
`;


return (
   
    <ThemeProvider theme="light">
        {isLoading ?(
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
        ):(
            <div ref={myRef}>
                <div className='header'>
                    <h1>Случай амбулаторного посещения №112345</h1>
                </div>
                <Settings title={curPatient['last_name']+" "+curPatient['first_name'] + " "+curPatient['patronym']} 
                onPageChange={test} showRightAdornmentOnHover={true}
                filterPlaceholder="Найти параметр">
    
                    <Settings.Group id="main" groupTitle="Параметры пациента">

                        <Settings.Page title="Информация о пациенте" >
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

                        <Settings.Page title="ТАП №112345" id="tap">
                            <Settings.Section title="">
                                <Settings.Item title="Дата и время приема">
                                    <DatePicker format="D MMM , YYYY H:mm" defaultValue={dateTime()}/>
                                </Settings.Item>
                                <Settings.Item title="Врач">
                                    <p>{Lastname} {Firstname}</p>
                                </Settings.Item>
                                <Settings.Item title="Отделение">
                                    <p>Гематология</p>
                                </Settings.Item>

                                <Settings.Item title="Основной диагноз">
                                    <Settings.Section title="">
                                        <div style={{ width:370, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: "10px" }}>
                                            <TextInput/>
                                            <Button children={"Поставить диагноз"} view="action"/>
                                        </div>
                                    </Settings.Section>                                
                                </Settings.Item>

                                <Settings.Item title="Характер заболевания">
                                    <Select width={370}>
                                        <Select.Option value="pain">Острое</Select.Option>
                                        <Select.Option value="first_time">Впервые в жизни установленное хроническое</Select.Option>
                                        <Select.Option value="early">Ранее установленное хроническое</Select.Option>
                                    </Select>
                                </Settings.Item>

                                <Settings.Item title="Состояние пациента">
                                    <Select width={370}>
                                        <Select.Option value="pain">Удовлетворительное</Select.Option>
                                        <Select.Option value="first_time">Средней тяжести</Select.Option>
                                        <Select.Option value="early">Тяжелое</Select.Option>
                                        <Select.Option value="pain">Крайне тяжелое</Select.Option>
                                        <Select.Option value="first_time">Клиническая смерть</Select.Option>
                                    </Select>
                                </Settings.Item>

                                <Settings.Item title="Клинический диагноз">
                                    <div style={{ width:370, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: "10px" }}>
                                        <TextInput/>
                                    </div>                                
                                </Settings.Item>
                                
                               
                                <Settings.Section title="Осмотр пациента">       
                                    <TextArea minRows={20} 
                                    defaultValue={planStr}/>
                                </Settings.Section>

                                <Button view="outlined-success" children="Закрыть случай" size="l"/>
                            </Settings.Section>
                        </Settings.Page>

                        <Settings.Page title="Опрос пациента">

                            <Settings.Section title="Витальные параметры">
                                <Settings.Item title="Рост">
                                    <TextInput/>
                                </Settings.Item>

                                <Settings.Item title="Вес">
                                    <TextInput/>
                                </Settings.Item>
                                
                                <Settings.Item title="Температура">
                                    <TextInput />
                                </Settings.Item>
                            </Settings.Section>

                            <Settings.Section title="Опрос">
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
                                
                            </Settings.Section>



                            
                        </Settings.Page>

                        
    {/* 
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
                        </Settings.Page> */}
                    
                    </Settings.Group>

                    {/* <Settings.Group groupTitle="ЭМК">

                        

                        <Settings.Page title="Осмотр">
                            <Settings.Section title="Осмотр пациента">       
                                <TextArea minRows={20} 
                                defaultValue={planStr}/>
                                <Button view="outlined-success" children="Сохранить" size="l"/>
                            </Settings.Section>
                        </Settings.Page>
                    </Settings.Group> */}

                    
                    {/* <Settings.Group groupTitle="Посещение пациента">
                        <Settings.Page title="Посещение">
                        <Settings.Section title="">
                            <Settings.Item title="Дата и время приема">
                                <DatePicker format="D MMM , YYYY H:mm" defaultValue={dateTime()}/>
                            </Settings.Item>
                            <Settings.Item title="Врач">
                                <p>{Lastname} {Firstname}</p>
                            </Settings.Item>
                            <Settings.Item title="Отделение">
                                <p>Гематология</p>
                            </Settings.Item>

                            <Settings.Item title="Основной диагноз">
                                <Settings.Section title="">
                                    <div style={{ width:370, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: "10px" }}>
                                        <TextInput/>
                                        <Button children={"Поставить диагноз"} view="action"/>
                                    </div>
                                </Settings.Section>                                
                            </Settings.Item>

                            <Settings.Item title="Характер заболевания">
                                <Select width={370}>
                                    <Select.Option value="pain">Острое</Select.Option>
                                    <Select.Option value="first_time">Впервые в жизни установленное хроническое</Select.Option>
                                    <Select.Option value="early">Ранее установленное хроническое</Select.Option>
                                </Select>
                            </Settings.Item>

                            <Settings.Item title="Состояние пациента">
                                <Select width={370}>
                                    <Select.Option value="pain">Удовлетворительное</Select.Option>
                                    <Select.Option value="first_time">Средней тяжести</Select.Option>
                                    <Select.Option value="early">Тяжелое</Select.Option>
                                    <Select.Option value="pain">Крайне тяжелое</Select.Option>
                                    <Select.Option value="first_time">Клиническая смерть</Select.Option>
                                </Select>
                            </Settings.Item>

                            <Settings.Item title="Клинический диагноз">
                                <div style={{ width:370, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: "10px" }}>
                                    <TextInput/>
                                </div>                                
                            </Settings.Item>
                            
                            <Button view="outlined-success" children="Закрыть случай" size="l"/>
                        </Settings.Section>
                        </Settings.Page>
                    </Settings.Group> */}
                </Settings>
            </div>  
        )}           
    </ThemeProvider>
);
}