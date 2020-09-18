// Carregando módulos "nativos"
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Carregando módulos importados
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");

router.get("/registro", (req, res) => {
    res.render("usuarios/registro");
});

router.post("/registro", (req, res) => {

    var erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({
            texto: "Nome inválido!"
        });
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({
            texto: "E-mail inválido!"
        });
    }

    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({
            texto: "E-mail inválido!"
        });
    }

    if (req.body.senha != req.body.senha2) {
        erros.push({
            texto: "As senhas digitadas não combinam!"
        });
    }

    if (req.body.senha.length < 4) {
        erros.push({
            texto: "Senha muito curta!"
        });
    }

    if (erros.length > 0) {
        res.render("usuarios/registro", {
            erros: erros
        });
    } else {

        Usuario.findOne({
            email: req.body.email
        }).then((usuario) => {

            if (usuario) {
                req.flash("error_msg", "Já existe uma conta com esse e-mail no nosso sistema!");
                res.redirect("/usuario/registro")
            } else {

                const novoUsuario = {
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                }

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if (erro) {
                            req.flash("error_msg", "Houve um erro durante o salvamento do usuário!");
                            res.redirect("/");
                        }

                        novoUsuario.senha = hash;

                        new Usuario(novoUsuario).save().then(() => {
                            req.flash("success_msg", "Usuário cadastrado com sucesso!");
                            res.redirect("/usuario/login");
                        }).catch((err) => {
                            req.flash("error_msg", "Houve um erro ao cadastrar o usuário!");
                            res.redirect("/");
                        });

                    })
                });

            }

        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno!");
            req.redirect("/");
        });

    }

});

router.get("/login", (req, res) => {
    res.render("usuarios/login");
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuario/login",
        failureFlash: true
    })(req, res, next)
});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "Logout efetuado com sucesso!");
    res.redirect("/usuario/login");
});

module.exports = router;