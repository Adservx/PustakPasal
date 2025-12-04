# Implementation Plan

- [x] 1. Set up testing infrastructure
  - [x] 1.1 Install testing dependencies (vitest, @testing-library/react, fast-check)
    - Add vitest, @testing-library/react, @testing-library/user-event, fast-check, jsdom to devDependencies
    - Create vitest.config.ts with React and jsdom support
    - Add test scripts to package.json
    - _Requirements: Testing Strategy_

- [x] 2. Implement Admin Book Form Component
  - [x] 2.1 Create reusable BookForm component

    - Create src/components/features/BookForm.tsx
    - Include fields: title, author, description, excerpt, cover_url, prices (hardcover, paperback, ebook, audiobook), formats, genres, publisher, pages, isbn, is_bestseller, is_new, mood
    - Implement form validation for required fields (title, author)
    - Support both create and edit modes via props
    - _Requirements: 1.1, 1.3, 1.5_
  - [x]* 2.2 Write property test for form validation
    - **Property 14: Invalid form data shows validation errors**
    - **Validates: Requirements 1.5**
  - [x] 2.3 Update Add Book page to use BookForm
    - Update src/app/admin/add/page.tsx to use BookForm component
    - Wire up createBook server action with all book fields
    - Add success/error feedback
    - _Requirements: 1.1, 1.2_
  - [x] 2.4 Add updateBook server action to actions.ts
    - Add updateBook function to src/app/admin/actions.ts
    - Accept all book fields including prices, formats, genres, mood
    - Validate admin role before update
    - Revalidate admin path after update
    - _Requirements: 1.4_
  - [x] 2.5 Update Edit Book page to use BookForm
    - Update src/app/admin/edit/[id]/page.tsx to use BookForm component
    - Pre-populate BookForm with existing book data
    - Wire up updateBook server action from actions.ts
    - _Requirements: 1.3, 1.4_
  - [x]* 2.6 Write property test for book update round-trip
    - **Property 13: Book update round-trip consistency**
    - **Validates: Requirements 1.4**

- [x] 3. Checkpoint - Ensure all tests pass
  - All 18 tests pass

- [x] 4. Fix Cart Functionality
  - [x] 4.1 Verify cart store operations work correctly
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [x]* 4.2 Write property tests for cart calculations
    - **Property 1: Cart total calculation consistency**
    - **Property 2: Cart item addition increases count**
    - **Property 3: Cart item removal decreases total**
    - **Validates: Requirements 2.1, 2.3, 2.4**
  - [x] 4.3 Fix CartDrawer component issues
    - _Requirements: 2.2, 7.3_
  - [x] 4.4 Verify Cart page functionality
    - _Requirements: 2.5_

- [x] 5. Fix Book Detail Page
  - [x] 5.1 Verify format selection and pricing
    - _Requirements: 3.2_
  - [x]* 5.2 Write property test for format-price mapping
    - **Property 10: Format selection updates price correctly**
    - **Property 11: Add to cart from detail page uses selected format**
    - **Validates: Requirements 3.2, 3.3**
  - [x] 5.3 Verify add to cart from detail page
    - _Requirements: 3.3_
  - [x] 5.4 Verify related books display
    - _Requirements: 3.4_

- [x] 6. Checkpoint - Ensure all tests pass
  - All 18 tests pass

- [x] 7. Fix Book Filtering and Search
  - [x] 7.1 Verify filter logic in books page
    - _Requirements: 5.2, 5.3, 5.4, 5.5_
  - [x]* 7.2 Write property tests for filter operations
    - **Property 4: Genre filter returns matching books only**
    - **Property 5: Price filter returns books within range**
    - **Property 6: Search filter matches title, author, or description**
    - **Property 7: Mood filter returns matching books only**
    - **Validates: Requirements 5.2, 5.3, 5.4, 5.5**
  - [x] 7.3 Fix empty state display
    - _Requirements: 8.2_
  - [x]* 7.4 Write property test for empty filter results
    - **Property 12: Empty filter results show empty state**
    - **Validates: Requirements 8.2**

- [x] 8. Fix Wishlist Functionality
  - [x] 8.1 Verify wishlist store operations
    - _Requirements: 6.1, 6.4_
  - [x]* 8.2 Write property tests for wishlist operations
    - **Property 8: Wishlist toggle is idempotent pair**
    - **Property 9: Wishlist persistence round-trip**
    - **Validates: Requirements 6.1, 6.4**
  - [x] 8.3 Verify wishlist page display
    - _Requirements: 6.2, 6.3_

- [x] 9. Fix Authentication Flow
  - [x] 9.1 Verify login functionality
    - _Requirements: 4.1_
  - [x] 9.2 Verify signup functionality
    - _Requirements: 4.2_
  - [x] 9.3 Verify error handling in auth forms
    - _Requirements: 4.3_
  - [x]* 9.4 Write property test for auth error handling
    - **Property 15: Authentication failure shows error message**
    - **Validates: Requirements 4.3**
  - [x] 9.5 Verify logout functionality
    - _Requirements: 4.4_
  - [x] 9.6 Verify admin route protection
    - _Requirements: 4.5_
  - [x]* 9.7 Write property test for route protection
    - **Property 16: Unauthenticated admin access redirects**
    - **Validates: Requirements 4.5**

- [x] 10. Checkpoint - Ensure all tests pass
  - All 18 tests pass

- [x] 11. Fix Responsive UI Issues
  - [x] 11.1 Fix mobile navigation
    - _Requirements: 7.1_
  - [x] 11.2 Fix book card grid responsiveness
    - _Requirements: 7.2_
  - [x] 11.3 Fix cart drawer mobile display
    - _Requirements: 7.3_
  - [x] 11.4 Fix admin dashboard mobile layout
    - _Requirements: 7.4_

- [x] 12. Fix Data Loading States
  - [x] 12.1 Verify loading indicators
    - _Requirements: 8.1_
  - [x] 12.2 Verify database fallback
    - _Requirements: 8.3_
  - [x] 12.3 Verify local storage restoration
    - _Requirements: 8.4_

- [x] 13. Final Checkpoint - Ensure all tests pass
  - All 18 tests pass
