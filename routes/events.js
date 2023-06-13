/* 
    RUTAS DEL CRUD DE LOS EVENTOS
    host + /api/events
*/

const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');

//TODAS LAS PETICIONES DEBEN PASAR POR EL MIDDLEWARE DE VALIDAR JWT
router.use( validarJWT );

router.get( ('/'), getEventos);

router.post( ('/'), [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'La fecha de inicio es obligatoria').custom( isDate ),
    check('end', 'La fecha de finalizacion es obligatoria').custom( isDate ),
    validarCampos
], crearEvento);

router.put( ('/:id'), [], actualizarEvento);

router.delete( ('/:id'), [], eliminarEvento );

module.exports = router;