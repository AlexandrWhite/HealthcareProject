import { ThemeProvider } from "@gravity-ui/uikit";
import React from "react";
import { useParams } from "react-router-dom";

export const PatientPage: React.FC = () =>{
    const { patientId } = useParams();
    return (
        <ThemeProvider theme="light">
            <div>
                Это страница {patientId}
            </div>
        </ThemeProvider>
    )
}