# **Destaques:**

### 2xx — Sucesso (Success)

* **200 OK:** Requisição processada com sucesso. Usado para respostas com dados (`GET`, `PUT`, `PATCH`).
* **201 Created:** Recurso criado com sucesso. Retornado após um `POST` bem-sucedido.
* **204 No Content:** Requisição concluída com sucesso, mas sem conteúdo no corpo da resposta. Comum em deleções (`DELETE`).

### 3xx — Redirecionamento (Redirection)

* **301 Moved Permanently:** O recurso mudou de URI permanentemente.
* **304 Not Modified:** O recurso não mudou desde a última requisição. Usado para otimização de cache.

### 4xx — Erros do Cliente (Client Errors)

* **400 Bad Request:** A requisição é inválida ou malformada (ex.: JSON sintaticamente incorreto).
* **401 Unauthorized:** Autenticação necessária ou token inválido/expirado.
* **403 Forbidden:** Servidor entendeu a requisição, mas o usuário não tem permissão de acesso.
* **404 Not Found:** O recurso solicitado não existe na URL informada.
* **405 Method Not Allowed:** O recurso existe na URL, mas o método HTTP utilizado (ex.: GET, POST) não é suportado por esse endpoint.
* **409 Conflict:** Conflito no estado atual do recurso (ex.: tentar cadastrar um e-mail já existente).
* **422 Unprocessable Entity:** Sintaxe correta, mas com erro de validação nos dados enviados.

### 5xx — Erros do Servidor (Server Errors)

* **500 Internal Server Error:** Erro genérico ou não tratado no código da aplicação backend.
* **502 Bad Gateway:** O servidor atuando como gateway/proxy recebeu uma resposta inválida.
* **503 Service Unavailable:** O serviço está temporariamente indisponível (sobrecarga ou manutenção).
* **504 Gateway Timeout:** O servidor intermediário não recebeu resposta a tempo do serviço principal.

# **Todos:**

### 1xx — Informacionais (Informational)

* **100 Continue:** O servidor recebeu os cabeçalhos iniciais e o cliente pode continuar enviando o corpo da requisição.
* **101 Switching Protocols:** O cliente pediu para trocar de protocolo (ex.: migrar para WebSocket) e o servidor aceitou.
* **102 Processing:** O servidor recebeu a requisição e ainda está processando (WebDAV).
* **103 Early Hints:** Retorna cabeçalhos HTTP antes da resposta final para pré-carregamento de recursos.

### 2xx — Sucesso (Success)

* **200 OK:** **(Destaque)** Requisição processada com sucesso. Usado para respostas com dados (`GET`, `PUT`, `PATCH`).
* **201 Created:** **(Destaque)** Recurso criado com sucesso. Retornado após um `POST` bem-sucedido.
* **202 Accepted:** A requisição foi aceita para processamento, mas ainda não foi concluída (tarefas assíncronas/filas).
* **203 Non-Authoritative Information:** Servidor processou a requisição, mas retornou dados obtidos de outra fonte.
* **204 No Content:** **(Destaque)** Requisição concluída com sucesso, mas sem conteúdo no corpo da resposta. Comum em deleções (`DELETE`).
* **205 Reset Content:** Solicita que o cliente limpe o documento/formulário que enviou a requisição.
* **206 Partial Content:** Utilizado em requisições de trechos de arquivos (streaming ou downloads em partes).
* **207 Multi-Status:** Transmite status de múltiplas operações em uma só resposta (WebDAV).
* **208 Already Reported:** Evita enumerar repetidamente os membros de um mesmo vínculo (WebDAV).
* **226 IM Used:** O servidor cumpriu uma requisição `GET` e a resposta é o resultado de manipulações aplicadas.

### 3xx — Redirecionamento (Redirection)

* **300 Multiple Choices:** O recurso possui múltiplos caminhos e o cliente deve escolher um.
* **301 Moved Permanently:** **(Destaque)** O recurso mudou de URI permanentemente.
* **302 Found:** Redirecionamento temporário para outra URL.
* **303 See Other:** Redirecionamento que força o cliente a buscar o novo recurso via `GET`.
* **304 Not Modified:** **(Destaque)** O recurso não mudou desde a última requisição. Usado para otimização de cache.
* **305 Use Proxy:** *(Obsoleto)* O recurso deve ser acessado por meio de um proxy específico.
* **307 Temporary Redirect:** Redirecionamento temporário mantendo o mesmo método HTTP original.
* **308 Permanent Redirect:** Redirecionamento permanente mantendo o mesmo método HTTP original.

