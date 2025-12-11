// auth.js
function setRole(role) {
    localStorage.setItem('userRole', role);
}

function getRole() {
    return localStorage.getItem('userRole');
}

function logout() {
    localStorage.removeItem('userRole');
}
