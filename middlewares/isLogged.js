//PROCESO DE VALIDACION DE TOKEN PARA LA AUTENTICACION
const jwt = require('jsonwebtoken');

module.exports= function (req,res,next) {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send({code:401,message:"Acceso denegado"});
    try {
        const verified = jwt.verify(token,process.env.TOKEN_SECRET || "tokenmegasecreto");
        req.user = verified;
        next()
    } catch (err) {
        res.send(err)
        res.status(400).send('Invalid Token')
    }

}