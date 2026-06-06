# Instruções para Agentes de IA (AI Agents Guidelines)

Este arquivo define as regras fundamentais que qualquer assistente de Inteligência Artificial deve seguir ao manipular ou analisar a base de código do **NativeForge**.

## 1. Contexto do Projeto
O NativeForge é uma ferramenta de CLI voltada para produtividade em React Native e Expo. Ela resolve o problema da falta de arquitetura padrão ao mesclar o conceito de cópia e cola de UI (shadcn) com a injeção de infraestrutura e domínios.

## 2. Padrões de Arquitetura Esperados
- **Separação de Preocupações:** Views não possuem regra de negócio. Todo código de interface (pasta `ui/`) deve ser "burro", recebendo dados puramente por propriedades.
- **ViewModels:** A lógica das telas deve morar em hooks customizados na mesma pasta da tela (ex: `useLogin.ts`), nunca diretamente dentro da view.
- **Gestão de Estado:** Assíncrono com **React Query** e Síncrono Global com **Zustand**.

## 3. Estrutura do Monorepo
O projeto roda em `pnpm` workspaces e usa `Turborepo`.
- Ao gerar scripts que impactem múltiplos pacotes, use a CLI do turbo: `pnpm turbo run build`.
- Evite instalar dependências globais na raiz a não ser que sejam linters ou formatadores. Dependências dos pacotes devem estar no `package.json` do respectivo pacote.

## 4. Testes e Qualidade
- Qualquer nova funcionalidade no CLI (`packages/cli`) EXIGE testes unitários (Vitest).
- Qualquer modificação nos componentes (`packages/registry`) DEVE ser garantida visualmente ou testada.
- Respeite o Prettier/ESLint do projeto rigorosamente antes de propor modificações.

## 5. Governança
- Modificações grandes devem seguir o formato de Commits Atômicos.
- Lembre-se: O código baixado pelos usuários do NativeForge vem do diretório de raw content, não injete lógicas que quebrem apps standalone.
