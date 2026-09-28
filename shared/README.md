# Shared API contract

The client and server currently mirror the same event, registration and stats shapes in their local TypeScript modules to keep each build independently compilable. This directory is reserved for the canonical contract extraction step when the project adopts a shared package build; the durable field contract is documented in `server/src/types/domain.ts` and validated at the API boundary with Zod.
