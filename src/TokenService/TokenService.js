const TokenService = {
    saveAdminToken(token){
        window.localStorage.setItem("julis-admin", token);
    },
    saveToken(token){
        window.localStorage.setItem("julis-user", token);
    },
    deleteAdminToken(){
        window.localStorage.removeItem("julis-admin");
    },
    deleteToken(){
        window.localStorage.removeItem("julis-user");
    },
    getAdminToken(){
        return window.localStorage.getItem("julis-admin");
    },
    getToken(){
        return window.localStorage.getItem("julis-user");
    },
    hasAdminToken(){
        return TokenService.getAdminToken();
    },
    hasToken(){
        return TokenService.getToken();
    }
};

module.exports = TokenService;