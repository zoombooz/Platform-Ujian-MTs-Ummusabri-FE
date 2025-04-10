export function getTokenPayload() {
    return jwtDecode(localStorage.getItem('authToken')).payload;
}

export function isTokenExpired() {
    return Date.now() >= getTokenPayload().exp * 1000;
}

function jwtDecode(t: any) {
    const token: {raw: any, header: any, payload: any} = {raw: '', header: '', payload: ''};
    token.raw = t;
    token.header = JSON.parse(window.atob(t.split('.')[0]));
    token.payload = JSON.parse(window.atob(t.split('.')[1]));
    return (token)
}