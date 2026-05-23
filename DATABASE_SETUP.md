# Database & Backend Setup Guide

## Background
You have **two MySQL instances** installed:
- **XAMPP MariaDB** (`mysql` service) — **currently running** on port 3306 ✅
- **MySQL80** (standalone MySQL Server) — currently **stopped** ❌

**Use the XAMPP one** (already running, Apache is also running).  
No need to start MySQL80.

---

## Step 1: Verify XAMPP is Running

Open **XAMPP Control Panel** (`C:\xampp\xampp-control.exe`) and confirm:
- **Apache** — Running
- **MySQL** — Running

Or check via command:

```cmd
sc query mysql
sc query Apache2.4
```

Both should show `RUNNING`.

---

## Step 2: Create the Database + Tables

Open a **Command Prompt (cmd.exe)** as Administrator and run:

```cmd
"C:\xampp\mysql\bin\mysql.exe" -u root
```

You'll get a `MariaDB [(none)]>` prompt. Now paste the full schema. To do this easily:

1. Exit the mysql prompt: type `exit` and press Enter
2. Run the schema file directly:

```cmd
"C:\xampp\mysql\bin\mysql.exe" -u root < "C:\ARKO\database\schema.sql"
```

You should see no errors (just a new prompt).  
This creates the `museum_ops` database and all 12 tables.

---

## Step 3: Load Seed Data

```cmd
"C:\xampp\mysql\bin\mysql.exe" -u root < "C:\ARKO\database\seed.sql"
```

This inserts: 5 museums, 7 staff users, 5 visit quotas, 21 holidays.

---

## Step 4: Verify Everything Worked

```cmd
"C:\xampp\mysql\bin\mysql.exe" -u root -e "USE museum_ops; SHOW TABLES; SELECT COUNT(*) AS total_museums FROM museums;"
```

You should see 12 tables and "5" for total_museums.

---

## Step 5: Test the PHP Backend

XAMPP's Apache web root is `C:\xampp\htdocs\`.  
Copy the backend folder there:

```cmd
xcopy "C:\ARKO\backend" "C:\xampp\htdocs\museum-api\" /E /I
```

Now visit in your browser:

```
http://localhost/museum-api/
```

You should see a JSON response:

```json
{"service":"Museum Operations API","version":"1.0.0","endpoints":[...]}
```

Test a specific endpoint:

```
http://localhost/museum-api/api/museums
```

You should get the 5 museums as JSON.

---

## Step 6: Configure the Backend (Database Credentials)

Open `C:\xampp\htdocs\museum-api\config\database.php` and confirm values:

```php
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'museum_ops');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
```

For XAMPP, `root` with no password on `localhost:3306` is the default — no changes needed.

---

## Step 7: Connect the Frontend to the API

Open `C:\ARKO\src\app\components\scheduling\SchedulingContext.tsx`  
Replace the localStorage-based functions with `fetch()` calls to:

```
http://localhost/museum-api/api/bookings
http://localhost/museum-api/api/museums
http://localhost/museum-api/api/holidays
http://localhost/museum-api/api/slot-overrides
http://localhost/museum-api/api/log-entries
http://localhost/museum-api/api/staff-assignments
http://localhost/museum-api/api/notifications
http://localhost/museum-api/api/staff
http://localhost/museum-api/api/visit-quotas
http://localhost/museum-api/api/members
http://localhost/museum-api/api/auth/login
```

Example API call pattern to replace mock data:

```javascript
// Before (localStorage):
const bookings = loadFromStorage(LS_KEYS.bookings, []);

// After (API):
async function fetchBookings() {
  const res = await fetch('http://localhost/museum-api/api/bookings');
  return await res.json();
}
```

Common API endpoints you'll use:

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/museum-api/api/museums` | List all museums |
| GET | `/museum-api/api/bookings?email=x` | Lookup bookings by email |
| POST | `/museum-api/api/bookings` | Create a booking |
| PUT | `/museum-api/api/bookings/BK-2026-001` | Update a booking |
| POST | `/museum-api/api/auth/login` | Login `{email, password}` |
| GET | `/museum-api/api/holidays?year=2026` | Get holidays |
| GET | `/museum-api/api/staff` | List all staff |
| POST | `/museum-api/api/staff` | Add staff member |
| GET | `/museum-api/api/staff-assignments?museum_id=m1` | Get staff assignments |
| GET | `/museum-api/api/visit-quotas` | List visit quotas |
| GET | `/museum-api/api/log-entries?museum_id=m1` | Get log entries |

---

## Troubleshooting

**Q: "mysql is not recognized" when running commands?**  
Use the full path: `"C:\xampp\mysql\bin\mysql.exe"` instead of just `mysql`.

**Q: Port 3306 already in use?**  
XAMPP is already using it — that's fine. If MySQL80 wants the same port, either stop MySQL80 or change its port.

**Q: Apache returns 404 for `/museum-api/`?**  
Make sure you copied to the correct path: `C:\xampp\htdocs\museum-api\`  
The folder should contain `index.php` directly, not another `backend\` inside.

**Q: Which MySQL to use?**  
**Use XAMPP's MariaDB** (service name: `mysql`, port 3306).  
Ignore the "MySQL80" service (it's a separate standalone installation that's stopped).  
In MySQL Workbench, pick **"Local Host"** (localhost:3306), not "Local instance MySQL80".
