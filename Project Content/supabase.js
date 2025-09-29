// Supabase configuration
const SUPABASE_URL = 'https://lvjfjyboqlcofzqrwqiy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2amZqeWJvcWxjb2Z6cXJ3cWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NzU4MTEsImV4cCI6MjA3MzM1MTgxMX0.XHLeP0xxmSWLC8MpqCpHWOVL3GK2TTJrKOBdbmME2OE';

// Supabase client
let supabase = null;

// Initialize Supabase
function initSupabase() {
  if (typeof window !== 'undefined') {
    // Check if Supabase is available (UMD may export as window.supabase or window.Supabase)
    var Supa = window.supabase || window.Supabase || null;
    if (Supa && typeof Supa.createClient === 'function') {
      supabase = Supa.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('Supabase initialized successfully');
      return true;
    } else {
      // Wait for Supabase to load
      console.log('Waiting for Supabase to load...');
      return false;
    }
  }
  return false;
}

// Alternative initialization that waits for Supabase to load
function initSupabaseWithRetry() {
  return new Promise((resolve) => {
    const maxRetries = 10;
    let retries = 0;

    const checkSupabase = () => {
      if (typeof window !== 'undefined') {
        var Supa = window.supabase || window.Supabase || null;
        if (Supa && typeof Supa.createClient === 'function') {
          supabase = Supa.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
          console.log('Supabase initialized successfully');
          resolve(true);
          return;
        }
      }
      if (retries < maxRetries) {
        retries++;
        console.log(`Waiting for Supabase... attempt ${retries}/${maxRetries}`);
        setTimeout(checkSupabase, 500);
      } else {
        console.error('Supabase failed to load after maximum retries');
        resolve(false);
      }
    };

    checkSupabase();
  });
}

