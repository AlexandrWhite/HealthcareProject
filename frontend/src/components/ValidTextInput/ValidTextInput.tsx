import { TextInput } from "@gravity-ui/uikit";
import { useState } from "react";

export const ValidTextInput: React.FC<{ type?: string }> = ({ type }) => {
    const [validationState, setValidationState] = useState<undefined | "invalid">("invalid");
    const [errMsg, setErrMsg] = useState("Значение не может быть пустым");

    function noEmpty(value: string): void {
        if (value === "") {
            setValidationState("invalid");
            setErrMsg("Значение не может быть пустым");
        } else {
            setValidationState(undefined);
        }
    }

    return (
        <div style={{ height: 30 }}>
            <TextInput
                type={type} // Присваиваем переданный тип
                onUpdate={noEmpty}
                validationState={validationState}
                errorMessage={errMsg}
            />
        </div>
    );
};
