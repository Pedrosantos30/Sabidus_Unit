const mongoose = require("mongoose")

const usuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true
    },
    curso: {
        type: String,
        required: true
    },
    disciplina: {
        type: String,
        required: function() {
            return this.tipoUsuario === 'monitor'
        }
    },
    periodo: {
        type: Number,
        required: function(){
            return this.tipoUsuario === 'aluno' || this.tipoUsuario === 'monitor'
        }
    },
    tipoUsuario: {
        type: String,
        enum: ['aluno', 'monitor'],
        required: true
    },
    createdAt: Date,
    updatedAt: Date
})

const Usuario = mongoose.model('Usuario', usuarioSchema)
module.exports = Usuario