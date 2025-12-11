export function getTime(){
    const now = new Date();

    return new Intl.DateTimeFormat('fa-Af',{
        timeZone:'Asia/Kabul',
        hour:'2-digit',
        minute:'2-digit',
        second:'2-digit',
        hour12:true
    }).format(now);
}

export function getDate(){
    const now = new Date();

    return new Intl.DateTimeFormat('fa-Af-u-ca-persian',{
        timeZone:'Asia/Kabul',
        year:"numeric",
        month:'long',
        day:'numeric'
    }).format(now);
}