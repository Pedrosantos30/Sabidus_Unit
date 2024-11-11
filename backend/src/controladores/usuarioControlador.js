const Post = require("../modelos/postModelo")
const Usuario = require("../modelos/usuarioModelo")
const bcrypt = require("bcrypt")

const criarUsuario = async (req, res) => {
  const { nome, email, senha, curso, confirmarSenha, disciplina, periodo, tipoUsuario } = req.body

  if (!nome || !email || !senha || !confirmarSenha || !curso || !periodo || !tipoUsuario) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios." })
  }

  if (confirmarSenha != senha) {
    return res.status(400).json({message: "As senhas não conferem"})
  }

  if (isNaN(periodo)) {
    return res.status(400).json({ message: "O campo 'período' deve conter um valor numérico." })
  }

  if (tipoUsuario === 'monitor' && !disciplina) {
    return res.status(400).json({ message: "O monitor precisa informar uma disciplina." })
  }

  try {
    const senhaHashed = await bcrypt.hash(senha, 10)

    const timezoneOffset = -3 
    const createdAt = new Date(Date.now() + timezoneOffset * 60 * 60 * 1000)
    const updatedAt = createdAt

 
    const novoUsuario = new Usuario({
      nome,
      email,
      senha: senhaHashed,
      confirmarSenha,
      curso,
      disciplina,
      periodo,
      tipoUsuario,
      createdAt,
      updatedAt
    });

    await novoUsuario.save();


    res.status(201).json({ message: "Usuário criado com sucesso!", usuario: novoUsuario })
  }catch (error) {
    res.status(400).json({ message: "Erro ao criar usuário.", error: error.message })
  }
};

const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find()
    res.status(200).json(usuarios)
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários.", error: error.message })
  }
};

const atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, curso,  disciplina, periodo, tipoUsuario } = req.body

  const senhaHashed = await bcrypt.hash(senha, 10)


  try {
    const usuarioAtualizado = await Usuario.findByIdAndUpdate(id, {
      nome,
      email,
      senha: senhaHashed,
      curso,
      disciplina,
      periodo,
      tipoUsuario,
    }, { new: true })

    if (!usuarioAtualizado) {
      return res.status(404).json({ message: "Usuário não encontrado." })
    }

    res.status(200).json({ message: "Usuário atualizado com sucesso!", usuario: usuarioAtualizado })
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar usuário.", error: error.message })
  }
}

const deletarUsuario = async (req, res) => {
  const { id } = req.params

  try {
    const usuarioDeletado = await Usuario.findByIdAndDelete(id)

    if (!usuarioDeletado) {
      return res.status(404).json({ message: "Usuário não encontrado." })
    }

    res.status(200).json({ message: "Usuário deletado com sucesso!" })
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar usuário.", error: error.message })
  }
}

const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado." })
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha)
    if (!senhaValida) {
      return res.status(401).json({ message: "Senha incorreta." })
    }

    res.status(200).json({message: "Login bem-sucedido.", user: { id: usuario._id, nome: usuario.nome, email: usuario.email, tipoUsuario: usuario.tipoUsuario }})
    
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor.", error: error.message })
  }
}

const obterUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findById(id).select('-senha')

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado." })
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter usuário.", error: error.message })
  }
}

module.exports = {
  criarUsuario,
  listarUsuarios,
  atualizarUsuario,
  deletarUsuario,
  loginUsuario,
  obterUsuario
};
