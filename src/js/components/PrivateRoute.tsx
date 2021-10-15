import React, {useState, useEffect} from 'react'
import {Route, Redirect, RouteProps} from 'react-router-dom'
import LoginForm from './LoginForm'

const checkAuth = () => {
    return fetch('/auth').then(r => r.ok)
}


const PrivateRoute : React.FC<RouteProps> = ({component : Component , ...routeProps}) => {
    

    const [isFetching, setFetching] = useState<boolean>(true)
    const [loggedIn, setLoggedIn] = useState<null | boolean>(null)

    const RenderComponent = Component as React.ElementType

    useEffect(() => {

        checkAuth().then(r => {
            setTimeout(() => {
                setFetching(false)
                setLoggedIn(r)
            }, 1000)
        })

    }, [])

    if (isFetching) {
        return (
                <div className="col-12 flex-centered" style={{ 'flex' : 1}}>
                    <div className="loading"></div>
                </div>
        )
    }

    return (
        <Route
          {...routeProps}
          render={(routeProps) =>
            loggedIn ? (
              <RenderComponent {...routeProps} />
            ) : (
              <LoginForm  {...routeProps}/>
            )
          }
        />
      );

}

export default PrivateRoute
