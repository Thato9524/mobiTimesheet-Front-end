import { createContext, useState } from "react";
import config from "./config";
import request from "./handlers/request";

const ClientContext = createContext();

export function ClientProvider({ children }){
    const [globalClients, setGlobalClients] = useState([]);

    async function setClients (clients){
        setGlobalClients(clients);
    }
    return (
        <ClientContext.Provider value={{globalClients, setClients}}>{children}</ClientContext.Provider>
    )
}

export default ClientContext;