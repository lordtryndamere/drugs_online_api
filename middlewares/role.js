//SERVICIO PARA ASIGNAR PERMISOS A LOS ROLES DE LA PLATAFORMA

const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
  ac.grant("client").readOwn("profile").updateOwn("profile");

  ac.grant("seller").readOwn("profile").updateOwn("profile");

  ac.grant("admin")
    .readOwn("profile")
    .updateOwn("profile")
    .createAny("user")
    .readAny("user")
    .updateAny("user")
    .deleteAny("user");

  return ac;
})();
