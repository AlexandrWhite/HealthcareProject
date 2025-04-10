import { Button, eventBroker, Lang, Modal, Select, TextArea, TextInput, ThemeProvider } from "@gravity-ui/uikit";
import { useEffect, useState } from "react";
import {useParams,useNavigate, data} from 'react-router-dom'
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
import { ValidTextInput } from "../ValidTextInput/ValidTextInput";

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
    const [isCsrf, setIsCsrf] = useState(null)

    const[Firstname, setFirstName] = useState('')
    const[Lastname, setLastName] = useState('')
    const [open, setOpen] = useState(false);

    const { patientId } = useParams();
    const navigate = useNavigate();
    const myRef = useRef(null);


    const [inputWeight, setInputWeight] = useState<string|undefined>(undefined);
    function handleWeightChange (text: string) {
        setInputWeight(text);
    };

    const [inputHeight, setInputHeight] = useState<string|undefined>(undefined);
    function handleHeightChange (text: string) {
        setInputHeight(text);
    };

    const [inputTemperature, setInputTemperature] = useState<string|undefined>(undefined);
    function handleTemperatureChange (text: string) {
        setInputTemperature(text);
    };

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

    const getCSRF = () => {
        axios.get(serverUrl + 'api/csrf/', { withCredentials: true })
        .then((res) => {
            const csrfToken = res.headers.get('X-CSRFToken')
            setIsCsrf(csrfToken)
        })
        .catch((err) => console.error(err))
    }


    const getPredict = () => {
        axios.get(serverUrl+'api/diagnose_predict/', {
            params: {
                "pol" : curPatient['gender'],
                "ves" : inputWeight
            }
        }).then((res)=>{
            alert(JSON.stringify(res))
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

    function onPredictClick(e){
        alert(curPatient['gender'])
        getPredict()
    }



    useEffect(()=>{   
        getPatient()
        getInfo()
        hideFilter()
        change_header()
        change_tap_style()
        // get_session()
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
                 showRightAdornmentOnHover={true}
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
                                    {formatPhoneNumber(curPatient['phone_number'])}
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
                                
                                <Settings.Section title="Осмотр пациента">       
                                    <TextArea minRows={20} 
                                    defaultValue={planStr}/>
                                </Settings.Section>

                                <Settings.Item title="Лабораторные исследования">    
                                    <Button view="outlined-info" onClick={() => setOpen(true)}>
                                        Открыть
                                    </Button>

                                    <Modal open={open} onClose={() => setOpen(false)}>
                                    <table id="results-table">
                                        <tr>
                                            <th>Код</th>
                                            <th>Наименование лабораторного исследования</th>
                                            <th>Референсные измерения</th>
                                            <th>Ед. измерения</th>
                                            <th>Результат</th>
                                            <th>Дата исследования</th>
                                        </tr>
                                        <tr>
                                            <td>A09.05.003</td>
                                            <td>Исследование уровня общего гемоглобина в крови</td>
                                            <td>120-140 (ж), 135-160 (м)</td>
                                            <td>г/л</td>
                                            <td>—</td>
                                            <td>—</td>
                                        </tr>
                                        <tr>
                                            <td>A12.05.118</td>
                                            <td>Исследование уровня эритроцитов в крови</td>
                                            <td>3,9-4,7 (ж), 4-5 (м)</td>
                                            <td>*10^12/л</td>
                                            <td>—</td>
                                            <td>—</td>
                                        </tr>
                                        <tr>
                                            <td>A12.05.119</td>
                                            <td>Исследование уровня лейкоцитов в крови</td>
                                            <td>4-9</td>
                                            <td>*10^9/л</td>
                                            <td>—</td>
                                            <td>—</td>
                                        </tr>
                                        <tr>
                                            <td>A12.05.120</td>
                                            <td>Исследование уровня тромбоцитов в крови</td>
                                            <td>150-400</td>
                                            <td>*10^9/л</td>
                                            <td>—</td>
                                            <td>—</td>
                                        </tr>
                                        <tr>
                                            <td>A12.05.117</td>
                                            <td>Оценка гематокрита</td>
                                            <td>36-42 (ж), 40-54 (м)</td>
                                            <td>%</td>
                                            <td>—</td>
                                            <td>—</td>
                                        </tr>
                                        <tr>
                                            <td>A09.05.282.001</td>
                                            <td>Определение среднего содержания гемоглобина в эритроцитах (MCH)</td>
                                            <td>24-34</td>
                                            <td>пг</td>
                                            <td>—</td>
                                            <td>—</td>
                                        </tr>
                                        <tr>
                                            <td>A09.05.282.002</td>
                                            <td>Средняя концентрация гемоглобина в эритроцитах (MCHC)</td>
                                            <td>300-380</td>
                                            <td>г/л</td>
                                            <td>—</td>
                                            <td>—</td>
                                        </tr>
                                        <tr>
                                            <td>A12.05.124.001</td>
                                            <td>Средний объем эритроцитов (MCV)</td>
                                            <td>75-95</td>
                                            <td>фл</td>
                                            <td>—</td>
                                            <td>—</td>
                                        </tr>
                                        <tr>
                                            <td>—</td>
                                            <td>Цветовой показатель</td>
                                            <td>—</td>
                                            <td>—</td>
                                            <td>—</td>
                                            <td>—</td>
                                        </tr>
                                        <tr>
                                            <td>A09.05.007</td>
                                            <td>Исследование уровня железа в сыворотке крови</td>
                                            <td>6,6 – 26 (м), 11 – 28 (ж)</td>
                                            <td>мкмоль/л</td>
                                            <td>—</td>
                                            <td>—</td>
                                        </tr>
                                        <tr>
                                            <td>A12.05.011</td>
                                            <td>Исследование железосвязывающей способности сыворотки (ОЖСС)</td>
                                            <td>45,3-77,1</td>
                                            <td>мкмоль/л</td>
                                            <td>—</td>
                                            <td>—</td>
                                        </tr>
                                        <tr>
                                            <td>A09.05.076</td>
                                            <td>Исследование уровня ферритина в крови</td>
                                            <td>10-120 (ж), 20-250 (м)</td>
                                            <td>мкг/л</td>
                                            <td>—</td>
                                            <td>—</td>
                                        </tr>
                                        <tr>
                                            <td>A12.06.060</td>
                                            <td>Определение уровня витамина B12 (цианокобаламин) в крови</td>
                                            <td>197-771</td>
                                            <td>пг/мл</td>
                                            <td>—</td>
                                            <td>—</td>
                                        </tr>
                                        <tr>
                                            <td>A09.05.021</td>
                                            <td>Исследование уровня общего билирубина в крови</td>
                                            <td>2-21</td>
                                            <td>мкмоль/л</td>
                                            <td>—</td>
                                            <td>—</td>
                                        </tr>
                                        <tr>
                                            <td>A09.05.010</td>
                                            <td>Исследование уровня общего белка в крови</td>
                                            <td>65-85</td>
                                            <td>г/л</td>
                                            <td>—</td>
                                            <td>—</td>
                                        </tr>
                                        <tr>
                                            <td>A09.05.080</td>
                                            <td>Исследование уровня фолиевой кислоты в сыворотке крови</td>
                                            <td>3 - 17</td>
                                            <td>нг/мл</td>
                                            <td>—</td>
                                            <td>—</td>
                                        </tr>
                                        <tr>
                                            <td>A09.05.011</td>
                                            <td>Исследование уровня альбумина в крови</td>
                                            <td>35-53</td>
                                            <td>г/л</td>
                                            <td>—</td>
                                            <td>—</td>
                                        </tr>
                                        <tr>
                                            <td>A08.05.001</td>
                                            <td>Цитологическое исследование мазка костного мозга (миелограмма)</td>
                                            <td>0 - норма, 1-угнетение более 2-х ростков, 0,5 - изолированное угнетение красного ростка</td>
                                            <td>—</td>
                                            <td>—</td>
                                            <td>—</td>
                                        </tr>
                                        <tr>
                                            <td>A12.05.009</td>
                                            <td>Прямой антиглобулиновый тест (прямая проба Кумбса)</td>
                                            <td>0-отриц, 1-+/слабо+</td>
                                            <td>—</td>
                                            <td>—</td>
                                            <td>—</td>
                                        </tr>
                                    </table>
                                    </Modal>
                                </Settings.Item>

                                <Settings.Item title="Клинический диагноз">
                                    <div style={{ width:370, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: "10px" }}>
                                        <TextInput/>
                                    </div>                                
                                </Settings.Item>

                                <Settings.Item title="Основной диагноз">
                                <Settings.Section title="">
                                    <div style={{ width:370, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: "10px" }}>
                                        <TextInput/>
                                        <Button children={"Поставить диагноз"} view="action" onClick={onPredictClick}/>
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
                                <Button view="outlined-success" children="Закрыть случай" size="l"/>
                                <Button view="outlined-info" children="Получить  справку" size="l"/>
                            </Settings.Section>
                        </Settings.Page>

                        

                        <Settings.Page title="Опрос пациента">

                            <Settings.Section title="Витальные параметры">
                                <Settings.Item title="Рост (см)">
                                    <ValidTextInput value={inputHeight} onChange={handleHeightChange} type="number"/>
                                </Settings.Item>

                                <Settings.Item title="Вес (кг)">
                                    <ValidTextInput value={inputWeight} onChange={handleWeightChange} type="number"/>
                                </Settings.Item>
                                
                                <Settings.Item title="Температура (C)">
                                    <ValidTextInput value={inputTemperature} onChange={handleTemperatureChange} type="number"/>
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
                        </Settings.Group>
                </Settings>
            </div>  
        )}           
    </ThemeProvider>
);
}