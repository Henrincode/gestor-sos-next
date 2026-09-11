```js
try {
  const response = await fetch('/api/users', { method: 'POST', body: JSON.stringify(data) })

  // Trata todos os erros HTTP (4xx, 5xx) de uma só vez
  if (!response.ok) {
    const errorData = await response.json()
    console.error(`Erro ${response.status}:`, errorData.message)
    return
  }

  // Trata requisições 204 No Content que não possuem corpo JSON
  if (response.status === 204) {
    return
  }

  // Sucesso com conteúdo (200, 201)
  const data = await response.json()
  console.log("Sucesso:", data)

} catch (error) {
  // Entra aqui APENAS em falhas de conexão de rede ou erros no parse do JSON
  console.error("Erro de rede ou conexão:", error)
}
```