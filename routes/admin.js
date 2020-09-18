const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

require("../models/Categoria");
const Categoria = mongoose.model("categorias");

require("../models/Postagem");
const Postagem = mongoose.model("postagens");

const {
    eAdmin
} = require("../helpers/verifica_admin");

router.get("/", eAdmin, (req, res) => {
    res.render("admin/index");
})

router.get("/posts", eAdmin, (req, res) => {
    res.send("Página de posts");
})

router.get("/categorias", eAdmin, (req, res) => {
    Categoria.find().sort({
        nome: "ASC"
    }).lean().then((categorias) => {
        //console.log(categorias);
        res.render("admin/categorias", {
            categorias: categorias
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias!");
        res.redirect("/admin");
    });
})

router.get("/add-categoria", eAdmin, (req, res) => {
    res.render("admin/add-categoria");
})

router.post("/categorias/add", eAdmin, (req, res) => {

    var erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({
            texto: "Nome inválido!"
        });
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({
            texto: "Slug inválido!"
        });
    }

    if (erros.length > 0) {
        res.render("admin/add-categoria", {
            erros: erros
        });
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria cadastrada com sucesso!");
            res.redirect("/admin/categorias");
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar categoria. Por favor, tente novamente!");
        });
    }

});

router.get("/categorias/edit/:id", eAdmin, (req, res) => {
    Categoria.findOne({
        _id: req.params.id
    }).lean().then((categoria) => {
        res.render("admin/edit-categorias", {
            categoria: categoria
        })
    }).catch((erro) => {
        req.flash("error_msg", "Categoria não existe!");
        res.redirect("/admin/categorias")
    })
});

router.post("/categorias/edit", eAdmin, (req, res) => {
    Categoria.findOne({
        _id: req.body.id
    }).then((categoria) => {

        categoria.nome = req.body.nome;
        categoria.slug = req.body.slug;

        categoria.save().then(() => {
            req.flash("success_msg", "Categoria editada com sucesso!");
            res.redirect("/admin/categorias");
        }).catch((erro) => {
            req.flash("msg_error", "Houve um erro ao salvar a edição!");
            res.redirect("/admin/categorias");
        });

    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao editar a categoria!");
        res.redirect("/admin/categorias");
    })
});

router.get("/categorias/delete/:id", eAdmin, (req, res) => {
    Categoria.deleteOne({
        _id: req.params.id
    }).then(() => {
        req.flash("success_msg", "Categoria excluída com sucesso!");
        res.redirect("/admin/categorias");
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao excluir a categoria!");
        res.redirect("/admin/categorias");
    });
});

router.get("/postagens", eAdmin, (req, res) => {
    Postagem.find().populate("categoria").sort({
        data: "DESC"
    }).lean().then((postagens) => {
        res.render("admin/postagens", {
            postagens: postagens
        });
    });
});

router.get("/add-postagem", eAdmin, (req, res) => {
    Categoria.find().sort({
        nome: "ASC"
    }).lean().then((categorias) => {
        res.render("admin/add-postagem", {
            categorias: categorias
        });
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias!");
        res.redirect("/admin/postagens")
    });
});

router.post("/postagens/add", eAdmin, (req, res) => {

    var erros = [];

    if (req.body.categoria == 0) {
        erros.push({
            texto: "Você deve escolher uma categoria!"
        });
    }

    if (erros.length > 0) {
        res.render("admin/add-postagem", {
            erros: erros
        });
    } else {
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem cadastrada com sucesso!");
            res.redirect("/admin/postagens");
        }).catch(() => {
            req.flash("error_msg", "Houve um erro ao salvar a ppstagem!");
            res.redirect("admin/postagens/add-postagem");
        });

    }

});

router.get("/edit-postagem/:id", eAdmin, (req, res) => {
    Postagem.findOne({
        _id: req.params.id
    }).lean().then((postagem) => {

        Categoria.find().sort({
            nome: "ASC"
        }).lean().then((categorias) => {
            res.render("admin/edit-postagem", {
                postagem: postagem,
                categorias: categorias
            });
        }).catch((err) => {
            req.flash("error_msg", "Não foi possível listar as categorias!");
            res.redirect("/admin/postagens");
        });

    }).catch(() => {
        req.flash("error_msg", "Não foi possível encontrar a postagem!");
        res.redirect("/admin/postagens");
    });
});

router.post("/postagens/edit", eAdmin, (req, res) => {

    var erros = [];

    if (req.body.categoria == 0) {
        erros.push({
            texto: "Para seguir, escolha uma categoria! Caso não exista, crie uma."
        });
    }

    if (erros.length > 0) {
        Postagem.findOne({
            _id: req.body.id
        }).lean().then((postagem) => {
            Categoria.find().sort({
                nome: "ASC"
            }).lean().then((categorias) => {
                res.render("admin/edit-postagem", {
                    postagem: postagem,
                    categorias: categorias,
                    erros: erros
                });
            });
        });
    } else {

        Postagem.findOne({
            _id: req.body.id
        }).then((postagem) => {
            postagem.titulo = req.body.titulo;
            postagem.slug = req.body.slug;
            postagem.descricao = req.body.descricao;
            postagem.conteudo = req.body.conteudo;
            postagem.categoria = req.body.categoria;

            postagem.save().then(() => {
                req.flash("success_msg", "Postagem editado com sucesso!");
                res.redirect("/admin/postagens");
            }).catch(() => {
                req.flash("error_msg", "Erro ao salvar a postagem!");
                res.redirect("/admin/postagens/edit-postagem");
            });

        }).catch((err) => {
            req.flash("error_msg", "Erro ao encontrar a postagem!");
            res.redirect("/admin/postagens")
        });
    }
});

router.get("/postagens/delete/:id", eAdmin, (req, res) => {
    Postagem.deleteOne({
        _id: req.params.id
    }).then(() => {
        req.flash("success_msg", "Postagem excluída com sucesso!");
        res.redirect("/admin/postagens");
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao excluir a postagem!");
        res.redirect("/admin/postagens");
    });
});

module.exports = router;