# API

Convenções: JSON, erros `{ "error": { "code": "...", "message": "..." } }`, 400 validação,
401 sem autenticação, 403 sem permissão, 404 não achado, 409 conflito, 500 infra (nunca mascarado como 401).

## `POST /orders` — F-001 (pedido)
- **Permissão:** <papel>
- **Entrada:** `{ clienteId: uuid, valor: number > 0 }`
- **Saída 201:** `{ id, numero, status }`
- **Erros:** 400 `valor_invalido` · 404 `cliente_nao_encontrado`
- **Auditoria:** registra `pedido.criado` (chaves, nunca valores pessoais)
