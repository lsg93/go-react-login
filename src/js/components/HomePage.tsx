import React from 'react'
import {RouteComponentProps} from 'react-router-dom'

interface Props extends RouteComponentProps {
    children ?: React.ReactNode
}

const HomePage: React.FC<Props> = (props) => {
    return (
        <div className="d-flex h3 " style={{justifyContent : 'center', alignItems: 'center', flex : 1}}>
            <span>You are logged in - there should probably be a logout button to clear the cookie.</span>
        </div>
    )
}

export default HomePage
