# TODO: Update Selfwork Payment Integration

## Tasks
- [x] Plan approved, proceeding with updates
- [x] Update BookingForm.tsx to pass tourName and people to /api/pay
- [x] Update app/api/pay/route.ts to use info array for tour details, remove extra fields (currency, description, customer, success_url, fail_url, meta), compute amount as sum of info amounts, sign over cleaned payload
- [x] Test the integration (assume code update, no browser test)

## Notes
- Ensure environment variables: SELFWORK_SECRET for signature, SELFWORK_SHOP_ID, etc.
- On success, redirect to payment URL; on failure, fallback to booking.
