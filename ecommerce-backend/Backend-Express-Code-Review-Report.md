# Backend Express Code Review Report

## Executive Summary
The backend has a solid modular baseline and very strong automated test pass rates (63/63) with high coverage, but it contains a few serious security and governance gaps that should be fixed before production use.

Top risks:
1. Privilege escalation during signup (client can request admin role).
2. Weak secret management (hardcoded JWT fallback secret and tracked `.env`).
3. Missing centralized validation and error-handling pipeline.

## Findings

### 1) Critical - Privilege escalation via signup role input
- Area: Security Best Practices
- Evidence: [ecommerce-backend/src/services/user.service.ts](ecommerce-backend/src/services/user.service.ts#L43), [ecommerce-backend/src/routes/user.routes.ts](ecommerce-backend/src/routes/user.routes.ts#L13)
- Why it matters: Any public signup caller can set `role: 'admin'` and receive elevated access, which can lead to full admin compromise.
- Recommended fix: Do not accept role from public signup; force `role='user'` in signup flow. Move admin assignment to protected admin-only endpoints.

### 2) High - Hardcoded JWT fallback secret in auth path
- Area: Security Best Practices
- Evidence: [ecommerce-backend/src/services/user.service.ts](ecommerce-backend/src/services/user.service.ts#L5), [ecommerce-backend/src/middlewares/auth.middleware.ts](ecommerce-backend/src/middlewares/auth.middleware.ts#L5)
- Why it matters: If environment config is missing/misconfigured, the app uses a known static secret, making token forgery feasible.
- Recommended fix: Fail startup when JWT secret is missing; remove insecure fallback constants.

### 3) High - `.env` is tracked and not ignored
- Area: Additional Checks
- Evidence: [ecommerce-backend/.gitignore](ecommerce-backend/.gitignore#L1)
- Why it matters: Version-controlled environment files can expose credentials and secrets through repo history.
- Recommended fix: Add `.env` and `.env.*` to gitignore policy, rotate leaked secrets, and keep only `.env.example` in source control.

### 4) Medium - JWT returned in response body despite HttpOnly cookie
- Area: Security Best Practices / API Design
- Evidence: [ecommerce-backend/src/controllers/user.controller.ts](ecommerce-backend/src/controllers/user.controller.ts#L61), [ecommerce-backend/src/controllers/user.controller.ts](ecommerce-backend/src/controllers/user.controller.ts#L102)
- Why it matters: Returning token JSON increases accidental exposure through logs, browser storage, and third-party scripts.
- Recommended fix: Keep token server-side in secure HttpOnly cookie only; remove token from response payload.

### 5) Medium - No centralized error middleware pipeline
- Area: Error Handling & Logging
- Evidence: [ecommerce-backend/src/app.ts](ecommerce-backend/src/app.ts#L55), [ecommerce-backend/src/app.ts](ecommerce-backend/src/app.ts#L63)
- Why it matters: Errors are handled ad-hoc per controller, causing inconsistent status/message behavior and weaker observability.
- Recommended fix: Add a global error handler and `next(err)` pattern; standardize response envelope for known/unknown errors.

### 6) Medium - Validation/sanitization is not middleware-driven
- Area: Express Middleware Usage
- Evidence: [ecommerce-backend/src/routes/user.routes.ts](ecommerce-backend/src/routes/user.routes.ts#L13), [ecommerce-backend/src/controllers/user.controller.ts](ecommerce-backend/src/controllers/user.controller.ts#L21), [ecommerce-backend/src/controllers/admin.controller.ts](ecommerce-backend/src/controllers/admin.controller.ts#L93)
- Why it matters: Repeated inline checks are brittle and can miss normalization/sanitization paths.
- Recommended fix: Introduce request schema middleware (Joi/Zod/express-validator) and a reusable validation error formatter.

### 7) Medium - Unsanitized regex queries built from user input
- Area: Security Best Practices / Performance
- Evidence: [ecommerce-backend/src/controllers/admin.controller.ts](ecommerce-backend/src/controllers/admin.controller.ts#L44), [ecommerce-backend/src/services/user.service.ts](ecommerce-backend/src/services/user.service.ts#L30)
- Why it matters: User-controlled regex can trigger expensive queries and regex abuse patterns.
- Recommended fix: Escape user input before regex construction or use exact normalized fields where possible.

### 8) Medium - Inventory update bypasses schema validators
- Area: MongoDB with Mongoose
- Evidence: [ecommerce-backend/src/controllers/admin.controller.ts](ecommerce-backend/src/controllers/admin.controller.ts#L154)
- Why it matters: `findByIdAndUpdate` without `runValidators: true` can allow invalid state into persisted documents.
- Recommended fix: Use `{ new: true, runValidators: true }` and enforce numeric bounds in schema.

### 9) Medium - Capstone scope mismatch for order flow resources
- Area: API Design & REST Principles
- Evidence: [README.md](README.md#L38), [README.md](README.md#L51), [ecommerce-backend/api.md](ecommerce-backend/api.md#L1)
- Why it matters: Required checkout/order lifecycle and order-status management are not represented in documented backend resources.
- Recommended fix: Add order model/routes/controllers/services for checkout, order creation, retrieval, and admin status updates.

### 10) Low - Type safety and style guardrails are relaxed
- Area: Additional Checks / Maintainability
- Evidence: [ecommerce-backend/tsconfig.json](ecommerce-backend/tsconfig.json#L12), [ecommerce-backend/package.json](ecommerce-backend/package.json#L6)
- Why it matters: `strict: false` and missing lint/format scripts increase long-term defect probability.
- Recommended fix: Enable strict TypeScript incrementally and add ESLint + Prettier scripts/gates.

## Category Scoring (Weighted)
1. Server and Route Architecture: 9/12  
Well modularized routes/controllers/services/models, but admin controller still holds heavy data logic and order-domain modules are missing.

2. Express Middleware Usage: 6/10  
Good core middleware ordering, but request validation and global error middleware are missing.

3. MongoDB with Mongoose: 10/14  
References and indexing are present in several models, but update validation safeguards are incomplete.

4. API Design & REST Principles: 10/14  
Resource naming and HTTP usage are generally consistent; pagination is present, but order/checkout resource coverage is incomplete.

5. Error Handling & Logging: 6/10  
Controller-level try/catch exists, but there is no unified error boundary and logs are basic.

6. Security Best Practices: 5/14  
Bcrypt and auth middleware exist, but role escalation, fallback secret, token exposure, and weak input hardening are significant.

7. Performance & Optimization: 8/10  
Lean queries/pagination/projections are commonly used; regex-heavy query patterns and missing resilience patterns remain.

8. Unit Testing with Jest/Vitest: 11/12  
Excellent pass rate and strong coverage metrics, but integration tests for critical auth/admin flows are limited.

9. Additional Checks: 2/4  
Useful dev/test/build scripts exist, but `.env` handling and lint/format governance need attention.

## Final Weighted Score
67 / 100

## Test & Coverage Evidence
- Test command: `npm run test`
- Result: 20 test files passed, 63 tests passed, 0 failed.
- Coverage command: `npm run test:coverage`
- Summary: statements 95.37%, lines 95.35%, functions 100%, branches 81.2%.

## Improvement Plan

### Quick wins (1 day)
1. Block role assignment in public signup and force default user role.
2. Remove JWT fallback secret; fail fast if missing env vars.
3. Stop returning token in JSON response body.
4. Add `.env` patterns to gitignore and rotate secrets.

### Structural refactors (multi-day)
1. Introduce centralized validation middleware and shared schemas.
2. Add centralized error middleware and typed domain error classes.
3. Split remaining controller-heavy admin logic into services.

### Testing roadmap
1. Add integration tests for signup/login/logout/profile and admin inventory authorization boundaries.
2. Add failure-case tests for malformed IDs, invalid payloads, and regex/validation edge cases.
3. Add smoke tests for CORS rejection and unauthorized access behavior.

## Suggestions
1. API design and REST compliance: introduce order and checkout endpoints with explicit lifecycle states.
2. Mongoose schema optimization and relationships: enforce min/max validations (price/rating) and run validators on updates.
3. Error and exception handling: move to centralized error middleware with consistent response envelope.
4. Middleware modularity and clarity: add validation and sanitization middleware per route group.
5. Test coverage and mocking strategy: keep unit tests, add supertest integration tests for critical auth/admin paths.
6. Code readability, structure, and maintainability: increase TypeScript strictness and add lint/format CI checks.
