const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostagemSchema = new Schema({
    titulo: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "categorias",
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model("postagens", PostagemSchema);