// Authentication functions
const auth = {
  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    if (!supabase) return { error: 'Supabase not initialized' };

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Sign up with email verification and redirect
  async signUpWithEmailVerification(email, password, userData = {}, redirectTo = null) {
    if (!supabase) return { error: 'Supabase not initialized' };
    try {
      const redirectUrl = redirectTo || (window.location.origin + '/index.html');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: redirectUrl
        }
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Sign in with email and password
  async signIn(email, password) {
    if (!supabase) return { error: 'Supabase not initialized' };

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Resend verification email with 2-minute cooldown per email
  async resendVerificationEmail(email, redirectTo = null) {
    if (!supabase) return { error: 'Supabase not initialized' };
    try {
      const cooldownKey = `verify-cooldown:${(email || '').toLowerCase()}`;
      const now = Date.now();
      const last = parseInt(localStorage.getItem(cooldownKey) || '0', 10);
      const cooldownMs = 2 * 60 * 1000;
      const remaining = last ? Math.max(0, cooldownMs - (now - last)) : 0;
      if (remaining > 0) {
        return { data: null, error: { message: 'Please wait before resending.', code: 'cooldown_active', remainingMs: remaining } };
      }

      const redirectUrl = redirectTo || (window.location.origin + '/index.html');
      // Supabase v2 resend API
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: redirectUrl }
      });
      if (error) throw error;

      localStorage.setItem(cooldownKey, String(now));
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Helper: get remaining cooldown seconds for resend
  getVerificationCooldownRemaining(email) {
    const cooldownKey = `verify-cooldown:${(email || '').toLowerCase()}`;
    const now = Date.now();
    const last = parseInt(localStorage.getItem(cooldownKey) || '0', 10);
    if (!last) return 0;
    const cooldownMs = 2 * 60 * 1000;
    const remainingMs = Math.max(0, cooldownMs - (now - last));
    return Math.ceil(remainingMs / 1000);
  },

  // Sign out
  async signOut() {
    if (!supabase) return { error: 'Supabase not initialized' };

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Get current user
  async getCurrentUser() {
    if (!supabase) return { data: null, error: 'Supabase not initialized' };
    try {
      return await supabase.auth.getUser();
    } catch (error) {
      return { data: null, error };
    }
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    if (!supabase) return null;
    return supabase.auth.onAuthStateChange(callback);
  },

  // Reset password
  async resetPassword(email) {
    if (!supabase) return { error: 'Supabase not initialized' };

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/index.html'
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Sign up with custom redirect URL
  async signUpWithRedirect(email, password, userData = {}, redirectTo = null) {
    if (!supabase) return { error: 'Supabase not initialized' };

    try {
      const redirectUrl = redirectTo || window.location.origin + '/index.html';
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: redirectUrl
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Database functions
const db = {
  // Insert user profile
  async insertUser(uid, profile) {
    if (!supabase) return { error: 'Supabase not initialized' };

    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{ id: uid, ...profile }]);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Admin: update another user's profile via RPC (bypasses RLS)
  async adminUpdateUserProfile(userId, fields) {
    if (!supabase) return { error: 'Supabase not initialized' };
    try {
      const { first_name = null, last_name = null, student_id = null, program = null } = fields || {};
      const { data, error } = await supabase.rpc('admin_update_user_profile', {
        p_user_id: userId,
        p_first_name: first_name,
        p_last_name: last_name,
        p_student_id: student_id,
        p_program: program
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Admin: instantly confirm a user's email (no verification email flow)
  async adminConfirmUser(userId) {
    if (!supabase) return { error: 'Supabase not initialized' };
    try {
      const { data, error } = await supabase.rpc('admin_confirm_user', { p_user_id: userId });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update user profile
  async updateUser(uid, updates) {
    if (!supabase) return { error: 'Supabase not initialized' };

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', uid);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get user profile
  async getUser(uid) {
    if (!supabase) return { error: 'Supabase not initialized' };

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', uid)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Occupancy management
  async updateSeatOccupancy(tableId, seatNumber, isOccupied, userId = null) {
    if (!supabase) return { error: 'Supabase not initialized' };

    try {
      // Use upsert with onConflict to handle conflicts properly
      const { data, error } = await supabase
        .from('occupancy')
        .upsert({
          table_id: tableId,
          seat_number: seatNumber,
          is_occupied: isOccupied,
          occupied_by: userId,
          occupied_at: isOccupied ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'table_id,seat_number'
        });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('updateSeatOccupancy error:', error);
      return { data: null, error };
    }
  },

  async getOccupancyData() {
    if (!supabase) return { error: 'Supabase not initialized' };

    try {
      const { data, error } = await supabase
        .from('occupancy')
        .select('*')
        .order('table_id', { ascending: true })
        .order('seat_number', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Real-time subscription for occupancy
  subscribeToOccupancy(callback) {
    if (!supabase) return null;

    return supabase
      .channel('occupancy_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'occupancy' },
        callback
      )
      .subscribe();
  },

  // Noise logs
  async addNoiseLog(userId, tableId, noiseLevel, activityType, notes = '') {
    if (!supabase) return { error: 'Supabase not initialized' };

    try {
      const { data, error } = await supabase
        .from('noise_logs')
        .insert([{
          user_id: userId,
          table_id: tableId,
          noise_level: noiseLevel,
          activity_type: activityType,
          notes: notes
        }]);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getNoiseLogs(userId, limit = 50) {
    if (!supabase) return { error: 'Supabase not initialized' };

    try {
      // Admin request for all logs
      if (userId === '*') {
        const { data, error } = await supabase.rpc('admin_get_noise_logs', { limit_count: limit });
        if (error) throw error;
        return { data, error: null };
      }

      // Use user RPC to avoid any RLS misconfig edge cases
      const { data, error } = await supabase.rpc('user_get_noise_logs', { limit_count: limit });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Public: list recent reports (community view)
  async publicListReports(limit = 50) {
    if (!supabase) return { error: 'Supabase not initialized' };
    try {
      const { data, error } = await supabase.rpc('public_list_reports', { limit_count: limit });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Alerts
  async addAlert(userId, alertType, message) {
    if (!supabase) return { error: 'Supabase not initialized' };

    try {
      const { data, error } = await supabase
        .from('alerts')
        .insert([{
          user_id: userId,
          alert_type: alertType,
          message: message
        }]);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getAlerts(userId, unreadOnly = false) {
    if (!supabase) return { error: 'Supabase not initialized' };

    try {
      let query = supabase
        .from('alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (unreadOnly) {
        query = query.eq('is_read', false);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async markAlertAsRead(alertId) {
    if (!supabase) return { error: 'Supabase not initialized' };

    try {
      const { data, error } = await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('id', alertId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Resolve a noise log (admin)
  async resolveNoiseLog(logId) {
    if (!supabase) return { error: 'Supabase not initialized' };
    try {
      // Use admin RPC to avoid RLS update issues
      const { data, error } = await supabase.rpc('admin_resolve_noise_log', { p_log_id: logId });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Cancel a noise log (user)
  async cancelNoiseLog(logId) {
    if (!supabase) return { error: 'Supabase not initialized' };
    try {
      const { data, error } = await supabase.rpc('user_cancel_noise_log', { p_log_id: logId });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Delete a noise log (admin)
  async deleteNoiseLog(logId) {
    if (!supabase) return { error: 'Supabase not initialized' };
    try {
      const { error } = await supabase.rpc('admin_delete_noise_log', { p_log_id: logId });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Admin: add alert to a specific user
  async adminAddUserAlert(userId, alertType, message) {
    if (!supabase) return { error: 'Supabase not initialized' };
    try {
      const { data, error } = await supabase.rpc('admin_add_user_alert', {
        p_user_id: userId,
        p_type: alertType,
        p_message: message
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Admin functions
  async isAdmin(userId) {
    if (!supabase) return { error: 'Supabase not initialized' };
    try {
      // Prefer RPC to avoid RLS recursion on admin_users table
      const { data, error } = await supabase.rpc('is_admin', { p_user_id: userId });
      if (error) throw error;
      return { data: !!data, error: null };
    } catch (error) {
      return { data: false, error };
    }
  },

  // Activity logs
  async addActivityLog({ userId = null, userName = null, type, title, description = '', severity = 'info', details = null }) {
    if (!supabase) return { error: 'Supabase not initialized' };
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .insert([{
          user_id: userId || null,
          user_name: userName || null,
          type,
          title,
          description,
          severity,
          details
        }]);
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getActivityLogs(limit = 200) {
    if (!supabase) return { error: 'Supabase not initialized' };
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Admin: list users with admin flag
  async adminListUsers(search = '', limit = 200) {
    if (!supabase) return { error: 'Supabase not initialized' };
    try {
      const { data, error } = await supabase.rpc('admin_list_users', { p_search: search || null, p_limit: limit });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Admin: set/unset admin role
  async adminSetUserAdmin(userId, makeAdmin) {
    if (!supabase) return { error: 'Supabase not initialized' };
    try {
      const { error } = await supabase.rpc('admin_set_user_admin', { p_user_id: userId, p_make_admin: !!makeAdmin });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Admin: delete a non-admin user's profile (not auth account)
  async adminDeleteUser(userId) {
    if (!supabase) return { error: 'Supabase not initialized' };
    try {
      const { error } = await supabase.rpc('admin_delete_user_profile', { p_user_id: userId });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Admin: purge a user and all related data (auth + app tables)
  async adminPurgeUser(userId) {
    if (!supabase) return { error: 'Supabase not initialized' };
    try {
      const { data, error } = await supabase.rpc('admin_purge_user', { p_user_id: userId });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Admin layout management
  async updateAdminLayout(layoutData) {
    if (!supabase) return { error: 'Supabase not initialized' };
    try {
      const { data, error } = await supabase.rpc('update_admin_layout', { p_layout_data: layoutData });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getAdminLayout() {
    if (!supabase) return { error: 'Supabase not initialized' };
    try {
      const { data, error } = await supabase
        .from('admin_layout')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return { data: data?.layout_data || null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Real-time subscription for admin layout changes
  subscribeToAdminLayout(callback) {
    if (!supabase) return null;
    return supabase
      .channel('admin_layout_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'admin_layout' },
        callback
      )
      .subscribe();
  },

  // Simple table position update (for future use)
  async updateTablePosition(tableId, left, top) {
    console.log('Table position updated:', tableId, 'left:', left, 'top:', top);
    return { data: { tableId, left, top }, error: null };
  }
};

// Export for use
window.supabaseAuth = auth;
window.supabaseDB = db;
window.initSupabase = initSupabase;
window.initSupabaseWithRetry = initSupabaseWithRetry;

