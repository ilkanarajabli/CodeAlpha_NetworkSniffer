# 🔐 Security Code Review — CRUD-Flask-App

**Reviewer:** [Ilkana Rajabli]
**Date:** [9/23/2026 6:02PM]
**Target Repository:** [piyush335/CRUD-Flask-App](https://github.com/piyush335/CRUD-Flask-App)
**File Reviewed:** app.py

---

## Finding 1: Hardcoded Secret Key
- **Severity:** High
- **Location:** app.py, `if __name__ == "__main__":` block
- **Description:** The Flask session secret key is hardcoded directly in the source code as a plain string, and this file is committed to a public repository.
- **Impact:** Anyone with access to the source code can read the secret key and use it to forge valid session cookies, allowing them to impersonate any logged-in user without knowing their password.
- **Recommendation:** Move the secret key to an environment variable and load it with `os.environ.get('SECRET_KEY')`. Never commit `.env` files — add them to `.gitignore`.

---

## Finding 2: Debug Mode Enabled in Production
- **Severity:** High
- **Location:** app.py, `app.run(debug=True)`
- **Description:** The application runs with Flask's debug mode enabled.
- **Impact:** If deployed with this setting, any unhandled error exposes the interactive Werkzeug debugger, which allows arbitrary Python code execution on the server — a critical remote code execution risk.
- **Recommendation:** Set `debug=False` for any production deployment. Use an environment variable (e.g. `FLASK_DEBUG`) to control this per environment, never hardcode `True`.

---

## Finding 3: Empty Database Password
- **Severity:** Medium
- **Location:** app.py, `mysql.connector.connect(...)`
- **Description:** The MySQL connection uses the `root` user with an empty password (`passwd=""`).
- **Impact:** Anyone with network access to the database server could connect without authentication and read or modify all user data, including password hashes.
- **Recommendation:** Use a dedicated database user (not root) with a strong password, stored in an environment variable, with only the privileges the app actually needs (principle of least privilege).

---

## Finding 4: Broken Access Control (IDOR)
- **Severity:** High
- **Location:** app.py, `edit_article()` and `delete_article()` routes
- **Description:** These routes check only whether a user is logged in (`@is_logged_in`), but never verify that the article being edited or deleted actually belongs to that user. The article `id` is taken directly from the URL.
- **Impact:** Any logged-in user can edit or delete another user's article simply by changing the `id` in the URL (e.g. `/edit_article/17`) — a classic Insecure Direct Object Reference (IDOR) vulnerability.
- **Recommendation:** Add an ownership check to the SQL query, e.g.:
```python
  mycursor.execute(
      "SELECT * FROM articles WHERE id = %s AND author = %s",
      [id, session['username']]
  )
```
  Return a 403/404 if no matching row is found.

---

## Finding 5: Missing Error Handling for Invalid IDs
- **Severity:** Low
- **Location:** app.py, `edit_article()`
- **Description:** After fetching an article by `id`, the code accesses `result['title']` without first checking whether `result` is `None`.
- **Impact:** Requesting a non-existent article id (e.g. `/edit_article/9999`) causes an unhandled exception and a server error, which can also leak stack trace information if debug mode is on (see Finding 2).
- **Recommendation:** Check `if not result:` and redirect with a flash message before using the result.

---

## Finding 6: Weak Password Policy
- **Severity:** Low
- **Location:** app.py, `RegisterForm` class
- **Description:** The password field only requires the two fields to match (`EqualTo('confirm')`) with no minimum length or complexity rule.
- **Impact:** Users can register with very weak passwords (e.g. a single character), making accounts easy to brute-force.
- **Recommendation:** Add `validators.Length(min=8)` and consider requiring a mix of character types.

---

## Finding 7: Missing CSRF Protection
- **Severity:** Medium
- **Location:** app.py, all POST forms (`add_article`, `edit_article`, `delete_article`)
- **Description:** Although Flask-WTF is used for form validation, there is no CSRF configuration (`app.config['WTF_CSRF_ENABLED']`, `CSRFProtect`) set up in the code.
- **Impact:** A malicious external site could trick a logged-in user's browser into submitting a request to this app (e.g. deleting an article) without the user's knowledge.
- **Recommendation:** Enable `CSRFProtect(app)` and ensure `{{ form.csrf_token }}` is rendered in every form template.

---

## Positive Findings (Good Practices)
- **Parameterized SQL queries:** All database queries use `%s` placeholders with parameter lists (e.g. `execute("...WHERE id = %s", [id])`) instead of string concatenation, which effectively prevents SQL injection.
- **Password hashing:** Passwords are hashed with `sha256_crypt` before storage, rather than being stored in plaintext.

---

## Summary

| Severity | Count |
|----------|-------|
| High     | 3     |
| Medium   | 2     |
| Low      | 2     |

**Total findings:** 7