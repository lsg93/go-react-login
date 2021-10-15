import React from 'react'
import { FieldProps} from 'formik'

interface CheckboxProps {
    label : string
}

const FormCheckbox : React.FC<CheckboxProps & FieldProps> = ({
    field,
    label
}) => {
    return (
    <div className="form-group">
        <label className="form-checkbox text-small">
            <input {...field} type="checkbox"/>
            <i className="form-icon"></i>{label}
        </label>
    </div>
    )
}

export default FormCheckbox
