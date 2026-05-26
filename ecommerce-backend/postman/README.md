# Postman API Testing Guide

## Files
- `ecommerce-backend.postman_collection.json`
- `ecommerce-backend.postman_environment.json`

## 1. Start Backend
Run from `ecommerce-backend`:

```bash
npm run dev
```

Default base URL is `http://localhost:5000`.

## 2. Import in Postman
1. Open Postman.
2. Click Import.
3. Import both files in this folder.
4. Select environment: `Ecommerce Backend Local`.

## 3. Recommended Run Order
1. Health -> GET /
2. Auth -> POST /api/auth/signup (first time only)
3. Auth -> POST /api/auth/login
4. Categories -> GET /api/categories
5. Types -> GET /api/types/category/:categoryId
6. Products/Brands/FAQs/Blogs/Content requests
7. Admin folder requests (requires admin login token)

## 4. Auto Variables
The collection automatically stores:
- `token` from login response
- `categoryId` and `typeId` from categories/types/options responses
- `adminProductId` from create inventory response

## 5. Notes
- Admin routes require an admin user token.
- If signup for admin fails because user exists, just run login.
- If your app runs on a different port, edit `baseUrl` in environment.
