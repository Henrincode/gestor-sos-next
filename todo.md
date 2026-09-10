- na rota de login checar se esta logado, se estiver envia mensagem de usuário logado e sugere a rota de logout


    // autenticação: se estiver logado não deixa criar uma conta.
    const { errorResponse, user } = await authenticateRequest(req)
    if (errorResponse) return errorResponse