const TokenService = {
    saveToken(token){
        window.localStorage.setItem("julis-user", token);
    },
    deleteToken(){
        window.localStorage.removeItem("julis-user");
    },
    getToken(){
        return window.localStorage.getItem("julis-user");
    },
    hasToken(){
        return TokenService.getToken();
    }
};

module.exports = TokenService;