### 4xx — Erros do Cliente (Client Errors)

* **400 Bad Request:** **(Destaque)** A requisição é inválida ou malformada (ex.: JSON sintaticamente incorreto).
* **401 Unauthorized:** **(Destaque)** Autenticação necessária ou token inválido/expirado.
* **402 Payment Required:** Reservado para uso futuro (às vezes usado em APIs pagas por falta de crédito).
* **403 Forbidden:** **(Destaque)** Servidor entendeu a requisição, mas o usuário não tem permissão de acesso.
* **404 Not Found:** **(Destaque)** O recurso solicitado não existe na URL informada.
* **405 Method Not Allowed:** **(Destaque)** O recurso existe na URL, mas o método HTTP utilizado (ex.: GET, POST) não é suportado por esse endpoint.
* **406 Not Acceptable:** Servidor não consegue gerar uma resposta compatível com os cabeçalhos `Accept` do cliente.
* **407 Proxy Authentication Required:** O cliente precisa se autenticar primeiro com um proxy.
* **408 Request Timeout:** O cliente demorou demais para enviar a requisição e o servidor encerrou a conexão.
* **409 Conflict:** **(Destaque)** Conflito no estado atual do recurso (ex.: tentar cadastrar um e-mail já existente).
* **410 Gone:** O recurso foi permanentemente apagado e não retornará mais.
* **411 Length Required:** O servidor exige que o cabeçalho `Content-Length` seja especificado.
* **412 Precondition Failed:** Uma das pré-condições definidas nos cabeçalhos da requisição falhou no servidor.
* **413 Payload Too Large:** O corpo da requisição é maior do que o limite aceito pelo servidor.
* **414 URI Too Long:** A URL informada é mais longa do que o servidor aceita processar.
* **415 Unsupported Media Type:** O formato de mídia dos dados enviados não é suportado pelo servidor.
* **416 Range Not Satisfiable:** O trecho do arquivo solicitado via header `Range` não pode ser servido.
* **417 Expectation Failed:** A expectativa indicada no cabeçalho `Expect` não pôde ser cumprida.
* **418 I'm a teapot:** Erro da RFC 2324 (piada de 1º de abril), usado como *easter egg*.
* **421 Misdirected Request:** Requisição direcionada a um servidor incapaz de produzir uma resposta.
* **422 Unprocessable Entity:** **(Destaque)** Sintaxe correta, mas com erro de validação nos dados enviados.
* **423 Locked:** O recurso acessado está bloqueado (WebDAV).
* **424 Failed Dependency:** A requisição falhou devido à falha de uma requisição anterior (WebDAV).
* **425 Too Early:** Servidor recusa processar uma requisição que pode ser repetida (*replay attack*).
* **426 Upgrade Required:** O cliente deve mudar para um protocolo diferente (ex.: TLS/1.3).
* **428 Precondition Required:** Exige que a requisição seja condicional para evitar conflitos de edição.
* **429 Too Many Requests:** Limite de requisições excedido pelo cliente (Rate Limiting).
* **431 Request Header Fields Too Large:** Os campos de cabeçalho da requisição são grandes demais.
* **451 Unavailable For Legal Reasons:** Acesso bloqueado por ordem legal ou censura.

### 5xx — Erros do Servidor (Server Errors)

* **500 Internal Server Error:** **(Destaque)** Erro genérico ou não tratado no código da aplicação backend.
* **501 Not Implemented:** Servidor não suporta a funcionalidade necessária para atender a requisição.
* **502 Bad Gateway:** **(Destaque)** O servidor atuando como gateway/proxy recebeu uma resposta inválida.
* **503 Service Unavailable:** **(Destaque)** O serviço está temporariamente indisponível (sobrecarga ou manutenção).
* **504 Gateway Timeout:** **(Destaque)** O servidor intermediário não recebeu resposta a tempo do serviço principal.
* **505 HTTP Version Not Supported:** A versão do protocolo HTTP usada na requisição não é suportada.
* **506 Variant Also Negotiates:** Erro na configuração interna de negociação de conteúdo do servidor.
* **507 Insufficient Storage:** Servidor sem espaço de armazenamento para concluir a requisição (WebDAV).
* **508 Loop Detected:** O servidor detectou um loop infinito ao processar a requisição (WebDAV).
* **510 Not Extended:** Necessárias mais extensões na requisição para que o servidor possa atendê-la.
* **511 Network Authentication Required:** O cliente precisa se autenticar para obter acesso à rede.