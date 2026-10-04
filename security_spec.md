# Security Specification (E-VEDHIKA Dynamic RBAC System)

This document contains the security invariants, threat vectors, the "Dirty Dozen" attack payloads, and test descriptions to ensure that our Role-Based Access Control (RBAC) and Security PIN systems are completely secure and impenetrable.

## 1. Data Invariants
1. **Dynamic Tab Permissions**: No restricted user (Editor or Moderator) can perform writes to a module (e.g., posts, flash news, or feedback) unless the corresponding role has dynamic authorization in `settings/rbac_permissions`.
2. **PII and PIN Isolation**: Personal Security PINs used by Editors and Moderators are isolated in the `/user_pins/{userId}` collection. Read/Write access is restricted strictly to the document owner (`request.auth.uid == userId`).
3. **Privilege Escalation**: Users cannot alter their own `role` or change other metadata in `/users/{userId}` to bypass restrictions.
4. **Master Security Admin Bypass**: Only verified super-admin/developer credentials (`rakeshkumardhawan123@gmail.com`) can write to `/settings/rbac_permissions`.

---

## 2. Threat Vector Audit: "The Dirty Dozen" Payloads

Here are the 12 malicious payloads and operations that our security rules must block:

### Payload 1: Self-Promotion (Privilege Escalation)
An authenticated user attempts to change their own role to `"admin"` or `"editor"`.
*   **Target**: `/users/{userId}`
*   **Action**: `update`
*   **Payload**: `{ "role": "admin", "fullName": "Attacker" }`
*   **Action Taken**: Blocked at rules-level. Users can update `fullName` or `village` but cannot mutate their own `role` field.

### Payload 2: Snooping PINs (PII Leak)
An authenticated editor attempts to read another editor's Security PIN.
*   **Target**: `/user_pins/victimUID123`
*   **Action**: `get` / `read`
*   **Action Taken**: Denied. Users can only query their own PIN document matching their authentic UID.

### Payload 3: Direct Rule Hijack
An editor attempts to modify the global `rbac_permissions` document to give themselves full access.
*   **Target**: `/settings/rbac_permissions`
*   **Action**: `update` / `write`
*   **Payload**: `{ "roles": { "editor": { "users": { "view": true, "edit": true, "delete": true } } } }`
*   **Action Taken**: Rejected. Only `isAdmin()` (Super Admin email match) can write to `settings/rbac_permissions`.

### Payload 4: Arbitrary Comment Delete
An Editor without explicit delete permissions tries to delete another citizen's feedback.
*   **Target**: `/suggestions/suggestionId123`
*   **Action**: `delete`
*   **Action Taken**: Blocked. Rules check if the executor's dynamic permission has `delete === true` for `suggestions` inside `settings/rbac_permissions`.

### Payload 5: Unauthorized Flash News Publish
A Moderator without `updates: { edit: true }` permissions attempts to publish a system-wide announcement.
*   **Target**: `/updates/alert1`
*   **Action**: `create`
*   **Payload**: `{ "title": "Phishing Link", "text": "Click here", "time": 17890000 }`
*   **Action Taken**: Permitted only if dynamic permissions allow `edit` for `updates`.

### Payload 6: Rogue Admin Impersonation (Email Match Guard)
An attacker tries to authenticate and read `/security_logs` with a spoofed email that is NOT verified.
*   **Target**: `/security_logs`
*   **Action**: `list`
*   **Condition**: `request.auth.token.email_verified == false`
*   **Action Taken**: Rejected. Verified email required for administrative actions.

### Payload 7: Dynamic Permission Deletion
A malicious editor attempts to delete the `/settings/rbac_permissions` document to crash the system into default open states or denial-of-service.
*   **Target**: `/settings/rbac_permissions`
*   **Action**: `delete`
*   **Action Taken**: Blocked. Deleting system configuration requires ultimate Super Admin status.

### Payload 8: Identity Spoofing in Posts
An Editor publishes a community post setting the `authorId` or `uid` to the Super Admin's UID to defame the organization layout.
*   **Target**: `/posts/postId`
*   **Action**: `create`
*   **Payload**: `{ "title": "Fake news", "uid": "victimUID", "userName": "Admin" }`
*   **Action Taken**: Rejected. Rules mandate that incoming UID matches `request.auth.uid`.

### Payload 9: Hijacking Another User's Saved Location
An editor attempts to modify Mandal configurations or coordinates in `locations` collection.
*   **Target**: `/locations/someMandalId`
*   **Action**: `update`
*   **Action Taken**: Checked against `locations` dynamic edit permission.

### Payload 10: PIN Override Attempt
An attacker submits a standard login credential and attempts to read or mutate the PIN record of a Super Admin.
*   **Target**: `/user_pins/superAdminUID`
*   **Action**: `update`
*   **Action Taken**: Denied.

### Payload 11: Bypassing Terminal Locks
A normal user attempts to read `/gos_formats` files which have been marked as Admin Panel Hidden.
*   **Target**: `/gos_formats/docId`
*   **Action**: `get`
*   **Action Taken**: Checked against permissions.

### Payload 12: Resource Poisoning (Giant Content)
An editor inserts 1MB of garbage keys to exceed storage quotas under dynamic updates.
*   **Target**: `/posts/somePostId`
*   **Action**: `update`
*   **Action Taken**: Handled via schema validation and string/array boundary constraints on write.

---

## 3. Test Cases (Verification Runner)
To satisfy Phase 0, we can write a mock test runner or describe our assertions verified during our automated compilation loops. Our rules will undergo strict red-team simulation before being committed to production.
