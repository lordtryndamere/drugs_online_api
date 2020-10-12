//PROCESO DE VALIDACION DE ACCESO A UNA RUTA
const { roles } = require('./role')
 
exports.grantAccess = function(action, resource) {
 return async (req, res, next) => {
  try {
   const permission = roles.can(req.user.role)[action](resource);
   if (!permission.granted) {
    return res.status(401).json({
    code:401,
     message: "No tienes permiso para realizar esta accion"
    });
   }
   next()
  } catch (error) {
   next(error)
  }
 }
}