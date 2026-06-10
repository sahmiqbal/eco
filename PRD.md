# Product Requirements Document (PRD)

## 1. Product Overview

**Product name:** Dar Nour e-commerce storefront

**Description:**
A bilingual Moroccan beauty and wellness web app that enables customers to browse curated natural skincare products and bundles, add items to a cart, place orders, and receive order confirmations. An admin portal supports product management, order tracking, and status updates.

**Target audience:**
- Moroccan customers seeking authentic natural cosmetics and hammam ritual products
- Marketing and operations staff who manage inventory, orders, and product catalogs

## 2. Goals

- Launch a polished online storefront for natural Moroccan beauty products
- Provide an intuitive shopping experience with product discovery, search, and filtering
- Enable checkout with customer contact details and order persistence
- Offer admin tools for managing products, viewing recent orders, and updating order status
- Support bilingual experience in French and Arabic

## 3. Key Features

### 3.1 Customer-facing features

- Home page with hero banner, featured products, benefits, testimonials, and CTA
- Browsable shop page with:
  - product search by name and description
  - category filters: all, packs, individual products
  - product cards with pricing and featured status
- Product detail page with:
  - image carousel
  - before/after image comparison (if available)
  - tiered pricing by quantity
  - stock availability
  - add-to-cart functionality
- Cart page with:
  - item quantity controls
  - item removal
  - order summary and total
  - navigation to checkout
- Checkout flow with:
  - customer name, phone, city, address, and contact preference
  - validation for required fields and phone format
  - order submission to Supabase
  - order confirmation and WhatsApp or callback follow-up
- Global footer with navigation links and contact information

### 3.2 Admin-facing features

- Admin login page using Supabase email/password authentication
- Admin dashboard with:
  - order summary cards for today, pending, confirmed, and total
  - recent order list and notification badge for new orders
- Orders page with:
  - search by name, phone, or city
  - status filtering
  - expandable order details
  - status update controls
  - internal notes editing
  - WhatsApp contact shortcuts for customers
- Products page with:
  - product creation and editing
  - image upload to Supabase Storage
  - before/after image support
  - stock, pricing, category, and featured flag editing
  - product deletion

## 4. User Personas

### 4.1 Amina, Online Shopper

- Seeks natural Moroccan skincare bundles
- Wants to review product details, pricing, and stock availability
- Expects fast product search and checkout
- Prefers communicating via WhatsApp or phone

### 4.2 Hanan, Store Admin

- Manages product catalogue and inventory
- Reviews new orders and updates order status
- Needs a simple admin dashboard for order visibility
- Wants easy access to customer contact methods

## 5. Functional Requirements

### 5.1 Homepage

- Display hero section with brand messaging
- Fetch featured products from Supabase `products` table where `is_featured` = true
- Render product cards for featured items
- Show value propositions and testimonials

### 5.2 Shop and Product Search

- Fetch products from Supabase `products` table
- Filter by query parameter `category`
- Search client-side across product name and description
- Display no-results UI when no product matches

### 5.3 Product Details

- Fetch product by slug from Supabase
- Display tiered pricing for single, 2-unit, and 3+ unit pricing
- Calculate bundle price dynamically
- Allow quantity selection and add items to cart
- Include before/after image comparison component when both images are present

### 5.4 Cart

- Maintain cart state using local state or Zustand store
- Update quantity and remove items
- Show subtotal and total in Moroccan Dirham (MAD)
- Persist cart across navigation during session

### 5.5 Checkout

- Validate user input fields before submission
- Verify stock availability against latest Supabase `products` inventory before order creation
- Create an order in Supabase `orders` table with `items`, `total`, `status`, and `contact_preference`
- Optionally decrement stock using a backend RPC or function
- On order confirmation, provide a WhatsApp deep link or callback dialog

### 5.6 Admin Authentication

- Use environment-stored admin credentials for login fields
- Authenticate via Supabase auth signInWithPassword
- Redirect to admin dashboard on success

### 5.7 Admin Dashboard and Orders

- Display order metrics and notifications for new orders
- Keep dashboard updated via Supabase realtime subscriptions
- Provide order status filtering and search capability
- Allow inline order note editing and status transitions

### 5.8 Product Management

- Fetch product list and display search results
- Support product create/edit dialogs with image uploads
- Upload product images to Supabase Storage bucket `product-images`
- Store product metadata, description, ingredients, stock, pricing, category, and featured flag
- Delete products from Supabase

## 6. Data Model

### Products

Fields include:
- `id`
- `name`
- `slug`
- `price`, `price_2`, `price_3plus`
- `image_url`, `image_urls`
- `before_image`, `after_image`
- `description`, `ingredients`
- `category` (`individual` | `pack`)
- `stock`
- `is_featured`
- `created_at`

### Orders

Fields include:
- `id`
- `name`
- `phone`
- `city`
- `address`
- `items` (array of order line items)
- `total`
- `status` (`pending`, `confirmed`, `preparing`, `dispatched`, `delivered`, `cancelled`)
- `contact_preference` (`whatsapp`, `call`)
- `note`
- `created_at`

## 7. User Experience and Navigation

### Customer flows

- `/` -> homepage
- `/shop` -> product listing with search and category filters
- `/shop/:slug` -> product detail page
- `/cart` -> shopping cart review
- `/checkout` -> order placement

### Admin flows

- `/admin/login` -> login page
- `/admin/dashboard` -> admin overview
- `/admin/orders` -> order management
- `/admin/products` -> product management

## 8. Technology Stack

- Frontend: React 19 + Vite
- Routing: React Router DOM
- State management: Zustand
- Styling: Tailwind CSS v4 + custom shadcn-ui components
- Backend: Supabase for database, auth, storage, and realtime updates
- i18n: custom `LanguageProvider` supporting French and Arabic

## 9. Non-Functional Requirements

- Responsive layout for desktop and mobile
- Fast product fetch and incremental loading
- Secure admin-only pages behind Supabase auth
- Clear error messaging and loading states
- Accessible form controls and buttons
- Scalable product catalog with Supabase backend

## 10. Acceptance Criteria

- Customers can browse the homepage, shop, view products, and place orders
- Cart maintains selected items and computes correct totals
- Checkout validates customer details and submits an order successfully
- Admin users can log in, view order summaries, and update order status
- Admin can add/edit/delete products and publish product images
- The app supports both French and Arabic UI labels

## 11. Open Items

- Define final payment flow or integration beyond current order submission
- Confirm shipping fees logic and free delivery threshold in production
- Establish admin role management and access control beyond single credential login
- Add support for user accounts and order history in future iterations
