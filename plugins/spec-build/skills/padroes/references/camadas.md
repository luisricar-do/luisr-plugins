# Camadas e estrutura

## Monorepo

```
<produto>/
  package.json              # workspaces, scripts agregados, packageManager fixado
  pnpm-workspace.yaml
  tsconfig.base.json
  apps/
    api/
      src/
        config/env.ts       # parseEnv: parser puro, testável, não lê nada no import
        config/index.ts     # único leitor de process.env: env = parseEnv(process.env)
        app.ts              # buildApp(deps): monta Fastify, registra módulos, sem listen
        server.ts           # entrypoint: buildApp + listen + shutdown gracioso
        errors.ts           # classes de erro + mapeador HTTP
        lib/                # logger, db pool, utilidades sem domínio
        modules/
          <dominio>/        # ex.: pedidos
            routes.ts       # HTTP: schema de entrada/saída, chama service, nada de regra
            service.ts      # caso de uso: autoriza, orquestra domain + repository + adapter
            domain.ts       # regra pura: funções sem I/O, 100% testáveis
            repository.ts   # SQL parametrizado; devolve tipos do domínio
            schemas.ts      # zod da borda + tipos inferidos
        adapters/
          <externo>.ts      # cliente de sistema externo atrás de interface
      db/migrations/NNN_<descricao>.sql
      test/
    web/                    # Next 15 (ver frontend.md)
  packages/
    shared/                 # tipos e schemas compartilhados api↔web (sem I/O)
  spec/                     # o pacote de spec (contrato)
```

## Direção das dependências

```
routes ──▶ service ──▶ domain
               │──────▶ repository ──▶ db
               └──────▶ adapter ─────▶ externo
```

- `domain` não importa nada de I/O (nem `pg`, nem `fetch`, nem `config`).
- `routes` não importa `repository` nem `adapter`.
- `service` recebe repository e adapter **por parâmetro** (fábrica), nunca importa instância global.
- Um módulo não lê a tabela de outro: chama o service dele.

## Exemplo mínimo

```ts
// modules/orders/domain.ts
export type OrderStatus = 'pending' | 'paid' | 'cancelled';
export function canCancel(status: OrderStatus): boolean {
  return status === 'pending';
}

// modules/orders/service.ts
import { ForbiddenError, NotFoundError, ConflictError } from '../../errors.js';
import { canCancel } from './domain.js';
import type { OrderRepository } from './repository.js';

export function makeOrderService(deps: { repo: OrderRepository }) {
  return {
    async cancel(actor: { id: string; role: string }, orderId: string) {
      const order = await deps.repo.findById(orderId);
      if (!order) throw new NotFoundError('order_not_found');
      if (actor.role !== 'manager' && order.ownerId !== actor.id) throw new ForbiddenError('not_owner');
      if (!canCancel(order.status)) throw new ConflictError('order_not_cancellable');
      return deps.repo.updateStatus(orderId, 'cancelled');
    },
  };
}
export type OrderService = ReturnType<typeof makeOrderService>;

// modules/orders/routes.ts
import type { FastifyInstance } from 'fastify';
import type { OrderService } from './service.js';
import { CancelParams } from './schemas.js';

export function orderRoutes(app: FastifyInstance, svc: OrderService) {
  app.post('/orders/:id/cancel', async (req) => {
    const { id } = CancelParams.parse(req.params);
    return svc.cancel(req.actor, id);
  });
}
```

## Repositório

- SQL parametrizado sempre (`$1`), nunca concatenação. Migrations numeradas, aplicadas no boot ou
  por job, nunca à mão em produção.
- Prisma só se o ADR do produto escolheu; mesmo assim, o service não vê o client do Prisma, só a
  interface do repository.
- Erro do driver vira erro de domínio no repository (`23505` → `ConflictError`); SQLSTATE e
  mensagem do Postgres nunca saem dali.

## Adapter

- Interface no lado de quem usa (`interface PaymentGateway { charge(...) }`), implementação no adapter.
- Timeout explícito, retry só em operação idempotente, chave de idempotência quando o externo aceita.
- Falha do externo vira erro nomeado (`ExternalServiceError`) com o nome do sistema, sem o corpo
  da resposta no log.
- Teste com fake da interface; nada de chamada real em teste unitário.
