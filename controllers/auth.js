const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, res=response) => {

    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email }).exec();
        
        if ( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            });
        }

        usuario = new Usuario( req.body );

        //ENCRIPTAR CONTRASEÑA
        usuario.password = bcrypt.hashSync( password, bcrypt.genSaltSync() );
    
        await usuario.save();

        //GENERAR JWT (JSON WEB TOKEN)
        const token = await generarJWT( usuario.id, usuario.name);
    
        return res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Fallo al crear el usuario'
        })
    }


};

const loginUsuario = async(req, res=response) => {

    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email }).exec();
        
        if ( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario o contraseña no son correctos'
            });
        }

        //CONFIRMAR LOS PASSWORDS
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if ( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario o contraseña no son correctos'
            });
        }

        //GENERAR EL JWT (JSON WEB TOKEN)
        const token = await generarJWT( usuario.id, usuario.name);

        return res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Fallo al logear el usuario'
        })
    }

};

const revalidarToken = async(req, res=response) => {

    const { uid, name } = req;

    //GENERAR EL JWT (JSON WEB TOKEN)
    const token = await generarJWT( uid, name);

    return res.json({
        ok: true,
        token
    })

};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}