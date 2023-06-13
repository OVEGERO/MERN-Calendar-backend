const { response } = require('express');
const Evento = require('../models/Evento')

const getEventos = async(req, res=response) => {

    try {

        const eventos = await Evento.find().populate('user', 'name');
        
        return res.status(200).json({
            ok: true,
            eventos
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }


};

const crearEvento = async(req, res=response) => {

    //VERIFICAR QUE TENGA EL EVENTO
    const evento = new Evento( req.body );

    try {

        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        return res.status(200).json({
            ok: true,
            evento: eventoGuardado
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

    return res.status(200).json({
        ok: true,
        msg: 'crearEvento'
    });

};

const actualizarEvento = async(req, res=response) => {

    const eventoId = req.params.id;

    try {

        const evento = await Evento.findById( eventoId );

        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        if ( evento.user.toString() !== req.uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: req.uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );
        
        return res.status(200).json({
            ok: true,
            evento: eventoActualizado
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

};

const eliminarEvento = async(req, res=response) => {

    const eventoId = req.params.id;

    try {
        
        const evento = await Evento.findById( eventoId );

        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        if ( evento.user.toString() !== req.uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de borrar este evento'
            });
        }

        const eventoEliminado = await Evento.findByIdAndDelete( eventoId );

        return res.status(200).json({
            ok: true,
            evento: eventoEliminado
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });        
    }

};

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}