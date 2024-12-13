const getState = ({ getStore,getActions, setStore }) => {
    return {
        store: {
            token: localStorage.getItem("token") || null, 
        },
        actions: {
            setToken: (newToken) => {
                localStorage.setItem("token", newToken); 
                setStore({ token: newToken }); 
            },
            logout: () => {
                localStorage.removeItem("token"); 
                setStore({ token: null }); 
            },
        },
    };
};

export default getState;