# Phase 1 acceptance gates

Release is not complete until all items are verified on the reviewed Phase 1 branch / deployment:

- [ ] Automatic production admin creation eliminated
- [ ] Known public demo credentials cannot authenticate in production
- [ ] Secure production administrator provisioning documented
- [ ] Production requires valid authentication secrets
- [ ] Production requires its database connection
- [ ] Database failures never trigger silent memory writes
- [ ] Role mapping is explicit and deny-by-default
- [ ] API authorization is enforced (session + documented API key scope)
- [ ] Production responses never expose OTP codes
- [ ] Carrier webhook signatures/secrets verified
- [ ] Stripe webhook signatures verified
- [ ] Duplicate webhook processing prevented
- [ ] Security-sensitive tokens use cryptographically secure randomness
- [ ] API key documentation matches actual implementation
- [ ] Automated security regression tests pass (`npm run test`)
- [ ] TypeScript typecheck passes
- [ ] Production build succeeds
- [ ] Security documentation is complete
- [ ] Rollback procedure has been reviewed
- [ ] Project owner approves the release

**Deployment** requires a separate explicit owner authorization. This checklist alone is not a deploy approval.
