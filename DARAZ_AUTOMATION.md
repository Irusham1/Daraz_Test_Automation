# Daraz.lk Playwright Test Automation Framework

> **Target Site:** [https://www.daraz.lk/#?](https://www.daraz.lk/#?)  
> **Framework:** Playwright (JavaScript) + Page Object Model  
> **Last Updated:** 2026-08-12

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-08-12 | Initial framework scaffold from bare Playwright template | Automation Engineer |
| 2026-08-12 | Added Page Object Model layer (`pages/`) | Automation Engineer |
| 2026-08-12 | Added test data management (`test-data/`, `utils/testDataLoader.js`) | Automation Engineer |
| 2026-08-12 | Added reusable fixtures (`fixtures/daraz.fixture.js`) | Automation Engineer |
| 2026-08-12 | Added utility helpers (`utils/waitHelpers.js`, `utils/cookieHelper.js`) | Automation Engineer |
| 2026-08-12 | Implemented 26 high-priority test cases across 6 spec files | Automation Engineer |
| 2026-08-12 | Updated `playwright.config.js` for Daraz.lk (baseURL, timeouts, reporters) | Automation Engineer |
| 2026-08-12 | Added npm scripts for smoke/high-priority and per-module runs | Automation Engineer |
| 2026-08-12 | Added `.env.example` for credential management | Automation Engineer |
| 2026-08-12 | Removed default `tests/example.spec.js` (Playwright.dev demo) | Automation Engineer |

---

## 1. Executive Summary

This repository contains an end-to-end (E2E) test automation framework for **Daraz.lk**, Sri Lanka's leading e-commerce platform. The framework follows industry best practices:

- **Page Object Model (POM)** — UI locators and actions encapsulated in page classes
- **Custom Fixtures** — Dependency injection of page objects and test data
- **Centralized Test Data** — JSON files with environment variable resolution
- **Explicit Waits** — Playwright auto-waiting + custom wait utilities
- **Tagging Strategy** — `@high`, `@smoke` tags for selective execution
- **CI-Ready** — GitHub Actions workflow pre-configured

---

## 2. Repository Structure

```
Web_Assignment/
├── config/
│   └── constants.js              # URLs, timeouts, expected patterns
├── fixtures/
│   └── daraz.fixture.js          # Extended Playwright test with POM + data
├── pages/
│   ├── base/
│   │   └── BasePage.js           # Common navigation & overlay handling
│   ├── home/
│   │   └── HomePage.js           # Header, search, cart, language
│   ├── auth/
│   │   └── LoginPage.js          # Login modal interactions
│   ├── search/
│   │   └── SearchResultsPage.js  # Search results, filters
│   ├── product/
│   │   └── ProductPage.js        # PDP — Add to Cart, Buy Now
│   └── cart/
│       └── CartPage.js           # Cart management
├── test-data/
│   ├── users.json                # Valid/invalid credentials
│   ├── search.json               # Keywords, filters
│   └── products.json             # Product search terms
├── tests/
│   ├── login.spec.js             # TC-01, TC-02, TC-17
│   ├── home.spec.js              # TC-10 – TC-13
│   ├── auth.spec.js              # TC-14 – TC-16
│   ├── search.spec.js            # TC-03 – TC-06, TC-18 – TC-22
│   ├── product.spec.js           # TC-23 – TC-25
│   └── cart.spec.js              # TC-07 – TC-09, TC-26
├── utils/
│   ├── testDataLoader.js         # JSON loader with ${ENV_VAR} support
│   ├── waitHelpers.js            # Page-ready & URL wait utilities
│   └── cookieHelper.js           # Overlay/popup dismissal
├── .env.example                  # Credential template
├── playwright.config.js          # Playwright configuration
├── package.json                  # Scripts & dependencies
└── DARAZ_AUTOMATION.md           # This document
```

---

## 3. High-Priority Test Cases

### 3.1 Login & Language (`login.spec.js`)

| ID | Test Case | Priority | Tags |
|----|-----------|----------|------|
| TC-01 | Successful login with valid credentials | High | @high @smoke |
| TC-02 | Multi-language UI (English/Sinhala) | High | @high |
| TC-17 | Switch language to Sinhala and back to English | High | @high |

### 3.2 Homepage (`home.spec.js`)

| ID | Test Case | Priority | Tags |
|----|-----------|----------|------|
| TC-10 | Homepage loads with correct title and URL | High | @high @smoke |
| TC-11 | Key header elements visible (search, login, cart, language) | High | @high @smoke |
| TC-12 | Guest cart badge is empty or zero | High | @high |
| TC-13 | Logo navigates back to homepage from catalog | High | @high |

### 3.3 Authentication (`auth.spec.js`)

| ID | Test Case | Priority | Tags |
|----|-----------|----------|------|
| TC-14 | Login modal shows email and password fields | High | @high @smoke |
| TC-15 | Invalid credentials do not log user in | High | @high |
| TC-16 | Logout returns user to guest state | High | @high |

### 3.4 Search (`search.spec.js`)

| ID | Test Case | Priority | Tags |
|----|-----------|----------|------|
| TC-03 | Product search by keyword | High | @high @smoke |
| TC-04 | Search auto-suggestion visibility | High | @high |
| TC-05 | Price range filter (Min/Max) | High | @high |
| TC-06 | Brand filter on search results | High | @high |
| TC-18 | Search URL contains query parameter | High | @high |
| TC-19 | Search results display product listing items | High | @high @smoke |
| TC-20 | Invalid search shows zero results | High | @high |
| TC-21 | Suggestion list includes typed keyword | High | @high |
| TC-22 | Run consecutive searches with different keywords | High | @high |

### 3.5 Product Details (`product.spec.js`)

| ID | Test Case | Priority | Tags |
|----|-----------|----------|------|
| TC-23 | Product page shows Add to Cart button | High | @high @smoke |
| TC-24 | Navigating to product updates URL to `/products/` | High | @high |
| TC-25 | Product page shows Buy Now button | High | @high |

### 3.6 Cart (`cart.spec.js`)

| ID | Test Case | Priority | Tags |
|----|-----------|----------|------|
| TC-07 | Add to cart and badge update | High | @high @smoke |
| TC-08 | Cart persistence after reload | High | @high |
| TC-09 | Remove item and badge update | High | @high |
| TC-26 | Cart badge increases after adding another product | High | @high |

**Total: 26 test cases**

---

## 4. Page Object Model Design

### 4.1 Inheritance Hierarchy

```
BasePage
├── HomePage
├── LoginPage
├── SearchResultsPage
├── ProductPage
└── CartPage
```

### 4.2 Key Locator Strategy

| Element | Locator Strategy |
|---------|-----------------|
| Search input | `getByRole('searchbox', { name: /Search in Daraz/i })` |
| Login link | `getByRole('link', { name: /^Login$/i })` |
| Login email | `getByRole('textbox', { name: /Phone or Email/i })` |
| Login password | `getByRole('textbox', { name: /password/i })` |
| Add to Cart | `getByRole('button', { name: /Add to Cart/i })` |
| Product items | CSS fallback chain for dynamic class names |

**Design principle:** Prefer role-based locators (accessibility) over brittle CSS. Use CSS class fallbacks only where Daraz uses dynamic/obfuscated class names.

### 4.3 Wait Handling

| Layer | Mechanism |
|-------|-----------|
| Playwright built-in | Auto-wait on actions (`click`, `fill`, `expect`) |
| `waitHelpers.js` | `waitForPageReady`, `waitForVisible`, `waitForUrl` |
| Page objects | Explicit `waitFor({ state: 'visible' })` on critical elements |
| Config | `actionTimeout: 15s`, `navigationTimeout: 45s`, `test timeout: 60s` |

---

## 5. Test Data Management

### 5.1 JSON Files

- **`users.json`** — Credentials with `${DARAZ_EMAIL}` / `${DARAZ_PASSWORD}` placeholders
- **`search.json`** — Search keywords, price filters, brand names
- **`products.json`** — Product-specific search terms for cart/PDP tests

### 5.2 Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

```env
DARAZ_EMAIL=your_email@example.com
DARAZ_PASSWORD=your_password_here
```

Tests **TC-01** and **TC-16** auto-skip when credentials are not configured.

### 5.3 Data Loader

`utils/testDataLoader.js` recursively resolves `${ENV_VAR}` placeholders in JSON values at runtime.

---

## 6. Fixtures & Utilities

### 6.1 Custom Fixture (`daraz.fixture.js`)

| Fixture | Description |
|---------|-------------|
| `homePage` | `HomePage` instance |
| `loginPage` | `LoginPage` instance |
| `searchResultsPage` | `SearchResultsPage` instance |
| `productPage` | `ProductPage` instance |
| `cartPage` | `CartPage` instance |
| `testUsers` | Loaded from `users.json` |
| `searchData` | Loaded from `search.json` |
| `productData` | Loaded from `products.json` |
| `darazHome` | Navigates to homepage + validates load |

### 6.2 Utilities

| Utility | Purpose |
|---------|---------|
| `waitHelpers.js` | Page readiness, URL matching, visibility polling |
| `cookieHelper.js` | Dismiss cookie banners and modal overlays |
| `testDataLoader.js` | JSON loading with env var injection |

---

## 7. Running Tests

### 7.1 Prerequisites

```bash
npm install
npx playwright install
```

### 7.2 Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (all browsers) |
| `npm run test:chromium` | Run on Chromium only (faster) |
| `npm run test:smoke` | Run `@smoke` tagged tests |
| `npm run test:high` | Run `@high` priority tests |
| `npm run test:search` | Run search module only |
| `npm run test:headed` | Run with visible browser |
| `npm run test:debug` | Debug mode |
| `npm run report` | Open HTML report |

### 7.3 CI/CD

GitHub Actions workflow at `.github/workflows/playwright.yml` runs on push/PR to `main`/`master`.

---

## 8. Assertions & Validations

Each test includes multiple validation layers:

1. **Visibility assertions** — `expect(locator).toBeVisible()`
2. **URL assertions** — Pattern matching for navigation flows
3. **State assertions** — Cart badge counts, login state
4. **Content assertions** — Page title, Sinhala Unicode detection
5. **Negative assertions** — Invalid login, zero search results

---

## 9. Known Limitations & Conditional Skips

Some tests use `test.skip()` when site conditions vary:

| Test | Skip Condition |
|------|----------------|
| TC-01, TC-16 | No credentials in `.env` |
| TC-04, TC-21 | Auto-suggestions not displayed |
| TC-05 | Price filter UI not visible |
| TC-06 | Brand filter not available for keyword |
| TC-09 | Remove button not found on cart page |
| TC-17 | Language switcher not visible |

---

## 10. Improvement Opportunities

### 10.1 Short-Term (Recommended)

| # | Improvement | Benefit |
|---|-------------|---------|
| 1 | Add `data-testid` mapping document when Daraz exposes stable IDs | Reduces locator fragility |
| 2 | Implement Playwright `storageState` for authenticated sessions | Faster login-dependent tests |
| 3 | Add visual regression tests for homepage/header | Catch UI regressions |
| 4 | Create API-layer cart setup/teardown | Faster, more reliable cart tests |
| 5 | Add retry wrapper for flaky network calls | Improved CI stability |

### 10.2 Medium-Term

| # | Improvement | Benefit |
|---|-------------|---------|
| 6 | Migrate to TypeScript | Better IDE support, type safety |
| 7 | Add Allure or custom dashboard reporter | Richer test reporting |
| 8 | Parallelize cart tests with isolated browser contexts | Faster execution |
| 9 | Add mobile viewport project (Pixel 5) | Mobile coverage |
| 10 | Implement Page Factory pattern for multi-locale pages | Scalable i18n testing |

### 10.3 Long-Term

| # | Improvement | Benefit |
|---|-------------|---------|
| 11 | Integrate with test management tool (TestRail, Xray) | Traceability |
| 12 | Add performance benchmarks (LCP, search response time) | Non-functional coverage |
| 13 | Cross-browser visual diff baseline | Consistent UX validation |
| 14 | Dockerized test runner | Reproducible CI/local parity |

---

## 11. Maintainability Guidelines

1. **Never put locators in spec files** — Always use Page Objects
2. **Never hardcode credentials** — Use `.env` + `test-data/users.json`
3. **Add new tests to the matching spec file** — Keep domain separation
4. **Update this document** — Record every new file, test case, or config change in the Change Log
5. **Use tags** — `@smoke` for PR gates, `@high` for regression, add `@regression` as needed
6. **Prefer `getByRole`** — Fall back to CSS only when necessary

---

## 12. Review Summary

| Area | Status | Notes |
|------|--------|-------|
| Page Object Model | ✅ Implemented | 6 page classes with BasePage inheritance |
| Test Data Management | ✅ Implemented | JSON + env vars + loader utility |
| Fixtures | ✅ Implemented | Custom fixture with all POM instances |
| Utilities | ✅ Implemented | Wait helpers, overlay dismissal |
| Assertions | ✅ Implemented | Multi-layer validations per test |
| Wait Strategy | ✅ Implemented | Config timeouts + explicit waits |
| Scalability | ✅ Good | Modular structure, tagged execution |
| Documentation | ✅ This file | Change log maintained |
| CI Integration | ✅ Existing | GitHub Actions workflow present |

---

*Document maintained as part of the Daraz.lk automation assignment. Update the Change Log section with every modification.*
