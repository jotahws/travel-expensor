//Ex. "A:515111481*B:299246310*C:PT*D:FS*E:N*F:20210525*G:FS 2021019032A/1470*H:0-1470*I1:PT*I5:3.81*I6:0.50*I7:1.29*I8:0.30*N:0.80*O:5.90*Q:K+yt*R:1517"
export const decodePTInvoice = (string) => {
    let valArr = string.split('*');
    let data = {}
    valArr.forEach((e) => {
        data[e.split(':')[0]] = e.split(':')[1]
    })
    data.amount = data.O;
    data.txid = data.G;
    data.isInvoice = !!data.O
    return data
}

