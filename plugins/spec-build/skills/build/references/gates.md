# Gates

| Gate | Nome | Quem decide | Passa quando | Evidência no `progresso.md` |
|---|---|---|---|---|
| G0 | Spec aprovada | avaliador (skill `pre-avaliacao`) | `APROVACAO.md` aprovado e versão igual ao manifest | link do `APROVACAO.md` |
| G1 | Plano da fatia | pessoa | "pode seguir" ao plano `S-NN.md` | data + resumo do plano |
| G2 | Build verde | comando | `typecheck`, `test`, `build` (e `test:integration` se tocou banco) com código 0 | comandos e saída final |
| G3 | Segurança | `revisor-seguranca` | zero achado crítico ou alto; médios corrigidos ou aceitos por escrito | lista de achados e decisão |
| G4 | Revisão | `revisor-codigo` | veredito `aprovado`, sem `não faça` dos aprendizados violado | veredito e itens resolvidos |
| G5 | Aceite humano | pessoa | "aceito" depois da demo da fatia | data, screenshots/jornada, PR |

## Regras

- Ordem fixa: G1 → (implementação) → G2 → G3 → G4 → G5. Correção depois de G3 ou G4 repete a
  partir de G2.
- G2 é sempre o comando de verdade rodado por você, nunca a palavra de um subagente.
- Limite de 3 voltas por gate; na quarta, a pessoa decide (simplificar a fatia, aceitar o risco,
  mudar a spec).
- Aceite de risco é sempre por escrito e só para severidade média ou baixa. Crítico e alto não se
  aceitam: se corrigem.
- O CI do repositório repete G2 e parte do G3 (audit, gitleaks, greps anti-drift) no PR: o merge
  depende dele verde.
