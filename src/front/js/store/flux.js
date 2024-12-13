const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: localStorage.getItem("token") || null, 
            username: localStorage.getItem("username") || null, 
        },
        actions: {
            setToken: (newToken, username) => {
                localStorage.setItem("token", newToken); 
                localStorage.setItem("username", username); 
                setStore({ token: newToken, username: username }); 
            },
            logout: () => {
                setStore({ token: null, username: null });
                localStorage.removeItem("token"); 
                localStorage.removeItem("username");
            },
        },
    };
};

export default getState;
