// Carregando módulos "nativos"
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Carregando módulos importados
require("../models/Postagem");
const Postagem = mongoose.model("postagens");

require("../models/Categoria");
const Categoria = mongoose.model("categorias");

router.get("/", (req, res) => {
    Postagem.find().populate("categoria").sort({
        data: "DESC"
    }).lean().then((postagens) => {
        res.render("site/home", {
            postagens: postagens
        });
    }).catch((err) => {
        req.flash("error_msg", "Falha ao listar postagens recentes");
        res.redirect("site/404");
    });
});

router.get("/404", (req, res) => {
    res.send("Erro 404!");
});

router.get("/postagem/:slug", (req, res) => {
    Postagem.findOne({
        slug: req.params.slug
    }).lean().then((postagem) => {
        if (postagem) {
            res.render("site/postagem", {
                postagem: postagem
            });
        } else {
            req.flash("error_msg", "A postagem que você está procurando, não existe!");
            res.redirect("/");
        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno!");
        res.redirect("/");
    });
});

router.get("/categorias", (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("site/categorias", {
            categorias: categorias
        });
    }).catch((err) => {
        req.flash("Houve um erro interno ao listar as categorias!");
        res.redirect("/");
    });
});

router.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({
        slug: req.params.slug
    }).lean().then((categoria) => {

        if (categoria) {
            Postagem.find({
                categoria: categoria._id
            }).populate("categoria").lean().then((postagens) => {
                res.render("site/postagens", {
                    postagens: postagens,
                    categoria: categoria
                });
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro interno ao listar as postagens");
                res.redirect("/");
            });

        } else {
            req.flash("error_msg", "Você está buscando uma categoria que não existe!");
            res.redirect("/");
        }

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno ao buscar a categoria");
        res.redirect("/");
    });
});

module.exports = router;