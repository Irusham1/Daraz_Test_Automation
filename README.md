# 🛒 Daraz.lk E2E Test Automation Framework

An Enterprise-grade End-to-End (E2E) Test Automation Framework built for [Daraz.lk](https://www.daraz.lk) using **Playwright** and **JavaScript** following the **Page Object Model (POM)** architectural pattern.

![Playwright](https://img.shields.io/badge/Playwright-1.40+-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Build Status](https://img.shields.io/badge/Tests-26%20Passed%20%2F%200%20Failed-success?style=for-the-badge)

---

## 🛠️ Technology Stack & Tools

| Technology | Purpose / Usage |
|---|---|
| **[Playwright](https://playwright.dev/)** | Core Automation Framework for Chromium, Firefox, and WebKit |
| **JavaScript (ES6+)** | Scripting Language for Page Objects & Test Suites |
| **[Node.js](https://nodejs.org/)** | JavaScript Runtime Environment |
| **Page Object Model (POM)** | Design Pattern for clean separation of UI locators & page actions |
| **Custom Fixtures** | Dependency Injection mechanism for clean test setup & tear-down |
| **HTML & JSON Reporters** | Built-in test execution reporting with video & screenshot capturing |
| **GitHub Actions** | CI/CD Automated Pipeline integration |

---

## 🚀 Key Framework Features

- 🏗️ **Page Object Model (POM)** Architecture for high maintainability and scalability.
- 🏷️ **Tag-based Test Filtering** (e.g., `@smoke`, `@high`, `@auth`, `@cart`, `@search`, `@login`, `@product`, `@home`).
- 🌐 **Cross-Domain Session Management**: Handles sub-domain cookies (`.daraz.lk`) across `www.daraz.lk` and `cart.daraz.lk`.
- 🛡️ **Overlay & Modal Interception**: Automatic handling and dismissal of promotional overlays (`.lzd-login-signup-popup-mask`, `.iweb-dialog-mask`).
- 🌍 **Multi-Language Verification**: Validates UI elements in English and Sinhala (Unicode `\u0D80-\u0DFF`).
- 📊 **Automated HTML Reporting**: Generates interactive visual test reports with execution traces, videos, and screenshots.

---

## 📋 Comprehensive Test Cases (26/26 Passing)

Below is the complete inventory of all 26 test cases categorized by Module and Tag Variety:

| ID | Test Case Title | Module | Tags / Category | Description | Status |
|---|---|---|---|---|:---:|
| **TC-01** | Successful login with valid credentials | Login | `@login` `@high` `@smoke` | Validates successful user authentication with valid credentials | ✅ PASS |
| **TC-02** | Multi-language UI (English/Sinhala) | Login | `@login` `@high` | Verifies UI language content switching support | ✅ PASS |
| **TC-03** | Product search by keyword | Search | `@search` `@high` `@smoke` | Verifies product catalog search functionality for valid keywords | ✅ PASS |
| **TC-04** | Search auto-suggestion visibility | Search | `@search` `@high` | Verifies search auto-suggestion dropdown menu appears | ✅ PASS |
| **TC-05** | Price range filter (Min/Max) | Search | `@search` `@high` | Validates filtering search results by minimum and maximum price | ✅ PASS |
| **TC-06** | Brand filter on search results | Search | `@search` `@high` | Verifies brand checkbox filter functionality on catalog results | ✅ PASS |
| **TC-07** | Add to cart and badge update | Cart | `@cart` `@high` `@smoke` | Validates adding a product to cart and verifying header cart badge count update | ✅ PASS |
| **TC-08** | Cart persistence after reload | Cart | `@cart` `@high` | Ensures cart badge count persists across page reloads | ✅ PASS |
| **TC-09** | Remove item and badge update | Cart | `@cart` `@high` | Verifies removing an item from cart updates header badge count | ✅ PASS |
| **TC-10** | Homepage loads with correct title and URL | Homepage | `@home` `@high` `@smoke` | Validates homepage load state, title string, and base URL | ✅ PASS |
| **TC-11** | Key header elements visible | Homepage | `@home` `@high` `@smoke` | Verifies visibility of search input, login link, cart, and language switcher | ✅ PASS |
| **TC-12** | Guest cart badge is empty or zero | Homepage | `@home` `@high` | Ensures guest user starts with zero cart items | ✅ PASS |
| **TC-13** | Logo navigates back to homepage | Homepage | `@home` `@high` | Validates Daraz logo click returns user to homepage from catalog | ✅ PASS |
| **TC-14** | Login modal shows email & password fields | Auth | `@auth` `@high` `@smoke` | Verifies login modal elements and input field visibility | ✅ PASS |
| **TC-15** | Invalid credentials do not log user in | Auth | `@auth` `@high` | Negative testing for invalid email and password combinations | ✅ PASS |
| **TC-16** | Logout returns user to guest state | Auth | `@auth` `@high` | Validates logging out restores guest session state | ✅ PASS |
| **TC-17** | Switch language to Sinhala and back | Login | `@login` `@high` | Validates Sinhala Unicode character rendering and language toggling | ✅ PASS |
| **TC-18** | Search URL contains query parameter | Search | `@search` `@high` | Ensures search query parameter (`q=`) is correctly reflected in URL | ✅ PASS |
| **TC-19** | Search results display product items | Search | `@search` `@high` `@smoke` | Validates catalog product item cards display on search | ✅ PASS |
| **TC-20** | Invalid search shows zero results | Search | `@search` `@high` | Negative search test verifying empty state display for non-existent keywords | ✅ PASS |
| **TC-21** | Suggestion list includes typed keyword | Search | `@search` `@high` | Validates auto-suggestion list text matches typed input keyword | ✅ PASS |
| **TC-22** | Run consecutive searches | Search | `@search` `@high` | Verifies running multiple consecutive searches updates catalog view | ✅ PASS |
| **TC-23** | Product page shows Add to Cart button | Product | `@product` `@high` `@smoke` | Validates Add to Cart button visibility on product details page | ✅ PASS |
| **TC-24** | Navigating to product updates URL | Product | `@product` `@high` | Verifies product page navigation updates URL to `/products/` | ✅ PASS |
| **TC-25** | Product page shows Buy Now button | Product | `@product` `@high` | Validates Buy Now button visibility on product details page | ✅ PASS |
| **TC-26** | Cart badge increases after adding product | Cart | `@cart` `@high` | Validates incremental increase of cart badge count when adding items | ✅ PASS |

---

## 🏷️ Test Tag Varieties Summary

| Tag Variety | Count | Purpose | Execution Command |
|---|---|---|---|
| `@smoke` | 8 Tests | Core critical path sanity tests | `npx playwright test --grep "@smoke"` |
| `@high` | 26 Tests | High-priority feature coverage tests | `npx playwright test --grep "@high"` |
| `@auth` | 3 Tests | Authentication & session tests | `npx playwright test --grep "@auth"` |
| `@cart` | 4 Tests | Shopping cart & badge state tests | `npx playwright test --grep "@cart"` |
| `@search` | 9 Tests | Product catalog & search filter tests | `npx playwright test --grep "@search"` |
| `@login` | 3 Tests | Login modal & language switcher tests | `npx playwright test --grep "@login"` |
| `@product` | 3 Tests | Product detail page UI & actions | `npx playwright test --grep "@product"` |
| `@home` | 4 Tests | Navigation header & homepage tests | `npx playwright test --grep "@home"` |

---

## 📂 Framework Directory Structure

```text
Web_Assignment/
├── .github/
│   └── workflows/
│       └── playwright.yml       # GitHub Actions CI/CD Pipeline Configuration
├── config/
│   └── constants.js             # Environment URLs, Timeouts & Expected Strings
├── fixtures/
│   └── daraz.fixture.js         # Custom Playwright Fixture with Page Object Injection
├── pages/
│   ├── auth/
│   │   └── LoginPage.js         # Login Modal Page Object
│   ├── base/
│   │   └── BasePage.js          # Parent Base Page Object with reusable actions
│   ├── cart/
│   │   └── CartPage.js          # Cart Page Object
│   ├── home/
│   │   └── HomePage.js          # Header & Homepage Page Object
│   ├── product/
│   │   └── ProductPage.js       # Product Details Page Object
│   └── search/
│       └── SearchResultsPage.js # Search Results Page Object
├── test-data/
│   ├── products.json            # Test Data for Product verification
│   ├── search.json              # Test Data for Search keywords & filters
│   └── users.json               # Test Credentials (Valid & Invalid)
├── tests/
│   ├── auth.spec.js             # Auth Spec File
│   ├── cart.spec.js             # Cart Spec File
│   ├── home.spec.js             # Homepage Spec File
│   ├── login.spec.js            # Login & Language Spec File
│   ├── product.spec.js          # Product Spec File
│   └── search.spec.js           # Search Spec File
├── utils/
│   ├── cookieHelper.js          # Modal Overlay Dismissal & Cookie Utilities
│   ├── testDataLoader.js        # Environment Data Loader
│   └── waitHelpers.js           # Smart Wait Utilities
├── .gitignore                   # Git Ignore File
├── DARAZ_AUTOMATION.md          # Framework Documentation
├── package.json                 # Project Dependencies & Scripts
├── playwright.config.js         # Playwright Framework Configuration
└── README.md                    # Framework Overview & Test Inventory
```

---

## 💻 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation

Clone the repository and install project dependencies:

```bash
git clone https://github.com/Irusham1/Daraz_Test_Automation.git
cd Daraz_Test_Automation
npm ci
```

Install Playwright Chromium Browser Binary:

```bash
npx playwright install chromium
```

---

## 🧪 Running Tests

### Run All 26 Tests (Chromium)
```bash
npm run test:chromium
```

### Run Smoke Suite Only (@smoke)
```bash
npx playwright test --grep "@smoke"
```

### Run Specific Test Modules
```bash
# Run Search Suite
npx playwright test tests/search.spec.js

# Run Cart Suite
npx playwright test tests/cart.spec.js

# Run Authentication Suite
npx playwright test tests/auth.spec.js
```

### Run Tests in Headed (Interactive) Mode
```bash
npx playwright test --headed
```

---

## 📊 Viewing HTML Reports

After executing tests, view the interactive HTML report by running:

```bash
npx playwright show-report
```

---

## 🤖 CI/CD Integration

This project includes a **GitHub Actions** workflow (`.github/workflows/playwright.yml`) that automatically executes the entire test suite on every `push` or `pull_request` to the `main` branch.
