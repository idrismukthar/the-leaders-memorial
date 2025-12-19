# The Leaders Memorial Private School (TLMPS) — School Portal

📚 A lightweight, static **student result portal** and school website built with vanilla HTML, CSS, and JavaScript. The repository contains: the public-facing site (home, about, gallery, contact), a student result-checker for JSS classes (JSS1/JSS2/JSS3), an admin results dashboard, and a BECE result viewer.

---

## 🚀 Project summary

This project is a static website that serves:
- A marketing site for The Leaders Memorial Private School (index, about, admission, contact, gallery).
- A **student result portal** where students enter an Admission Number + class-specific password to view and download their report card as a PDF.
- An **admin dashboard** for viewing and ranking class results (client-side only).
- A **BECE result viewer** (separate flow under `/bece`).

It is optimized for printing/report generation (portrait A4) and uses client-side JSON files as the data store for student results.

---

## 🧭 Tech stack & libraries

- HTML5 (static pages)
- CSS3 (responsive styles)
- JavaScript (vanilla ES6+)
- Data: datbase containing student records
- Python (small helper script `fix_passwords.py` used to correct JSON passwords)
- Library (CDN): `html2pdf.js` for PDF generation on the client
- Fonts / icons: Google Fonts, Font Awesome
- No backend server or database required for the current setup (static hosting friendly)

---

## 📁 Repository structure (key files)

- `index.html` — main landing page
- `style.css`, `index.css`, `login.css`, `result.css`, `bece_result_style.css` — styling
- `main.js` — core behavior and UI helpers (slideshow, smooth scroll, animations)
- `login.html`, `login.js` — student login flow (client-only)
- `result.html`, `result_script.js` — result rendering and PDF download
- `fix_passwords.py` — script used to patch inconsistent passwords in JSONs
- `admin/` — admin dashboard and helper scripts (`admin.html`, `app.js`, `elite_list.html`, `elite.html`)
- `bece/` — BECE portal (`bece_login.html`, `bece_result.html`, `bece_result_script.js`)
- `IMPLEMENTATION_GUIDE.md`, `FIXES_APPLIED.md`, `SECTION_VISIBILITY_FIX.md`, `REDESIGN_COMPLETE.md` — documentation and notes
- `img/` — images and favicons
- `test_login_flow.js` — automated / manual test helper script (if present)

---

## 🔐 How the student login works

1. Student visits `login.html` and submits Admission Number + Password.
2. `login.js` maps **password** to a class file:
3. The script fetches the appropriate database and looks up the Admission Number.
4. If found, the student object is saved to `localStorage` (`loggedStudent`) and the page redirects to `result.html`.
5. `result_script.js` reads `loggedStudent`, builds the subjects table, computes totals/averages, inserts a random personalized Principal's comment, and exposes a "Download PDF" button (via `html2pdf.js`).

Notes:
- Records in JSON use keys like `"Subject (CA 40)"` and `"Subject (Exam 60)"` which are parsed by scripts.
- If JSON fetch fails or format is invalid, an error is shown.

---

## 🧾 Result rendering & calculation details

- The script extracts CA and Exam values per subject and computes `total = CA + Exam`.
- Grand total is the sum of subject totals; average is `grandTotal / subjectCount`.
- Remarks are generated from numerical thresholds (e.g., >=75 "Excellent").
- Principal's comment is selected randomly from a list and personalized using the student's name.
- PDF generation uses `html2pdf.js` (CDN) and falls back to `window.print()` when the library is unavailable.

---

## 🛠 Admin dashboard (client-only)

- Accessed via `admin/admin.html`. The page uses a simple client-side password check to reveal a dashboard.
- Features:
  - Load any of the class files databaseb
  - Compute per-subject totals and class average
  - Rank students by grand total and compute subject positions
  - Filter/search students by name


---

## 🧾 BECE flow

- BECE login: `bece/bece_login.html` — users select year and enter surname + generated password hint.
- When accessed, BECE scripts store the student in `sessionStorage` and show an official-style certificate (`bece/bece_result.html`).
- PDF generation uses the same `html2pdf.js` library.

---

## ▶️ Running locally (recommended)

1. Open a simple static server in the project root (required to `fetch` JSON files):



---

## ✅ Known fixes and notes

- `fix_passwords.py` was used to fix inconsistent password entries in `jss2.json` (all `Password` values changed to `tlmps2`). See `FIXES_APPLIED.md` for details.
- There are checks and fallbacks for missing or malformed JSON values, but edge cases may still exist (e.g., `null` scores, unexpected JSON shapes).

---

## ⚠️ Security & privacy considerations

This project currently stores **realistic student data** as static JSON and performs authentication purely on the client. This is **not secure** for production use.

Risks and recommended improvements:
- Do NOT store sensitive student data publicly. Move data to a server-side database behind an API.
- Implement server-side authentication and authorization (sessions/JWT) rather than client-side password checks.
- Hash and salt passwords server-side — never store plaintext passwords in files.
- Use HTTPS, restrict access to admin APIs, and implement rate-limiting.
- For production, return JSON only via authenticated API endpoints (not as public files).

---

## ➕ How to contribute / extend

- Add student records: follow the JSON format used in `jss1.json` (AdmissionNumber, Password, Name, Sex, Class, Passport, per-subject CA & Exam keys).
- Add principal comments: edit `principalComments` in `result_script.js`.
- Update admin logic: `admin/app.js` contains ranking and grading helpers.
- Fix password mistakes: run `python fix_passwords.py` (review the script before running).

If you want, I can also:
- Add a server API to securely serve results (Node/Express or Python Flask)
- Migrate JSON to a database and add proper authentication
- Add tests and CI for JSON integrity and front-end behavior

---

## 📄 License

No license file is present. If you want to accept contributions or publish this project, add a `LICENSE` file (e.g., MIT, Apache-2.0).

---

