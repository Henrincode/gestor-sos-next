2xx — Sucesso (Success)

- 200 OK: Requisição processada com sucesso. Usado para respostas com dados (GET, PUT, PATCH).

- 201 Created: Recurso criado com sucesso. Retornado após um POST bem-sucedido.

- 204 No Content: Requisição concluída com sucesso, mas sem conteúdo no corpo da resposta. Comum em deleções (DELETE).

3xx — Redirecionamento (Redirection)

- 301 Moved Permanently: O recurso mudou de URI permanentemente.

- 304 Not Modified: O recurso não mudou desde a última requisição. Usado para otimização de cache.

4xx — Erros do Cliente (Client Errors)

- 400 Bad Request: A requisição é inválida ou malformada (ex.: JSON sintaticamente incorreto).

- 401 Unauthorized: Autenticação necessária ou token inválido/expirado.

- 403 Forbidden: Servidor entendeu a requisição, mas o usuário não tem permissão de acesso.

- 404 Not Found: O recurso solicitado não existe na URL informada.

- 409 Conflict: Conflito no estado atual do recurso (ex.: tentar cadastrar um e-mail já existente).

- 422 Unprocessable Entity: Sintaxe correta, mas com erro de validação nos dados enviados.

5xx — Erros do Servidor (Server Errors)

- 500 Internal Server Error: Erro genérico ou não tratado no código da aplicação backend.

- 502 Bad Gateway: O servidor atuando como gateway/proxy recebeu uma resposta inválida.

- 503 Service Unavailable: O serviço está temporariamente indisponível (sobrecarga ou manutenção).

- 504 Gateway Timeout: O servidor intermediário não recebeu resposta a tempo do serviço principal.