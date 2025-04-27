import { TextInput } from "@gravity-ui/uikit";
import { useState, useEffect } from "react";

export const ValidTextInput: React.FC<{
    type?: string;
    value?: string;
    onChange?: (value: string) => void;
}> = ({ type, value = null, onChange }) => {
    const [validationState, setValidationState] = useState<undefined | "invalid">("invalid");
    const [errMsg, setErrMsg] = useState("Значение не может быть пустым");

    useEffect(() => {
        noEmpty(value);
    }, [value]);

    function noEmpty(newValue: string): void {
        if (newValue === "") {
            setValidationState("invalid");
            setErrMsg("Значение не может быть пустым");
        } else {
            setValidationState(undefined);
        }
        onChange?.(newValue); // Передаем значение родительскому компоненту
    }

    return (
        <div style={{ height: 30 }}>
            <TextInput
                required
                type={type}
                value={value} // Присваиваем переданное значение
                onUpdate={noEmpty}
                validationState={validationState}
                errorMessage={errMsg}
            />
        </div>
    );
};
