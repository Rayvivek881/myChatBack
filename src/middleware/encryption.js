const skey = 98;
const Encryption = (data) => {
    let newData = [];
    for (let i = 0; i < data.length; i++) {
        newData.push((data.charCodeAt(i)) + skey);
    }
    return String.fromCharCode(...newData);
}
const Decryption = (data) => {
    let newData = [];
    for (let i = 0; i < data.length; i++) {
        newData.push((data.charCodeAt(i)) - skey);
    }
    return String.fromCharCode(...newData);
}

const Cryption = {
    Encryption: Encryption,
    Decryption: Decryption
}

module.exports = Cryption