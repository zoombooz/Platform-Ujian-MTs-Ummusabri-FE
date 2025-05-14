export function getTokenPayload() {
    return jwtDecode(localStorage.getItem('authToken')).payload;
}

export function isTokenExpired() {
    return Date.now() >= getTokenPayload().exp * 1000;
}

export function isRoleAdmin() {
    return getTokenPayload().role.toLowerCase() === 'admin';
}

export function isRoleGuru() {
    // console.log(getTokenPayload(),"isRoleGuru")
    return getTokenPayload().role === 'guru';
}

function jwtDecode(t: any) {
    if(t){
        const token: {raw: any, header: any, payload: any} = {raw: '', header: '', payload: ''};
        token.raw = t;
        token.header = JSON.parse(window.atob(t.split('.')[0]));
        token.payload = JSON.parse(window.atob(t.split('.')[1]));
        // console.log(token.payload, "token payload")
        return (token)

    }
    return {payload: "", exp: 0}
}