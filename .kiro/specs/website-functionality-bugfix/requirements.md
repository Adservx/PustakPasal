# Requirements Document

## Introduction

This document outlines the requirements for making the Hamro Pustak Pasal (Nepali bookstore) website fully functional with bug fixes in the UI. The website is built with Next.js 16, Supabase for backend, and uses Tailwind CSS with Framer Motion for animations. The goal is to ensure all features work correctly, fix UI inconsistencies, and provide a seamless user experience across all pages.

## Glossary

- **Hamro Pustak Pasal**: The Nepali bookstore web application
- **Book**: A product entity containing title, author, price, formats, and metadata
- **Cart**: A client-side storage mechanism for items users intend to purchase
- **Wishlist**: A client-side storage mechanism for books users want to save for later
- **Admin Dashboard**: A protected area for administrators to manage book inventory
- **Supabase**: The backend-as-a-service platform providing database and authentication

## Requirements

### Requirement 1: Admin Book Management

**User Story:** As an admin, I want to add and edit books in the inventory, so that I can manage the bookstore catalog effectively.

#### Acceptance Criteria

1. WHEN an admin navigates to the add book page THEN the System SHALL display a form with fields for title, author, description, price, cover URL, and genres
2. WHEN an admin submits a valid book form THEN the System SHALL create the book in the database and redirect to the admin dashboard
3. WHEN an admin navigates to edit a book THEN the System SHALL pre-populate the form with existing book data
4. WHEN an admin updates book information THEN the System SHALL save changes to the database and redirect to the admin dashboard
5. IF an admin submits invalid form data THEN the System SHALL display appropriate validation error messages

### Requirement 2: Shopping Cart Functionality

**User Story:** As a customer, I want to manage items in my shopping cart, so that I can review and modify my purchases before checkout.

#### Acceptance Criteria

1. WHEN a user adds a book to cart THEN the System SHALL update the cart count in the navbar immediately
2. WHEN a user views the cart drawer THEN the System SHALL display all cart items with correct prices and quantities
3. WHEN a user modifies item quantity THEN the System SHALL recalculate totals including subtotal, shipping, and tax
4. WHEN a user removes an item from cart THEN the System SHALL update the cart display and totals immediately
5. WHEN a user navigates to the cart page THEN the System SHALL display the complete order summary with checkout option

### Requirement 3: Book Detail Page

**User Story:** As a customer, I want to view detailed information about a book, so that I can make an informed purchase decision.

#### Acceptance Criteria

1. WHEN a user navigates to a book detail page THEN the System SHALL display the book cover, title, author, description, and pricing
2. WHEN a user selects a format THEN the System SHALL update the displayed price for that format
3. WHEN a user adds a book to cart from the detail page THEN the System SHALL add the selected format and price to the cart
4. WHEN a book has related books THEN the System SHALL display up to 5 related book recommendations
5. WHEN a book page loads THEN the System SHALL display the book rating and review count

### Requirement 4: Authentication Flow

**User Story:** As a user, I want to sign up and log in to the website, so that I can access personalized features and admin functionality.

#### Acceptance Criteria

1. WHEN a user submits valid login credentials THEN the System SHALL authenticate the user and redirect to the home page
2. WHEN a user submits valid signup information THEN the System SHALL create an account and send confirmation email
3. WHEN authentication fails THEN the System SHALL display a clear error message
4. WHEN a logged-in user clicks logout THEN the System SHALL end the session and update the navbar state
5. WHEN an unauthenticated user accesses admin pages THEN the System SHALL redirect to the login page

### Requirement 5: Book Browsing and Filtering

**User Story:** As a customer, I want to browse and filter books, so that I can find books that match my interests.

#### Acceptance Criteria

1. WHEN a user visits the books page THEN the System SHALL display all available books in a grid layout
2. WHEN a user applies genre filters THEN the System SHALL display only books matching selected genres
3. WHEN a user applies price range filter THEN the System SHALL display only books within the price range
4. WHEN a user searches by keyword THEN the System SHALL filter books by title, author, or description
5. WHEN a user selects a mood filter THEN the System SHALL display books matching that mood

### Requirement 6: Wishlist Management

**User Story:** As a customer, I want to save books to my wishlist, so that I can keep track of books I want to purchase later.

#### Acceptance Criteria

1. WHEN a user adds a book to wishlist THEN the System SHALL persist the selection in local storage
2. WHEN a user views the wishlist page THEN the System SHALL display all wishlisted books
3. WHEN a user removes a book from wishlist THEN the System SHALL update the display immediately
4. WHEN a user toggles wishlist on a book card THEN the System SHALL update the heart icon state

### Requirement 7: Responsive UI Design

**User Story:** As a user, I want the website to work well on all devices, so that I can browse and shop from any screen size.

#### Acceptance Criteria

1. WHEN a user views the website on mobile THEN the System SHALL display a mobile-optimized navigation menu
2. WHEN a user views book cards on mobile THEN the System SHALL display them in a responsive grid
3. WHEN a user opens the cart drawer on mobile THEN the System SHALL display it as a full-width panel
4. WHEN a user views the admin dashboard on mobile THEN the System SHALL display a card-based layout instead of table

### Requirement 8: Data Persistence and Loading States

**User Story:** As a user, I want the website to handle data loading gracefully, so that I have a smooth browsing experience.

#### Acceptance Criteria

1. WHEN data is being fetched THEN the System SHALL display appropriate loading indicators
2. WHEN no books match filter criteria THEN the System SHALL display an empty state with clear messaging
3. WHEN a database error occurs THEN the System SHALL fall back to mock data gracefully
4. WHEN cart or wishlist data exists in local storage THEN the System SHALL restore it on page load
