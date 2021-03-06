const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  registervalidation,
  loginvalidation,
} = require("../services/validation");

class AuthController {
  async login(req, res) {
    const item = req.body;
    //Lets validate the data before we a user
    const { error } = loginvalidation(item);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if the  email exists
    const user = await User.findOne({ email: item.email });
    if (!user) return res.status(400).send({ code:400, message:"No se encontro este email"});
    //Password is correct

    const validPass = await bcrypt.compare(item.password, user.password);
    if (!validPass) return res.status(400).send({ code:400, message:"Contraseña incorrecta"});

    //Create and assign a token

    const token = jwt.sign(
      { id: user._id, email: user.email,role:user.typeUser },
      process.env.TOKEN_SECRET,{ expiresIn: 86400 // expires in 24 hours
      }
    );
    res.header("auth-token", token).send({
      code:200,
      user: user,
      token: token,
    });
  }

  async register(req, res) {
    const item = req.body;
    //Lets validate the data before we a user
    const { error } = registervalidation(item);
    if (error) return res.status(400).send(error.details[0].message);
    
    //Checking if the user is already in the database
    const emailExist = await User.findOne({ email: item.email });
    if (emailExist) return res.status(400).send({ code:400, message:"Este email ya esta registrado"});
    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hassPassword = await bcrypt.hash(item.password, salt);

    const user = new User({
      name: item.name,
      email: item.email,
      password: hassPassword,
      phone: item.phone,
      address: item.address,
      typeUser: item.typeUser,
    });

    try {
      const savedUser = await user.save();
      res.status(200).send({ code:200, message:"Registro exitoso!",user:savedUser});
    } catch (err) {
      res.status(500).send(err);
    }
  }

  getProfile = async (req, res) => {
    const id = req.user.id
    const findUser = await User.findById(id).catch((err) =>
      res.status(500).send(err.message)
    );
    if (!findUser)
      return res
        .status(404)
        .send({ code: 404, message: "Usuario no encontrado" });
    return res
      .status(200)
      .send({
        code: 200,
        message: "Usuario encontrado exitosamente",
        findUser,
      });
  };

  getUser = async (req, res) => {
    const id = req.params.id;
    const findUser = await User.findById(id).catch((err) =>
      res.status(500).send(err.message)
    );
    if (!findUser)
      return res
        .status(404)
        .send({ code: 404, message: "Usuario no encontrado" });
    return res
      .status(200)
      .send({
        code: 200,
        message: "Usuario encontrado exitosamente",
        findUser,
      });
  };

  getUsers = async (req, res) => {
    const findUser = await User.find({}).catch((err) =>
      res.status(500).send(err.message)
    );
    if (!findUser && findUser.length <= 0)
      return res
        .status(404)
        .send({ code: 404, message: "No hay usuarios disponibles" });
    return res
      .status(200)
      .send({
        code: 200,
        message: "Usuarios encontrados exitosamente",
        users: findUser,
      });
  };

  updateProfile = async (req, res) => {
    const id = req.user.id;
    const data = {
      ...req.body,
      updated_at: Date.now(),
    };
    const updateUser = await User.findByIdAndUpdate(id, data, {
      new: true,
    }).catch((err) => res.status(500).send(err.message));
    if (!updateUser)
      return res
        .status(404)
        .send({ code: 404, message: "Usuario no encontrado" });
    return res
      .status(200)
      .send({
        code: 200,
        message: "Usuario actualizado correctamente",
        user: updateUser,
      });
  };


  updateUser = async (req, res) => {
    const id = req.params.id;
    const data = {
      ...req.body,
      updated_at: Date.now(),
    };
    const updateUser = await User.findByIdAndUpdate(id, data, {
      new: true,
    }).catch((err) => res.status(500).send(err.message));
    if (!updateUser)
      return res
        .status(404)
        .send({ code: 404, message: "Usuario no encontrado" });
    return res
      .status(200)
      .send({
        code: 200,
        message: "Usuario actualizado correctamente",
        user: updateUser,
      });
  };

  deleteUser = async (req, res) => {
    const id = req.params.id;

    const user = await User.findByIdAndDelete(id).catch((err) =>
      res.status(500).send(err.message)
    );
    if (!user)
      return res
        .status(404)
        .send({ code: 404, message: "Usuario no encontrado" });
    return res
      .status(200)
      .send({ code: 200, message: "Usuario eliminado correctamente" });
  };
}

module.exports = AuthController;
