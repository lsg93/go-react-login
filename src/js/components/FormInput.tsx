import React from 'react'
import { FieldProps} from 'formik'

interface InputProps {
    label : string
    type : string
}

const FormInput : React.FC<InputProps & FieldProps> = ({
    field,
    label,
    type
}) => {
    return (
        <div className="form-group" style={{'display' : 'flex', 'flexDirection' : 'column' }} >
            <label className="form-label" htmlFor={field.name}>{label}:</label>
            <input type={type} className="form-input" {...field}/>
        </div>
    )
}

export default FormInput
