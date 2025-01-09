import { BrowserRouter, Routes, Route} from "react-router-dom";
import {LoginPage} from './components/LoginPage';
import { HomePage } from './components/HomePage';
import { AuthContext } from "./AppContexts/AppContext";
import { useState} from "react";


const App = () => {

    const [username,setUsername] = useState('default name')
    const [isAuth,setIsAuth] = useState(false)
    const [isCsrf, setIsCsrf] = useState(null)

    return (
        <AuthContext.Provider value={{
            username,setUsername,
            isAuth,setIsAuth,
            isCsrf, setIsCsrf,
        }}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
        </AuthContext.Provider>
    );
};

export default App;
