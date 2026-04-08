# Implementation Plan: Store Search & Sorting Upgrade

## Summary
Upgrade the store search functionality in `StorePage.tsx` to include a proper debouncing mechanism and add price sorting capabilities to improve user experience and performance.

## Patterns to Mirror
- Use `useEffect` for data fetching (as seen in `SearchPage.tsx` and `StorePage.tsx`).
- Use `supabase` query builder for filtering and sorting.
- Use `motion` for UI transitions.

## Files to Change
- `src/pages/StorePage.tsx`: Main logic for fetching, debouncing, and sorting.
- `src/components/store/StoreSearchBar.tsx`: Input UI enhancements.

## Step-by-Step Tasks

### Phase 1: Search Debouncing
1. **Task 1**: Implement `useEffect` to sync `searchQuery` with `debouncedSearch` using a 500ms delay.
   - MIRROR: Standard React debounce pattern.
2. **Task 2**: Update `fetchProducts` to handle loading states clearly during the debounce period.

### Phase 2: Price Sorting
1. **Task 3**: Add `sortBy` state (e.g., 'newest', 'price_asc', 'price_desc') to `StorePage.tsx`.
2. **Task 4**: Update `fetchProducts` logic to apply the `.order()` call based on the `sortBy` value.
3. **Task 5**: Add a Sort Dropdown or Select component to the `StorePage` UI (Mirroring `SearchPage.tsx`'s `Select`).

### Phase 3: UI/UX Polish
1. **Task 6**: Add a subtle loading spinner inside `StoreSearchBar` when the query is being debounced or fetched.
2. **Task 7**: Display "Found X products" or "Searching for..." message to provide feedback.

## Validation Commands
- `npm run type-check` (or `npx tsc --noEmit`)
- `npm run build`

## Acceptance Criteria
- [ ] Searching for a term doesn't trigger a fetch on every keystroke (500ms delay).
- [ ] Changing the sort order correctly refills the product list with the right order.
- [ ] No TypeScript errors in `StorePage.tsx`.
- [ ] UI remains responsive and provides feedback during search.
