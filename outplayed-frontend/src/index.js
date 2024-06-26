import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import "./i18n";

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
    <Suspense fallback="...">
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Suspense>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
