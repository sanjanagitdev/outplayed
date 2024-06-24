import React from "react";
import { Route, Redirect } from "react-router-dom";
export const LoginPrivateRouteAdmin = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) =>
            localStorage.getItem("webadmintoken") ? (
                <Redirect
                    to={{
                        pathname: "/admin/dashboard",
                        state: { from: props.location },
                    }}
                />
            ) : (
                <Component {...props} />
            )
        }
    />
);

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) =>
            localStorage.getItem("webtoken") ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: "/",
                        state: { from: props.location },
                    }}
                />
            )
        }
    />
);

export const AdminPrivateAfterLogin = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) =>
            localStorage.getItem("webadmintoken") ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: "/admin",
                        state: { from: props.location },
                    }}
                />
            )
        }
    />
);
