const { response, request } = require("express");
const jwt = require('jsonwebtoken');

const validarJWT = (req=request, res=response, next) => {
    
    const token = req.headers['x-token'];

    if ( !token ){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {

        const { uid, name } = jwt.verify( token, process.env.SECRET_JWT_SEED );
        req.uid = uid;
        req.name = name;

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

    next();

}

module.exports = {
    validarJWT
}