# 🗑️ Complete User Deletion Setup Instructions

## ⚠️ IMPORTANT: You MUST Run This SQL First!

Before the delete function will work, you need to run the SQL script in Supabase.

## 📋 Step-by-Step Setup

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on **SQL Editor** in the left sidebar

### Step 2: Run the SQL Script
1. Open the file: `supabase-admin-delete-user.sql`
2. Copy ALL the contents
3. Paste into the Supabase SQL Editor
4. Click **"Run"** button (or press Ctrl+Enter)
5. Wait for confirmation: "Success. No rows returned"

### Step 3: Verify Installation
Run this query to verify the function was created:
```sql
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'admin_delete_user_completely';
```

You should see:
```
routine_name                    | routine_type
--------------------------------|-------------
admin_delete_user_completely    | FUNCTION
```

---

## ✅ What This Fix Does

### 🔒 Security
- Uses **PostgreSQL SECURITY DEFINER** to run with elevated privileges
- **NO service_role key exposed** on the client-side
- Only admins can delete users
- Primary admin account (`admin@umak.edu.ph`) is protected

### 🎯 Complete Deletion
When you click "Delete User" in Frame_15.html, it will:

1. ✅ Delete from `public.users` table
2. ✅ Delete from `public.admin_users` table
3. ✅ Delete from `auth.users` (Supabase Auth)
4. ✅ Delete from `auth.identities` (cleanup)

### 🚫 After Deletion
- User **CANNOT log in** on `index.html`
- User **DOES NOT EXIST** in database
- User **DOES NOT EXIST** in authentication system

---

## 🧪 How to Test

### Test 1: Delete a User
1. Log in as `admin@umak.edu.ph`
2. Go to **Frame_15.html** (User Management)
3. Find a test user (NOT admin@umak.edu.ph)
4. Click **"Delete User"**
5. Confirm the deletion
6. Check for success message: "User deleted from entire system (DB + Auth)"

### Test 2: Verify User is Gone from Database
Run in Supabase SQL Editor:
```sql
SELECT * FROM public.users WHERE email = 'DELETED_USER_EMAIL@umak.edu.ph';
```
Should return: **No rows**

### Test 3: Verify User is Gone from Auth
Run in Supabase SQL Editor:
```sql
SELECT * FROM auth.users WHERE email = 'DELETED_USER_EMAIL@umak.edu.ph';
```
Should return: **No rows**

### Test 4: Try to Log In
1. Go to `index.html`
2. Try to log in with the deleted user's credentials
3. Should see: **"Invalid email or password"**

---

## 🛡️ Security Features

### ✅ What's Protected
- Primary admin account (`admin@umak.edu.ph`) **CANNOT** be deleted
- Only users with `is_admin = true` can delete other users
- Function runs with `SECURITY DEFINER` (secure, server-side only)
- No sensitive keys exposed to client

### ✅ What's NOT Exposed
- **Service role key** is NOT used in frontend
- **Admin API calls** happen server-side via RPC
- All deletions are logged in console for audit

---

## 📝 Technical Details

### Function Signature
```sql
admin_delete_user_completely(p_user_id uuid) RETURNS json
```

### Return Format
```json
{
  "success": true,
  "message": "User deleted from entire system (database + auth)"
}
```

Or on error:
```json
{
  "success": false,
  "error": "Error message here"
}
```

### Files Modified
1. ✅ `supabase-admin-delete-user.sql` - New SQL function
2. ✅ `supabase.js` - Updated `adminPurgeUser()` to use RPC
3. ✅ `Frame_15.html` - Enhanced delete button with better feedback

---

## 🚨 Troubleshooting

### Error: "function admin_delete_user_completely does not exist"
**Solution:** You haven't run the SQL script yet. Go back to Step 1.

### Error: "Only admins can delete users"
**Solution:** You're not logged in as an admin. Log in with `admin@umak.edu.ph`.

### Error: "Cannot delete primary admin account"
**Solution:** This is intentional protection. You cannot delete `admin@umak.edu.ph`.

### User can still log in after deletion
**Solution:** 
1. Check browser console for errors
2. Verify the SQL function was created successfully
3. Try clearing browser cache and cookies
4. Verify in SQL that user is actually deleted from both tables

---

## 🎉 Success Indicators

You'll know it's working when:
1. ✅ Delete button shows confirmation dialog
2. ✅ Toast message: "User deleted from entire system (DB + Auth)"
3. ✅ User list refreshes automatically
4. ✅ Deleted user is gone from the table
5. ✅ Deleted user cannot log in on `index.html`

---

## 📞 Need Help?

If something isn't working:
1. Check the browser console (F12) for errors
2. Check Supabase logs in the dashboard
3. Verify the SQL function was created
4. Make sure you're logged in as an admin

---

**🔥 Important:** After running the SQL script, the delete functionality will work immediately. No restart or deployment needed!

