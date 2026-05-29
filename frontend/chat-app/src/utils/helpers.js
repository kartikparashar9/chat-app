const setToken = (token) => {
    localStorage.setItem("token", token);
};

const getToken = () => {
    return localStorage.getItem("tokrn");
};

const removeToken = () => {
    return localStorage.removeItem("token");
}

export { setToken, getToken, removeToken };