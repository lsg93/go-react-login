import React, {useState, useEffect} from 'react'
import {RouteComponentProps, Redirect} from 'react-router-dom';
import { withFormik, FormikProps, FormikErrors, Form, Field } from 'formik'
import FormInput from './FormInput'
import FormCheckbox from './FormCheckbox'

interface LoginFormValues {
    email : string
    password : string
}

type Props = {
    children ?: React.ReactNode | (() => void)
}

const LoginErrorMessages: any = {
    "notFound" : "No user exists with this email address - please check you have entered your email address correctly.",
    "incorrectPassword" : "You have entered an incorrect password - please try again.",
    "notVerified" : "Your account needs to be verified before you can log in. Please check your email inbox for an email detailing verification."
}

type AllProps = Props & RouteComponentProps

const LoginFormContent = (props : Props & FormikProps<LoginFormValues>) => {
    const {isSubmitting, status} = props

    const errorMessage = LoginErrorMessages[status]
    
    return (
    
        <Form>
            <div style={{'display' : 'flex', 'flexDirection' : 'column' }}>
                <Field type="email" name="email" label="Email" component={FormInput} />
                <Field type="password" name="password" label="Password" component={FormInput}/>
                    {!!errorMessage &&
                        <span className="h6 my-2 text-small text-center" style={{'color' : 'red', 'textAlign' : 'center'}}>{errorMessage}</span>
                    }
                <button className={`btn submit my-2 ${ isSubmitting ? 'loading' : ''}`}>Submit</button>
                <span className="mt-2 text-small text-center" >Don't have a password? <a>Register here</a></span>
            </div>
        </Form>

    )

}

interface SignupFormValues {
    firstName : string
    lastName : string
    email : string
    password : string
    confirmPassword : string
    tcChecked : boolean
}

const SignupFormContent = (props : Props & FormikProps<SignupFormValues>) => {
    const {isSubmitting, status} = props

    if (status === true) {

        return (
            <div style={{'display' : 'flex', 'flexDirection' : 'column', alignItems: 'center'}} >
                <h2>Thanks for signing up!</h2>
                <p style={{'textAlign' : 'center'}} >You have been sent an email to confirm your account registration.</p>
            </div>
        )


    } else {

        return (
            <Form>
                <div style={{'display' : 'flex', 'flexDirection' : 'column' }}>
                    <Field name="firstName" label="First Name" component={FormInput} />
                    <Field name="lastName" label="Surname" component={FormInput} />
                    <Field name="email" label="Email" component={FormInput} />
                    <Field type="password" name="password" label="Password" component={FormInput}/>
                    <Field type="password" name="confirmPassword" label="Confirm Password" component={FormInput}/>
                    <Field type="checkbox" name="tcChecked" label="I agree with the Terms and Conditions" component={FormCheckbox}/>
                    <button className={`btn submit my-2 ${ isSubmitting ? 'loading' : ''}`}>Submit</button>
                </div>
            </Form>
        )

    }


}

interface FormikFormProps {
}

const FormikLoginForm = withFormik<FormikFormProps, LoginFormValues>({

    mapPropsToValues : props => {
        return {
            email : '',
            password : ''
        }

    },

    handleSubmit : (values, {setSubmitting, setStatus, setErrors}) => {
        fetch('/login', {
            method : 'POST',
            headers : {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify(values)
        })
        .then(r => r.text())
        .then(msg => {
            setStatus(msg)
            setSubmitting(false)
            if (msg === 'success') {
                window.location.reload()
            }
        })
    },

    validate : () => {
        // todo
    }

})(LoginFormContent)

const FormikSignupForm = withFormik<FormikFormProps, SignupFormValues>({

    mapPropsToStatus : () => false,

    mapPropsToValues : props => {
        return {
            firstName : '',
            lastName : '',
            email : '',
            password : '',
            confirmPassword : '',
            tcChecked : false,
        }
    },

    handleSubmit : (values, {setSubmitting, setStatus}) => {

            fetch('/register', {
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify(values)
            })
            .then(r => { 
                setStatus(r.ok)
                setSubmitting(false)
            })

    },

    validate : () => {
        // todo
    }

})(SignupFormContent)

const LoginRegisterForm : React.FC<AllProps> = (props) => {

    type currentFormType = 'login' | 'register'

    const [currentForm, setCurrentForm] = useState<currentFormType>('login')

    return (
            <div className="content container">
                <div className="col-12 d-flex" style={{'flex' : '1'}}>
                    <div className="col-8 hide-sm col-mr-auto">
                    </div>
                    <div className="login-container col-sm-12 col-4 col-lg-6 d-flex" style={{'flexDirection' : 'column', 'backgroundColor' : '#fffff'}}>
                        <div className=" login">
                            <div className="login-form container" >
                            <div className="login-form-options" >
                                <div style={{'flexDirection' : 'column'}} className="col-8 col-mx-auto d-flex">
                                    <div className="d-flex mb-1" >
                                        <div className="col-6 d-flex flex-centered c-hand"><span onClick={() => setCurrentForm('register')} className="text-center h5">Register</span></div>
                                        <div className="col-6 d-flex flex-centered c-hand"><span onClick={() => setCurrentForm('login')} className="text-center h5">Log In</span></div>
                                    </div>
                                    <div className="col-12 d-flex loginSignupDivider">
                                        <div className={`col-6 slide ${currentForm === 'register' ? 'registerActive' : 'loginActive'}`}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="login-form-holder" style={{'marginTop' : '20px'}}>
                                    {currentForm === 'login'
                                        ? <FormikLoginForm/>
                                        : <FormikSignupForm />
                                    }
                            </div>
                            </div>
                        </div>
                        <div className="login-form-footer text-tiny muted">
                            <span className="mr-1 c-hand">Terms and Conditions</span>
                            <span className="ml-1 c-hand">Contact us</span>
                        </div>
                    </div>
                </div>
            </div>

    )
}

export default LoginRegisterForm
