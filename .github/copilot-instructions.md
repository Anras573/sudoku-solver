# Copilot Custom Instructions

## TypeScript configuration

- **Do not add test-only type packages** (e.g. `vitest/globals`) to `tsconfig.app.json`'s `types` array. App tsconfig should only reference runtime/client types (e.g. `vite/client`). If test globals are needed, configure them in a dedicated `tsconfig.test.json` that extends the base config.
- Tests should import Vitest APIs explicitly (`import { describe, it, expect } from 'vitest'`) rather than relying on ambient globals.

## TypeScript type safety

- **Avoid misleading type assertions.** Do not use `someValue as LiteralType` to silence the compiler when the runtime value is not actually that type (e.g. `i as 0` when `i` iterates over `[0, 1, …, 8]`). Instead, derive a proper union type from a `as const` tuple:
  ```ts
  const INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const
  type Index = (typeof INDICES)[number]
  ```
- Prefer `as unknown as T` only where a structural cast is genuinely necessary (e.g. mapping a plain array to a branded tuple type), and add a comment explaining why.

## Test helpers and domain types

- **Test helpers must mirror real domain types.** When writing helper functions for test data, reuse the actual domain types for parameters and return values instead of widening them with rest parameters or conditional-type casts.
  - ✅ `function candidates(list: CandidateList): Cell`
  - ❌ `function candidates(...vals: SudokuDigit[]): Cell` with a conditional assertion
- This ensures test data is subject to the same constraints as production data and that future type changes in domain types surface immediately in tests.
