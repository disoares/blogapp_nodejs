const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
    nome: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true
    },
    nivel: {
        type: Number,
        default: 0
    },
    senha: {
        type: String,
        required: true
    }
});

mongoose.model("usuarios", UsuarioSchema);