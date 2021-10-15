import React, {useState, useEffect} from 'react'
import {RouteComponentProps} from 'react-router-dom';

interface MatchParam{
    confirmationCode : string
    id : string
}

type PropsWithParam = RouteComponentProps<MatchParam>

const verificationMessages: any = {
    'loading' : 'Verifying...',
    'notFound' : 'Invalid user',
    'alreadyVerified' : 'You have already verified your account with this link. Redirecting...',
    'linkExpired' : 'This link has expired - please reregister.',
    'success' : 'You have successfully verified your account. Redirecting...'
}

const VerifySignup : React.FC<PropsWithParam> = ({history, match}) => {

    const {confirmationCode, id} =  match.params

    const [verificationStatus, setVerificationStatus] = useState<string>('loading')

    const showLoading = ['loading', 'success', 'alreadyVerified'].indexOf(verificationStatus) !== -1 

    useEffect(() => {

        if (['success', 'alreadyVerified'].indexOf(verificationStatus) !== -1) {
            setTimeout(() => {
                history.push('/')
            }, 1500)
        }

    }, [verificationStatus])

    useEffect(() => {

        fetch('/verifySignup', {
            method : 'POST',
            headers : {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({confirmationCode, id})
        })
        .then(res => res.text())
        .then(msg => {
            setVerificationStatus(msg)
        })

    }, [])

    return (
        <div style={{
            'display' : 'flex',
            'flex' : '1 1 0%',
            'justifyContent' : 'center',
            'alignItems' : 'center'
        }}>
            <div>
                <h2>{verificationMessages[verificationStatus]}</h2>
                    {!!showLoading &&
                        <div className="loading"></div>
                    }                
            </div>
        </div>
    )
}

export default VerifySignup
