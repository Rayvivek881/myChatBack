const jwt = require('jsonwebtoken');
const mykey = `ivghvhdhgshbhsdhvbshdjhsdhsdghhsdbjhsdbjhs`

const CreateToken = async (_id) =>{
    const token = await jwt.sign({_id: _id}, mykey, {
        expiresIn: '3h',
    });
    return token;
}

const VarifyToken = async (token) => {
    let payload;
    try {
        payload = await jwt.verify(token, mykey);
        payload = {
            ...payload,
            isVarified: true
        }
    } catch(err) {
        payload = {
            ...payload,
            isVarified: false
        }
    }
    return payload;
}
const tokenobj = {
    CreateToken: CreateToken,
    VarifyToken: VarifyToken
}
module.exports = tokenobj;