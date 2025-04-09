const ClienteService = require("../services/clientesService");

exports.create = async (req, res) => {
  try {
    const { nome, telefone, email, cpf, endereco, observacoes } = req.body;

    const novoCliente = await ClienteService.createCliente({
      nome,
      telefone,
      email,
      cpf,
      endereco,
      observacoes,
    });

    return res.status(201).json(novoCliente);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao cadastrar o cliente." });
  }
};

exports.getAll = async (req, res) => {
  try {
    const clientes = await ClienteService.getClientes();
    return res.status(200).json(clientes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar os clientes." });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await ClienteService.getClienteById(id);

    if (!cliente) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }

    return res.status(200).json(cliente);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar o cliente." });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, telefone, email, cpf, endereco, observacoes } = req.body;

    const clienteAtualizado = await ClienteService.updateCliente(id, {
      nome,
      telefone,
      email,
      cpf,
      endereco,
      observacoes,
    });

    return res.status(200).json(clienteAtualizado);
  } catch (error) {
    console.error(error);
    if (error.message === "Cliente não encontrado.") {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Erro ao atualizar o cliente." });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await ClienteService.deleteCliente(id);
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error.message === "Cliente não encontrado.") {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Erro ao deletar o cliente." });
  }
};
