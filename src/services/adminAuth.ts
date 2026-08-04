// Admin Auth Service with Rate Limiting & Lockout

const ADMIN_PASSWORD_HASH = '20052026'; // Configured secret password requirement
const AUTH_SESSION_KEY = 'daleelak_admin_authenticated_session';
const FAILED_ATTEMPTS_KEY = 'daleelak_admin_failed_attempts';
const LOCKOUT_TIMESTAMP_KEY = 'daleelak_admin_lockout_until';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 1000; // 30 seconds lockout

export interface AuthState {
  isAuthenticated: boolean;
  isLockedOut: boolean;
  lockoutSecondsLeft: number;
  failedAttempts: number;
  errorMessage: string | null;
}

export class AdminAuthService {
  static isAuthenticated(): boolean {
    const session = sessionStorage.getItem(AUTH_SESSION_KEY);
    if (!session) return false;
    try {
      const data = JSON.parse(session);
      return data && data.auth === true && (Date.now() - data.loginTime < 24 * 60 * 60 * 1000);
    } catch {
      return false;
    }
  }

  static getLockoutStatus(): { isLockedOut: boolean; secondsLeft: number } {
    const lockoutUntilStr = localStorage.getItem(LOCKOUT_TIMESTAMP_KEY);
    if (!lockoutUntilStr) return { isLockedOut: false, secondsLeft: 0 };

    const lockoutUntil = parseInt(lockoutUntilStr, 10);
    const now = Date.now();

    if (now < lockoutUntil) {
      const secondsLeft = Math.ceil((lockoutUntil - now) / 1000);
      return { isLockedOut: true, secondsLeft };
    } else {
      // Lockout expired
      localStorage.removeItem(LOCKOUT_TIMESTAMP_KEY);
      localStorage.setItem(FAILED_ATTEMPTS_KEY, '0');
      return { isLockedOut: false, secondsLeft: 0 };
    }
  }

  static getFailedAttemptsCount(): number {
    const count = localStorage.getItem(FAILED_ATTEMPTS_KEY);
    return count ? parseInt(count, 10) : 0;
  }

  static login(passwordInput: string): { success: boolean; error?: string; lockoutSeconds?: number } {
    // 1. Check if locked out
    const lockoutStatus = this.getLockoutStatus();
    if (lockoutStatus.isLockedOut) {
      return {
        success: false,
        error: `تم قفل الدخول مؤقتاً بسبب المحاولات الخاطئة. يرجى الانتظار ${lockoutStatus.secondsLeft} ثانية.`,
        lockoutSeconds: lockoutStatus.secondsLeft
      };
    }

    // 2. Validate Password
    if (passwordInput === ADMIN_PASSWORD_HASH) {
      // Success! Reset failed attempts & set session
      localStorage.setItem(FAILED_ATTEMPTS_KEY, '0');
      localStorage.removeItem(LOCKOUT_TIMESTAMP_KEY);
      
      const sessionData = {
        auth: true,
        loginTime: Date.now()
      };
      sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionData));
      return { success: true };
    }

    // 3. Increment Failed Attempts
    const currentFailed = this.getFailedAttemptsCount() + 1;
    localStorage.setItem(FAILED_ATTEMPTS_KEY, currentFailed.toString());

    if (currentFailed >= MAX_FAILED_ATTEMPTS) {
      const lockoutTime = Date.now() + LOCKOUT_DURATION_MS;
      localStorage.setItem(LOCKOUT_TIMESTAMP_KEY, lockoutTime.toString());
      return {
        success: false,
        error: `كلمة المرور غير صحيحة. تم حظر المحاولات مؤقتاً لمدة 30 ثانية لتأمين الحساب.`,
        lockoutSeconds: 30
      };
    }

    const remainingAttempts = MAX_FAILED_ATTEMPTS - currentFailed;
    return {
      success: false,
      error: `كلمة المرور غير صحيحة! المتبقي لديك ${remainingAttempts} محاولات قبل القفل المؤقت.`
    };
  }

  static logout(): void {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  }
}
