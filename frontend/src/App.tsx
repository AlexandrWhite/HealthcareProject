import { BrowserRouter, Routes, Route} from "react-router-dom";
import {LoginPage} from './components/LoginPage';
import { HomePage } from './components/HomePage';
import { PatientPage } from './components/PatientPage';
import { AuthContext } from "./AppContexts/AppContext";
import { useState} from "react";
import { Toaster, ToasterProvider } from "@gravity-ui/uikit";


const App = () => {

    const [username,setUsername] = useState('default name')
    const [isAuth,setIsAuth] = useState(false)
    const [isCsrf, setIsCsrf] = useState(null)
    const toaster = new Toaster();

    return (
        <ToasterProvider>
            <AuthContext.Provider value={{
                username,setUsername,
                isAuth,setIsAuth,
                isCsrf, setIsCsrf,
            }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/patient/:patientId" element={<PatientPage/>}/>
                </Routes>
            </BrowserRouter>
            </AuthContext.Provider>
        </ToasterProvider>
    );
};

export default App;
