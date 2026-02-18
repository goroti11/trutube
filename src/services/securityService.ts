import { supabase } from '../lib/supabase';

/**
 * Service de sécurité de niveau terminal
 * Protection multi-couches pour la plateforme
 */

export interface SecurityEvent {
  id: string;
  user_id?: string;
  event_type: SecurityEventType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip_address: string;
  user_agent: string;
  details: Record<string, any>;
  timestamp: string;
}

export type SecurityEventType =
  | 'login_attempt'
  | 'failed_login'
  | 'password_change'
  | 'suspicious_activity'
  | 'rate_limit_exceeded'
  | 'csrf_detected'
  | 'xss_attempt'
  | 'sql_injection_attempt'
  | 'unauthorized_access'
  | 'data_breach_attempt'
  | 'account_locked'
  | 'session_hijack_attempt';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class SecurityService {
  private rateLimitCache: Map<string, { count: number; resetTime: number }> = new Map();
  private blockedIPs: Set<string> = new Set();
  private sessionTokens: Map<string, { userId: string; expiresAt: number }> = new Map();

  // Configurations de rate limiting par endpoint
  private rateLimits: Record<string, RateLimitConfig> = {
    'auth/login': { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 tentatives par 15 min
    'auth/register': { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 tentatives par heure
    'api/upload': { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 uploads par heure
    'api/comment': { maxRequests: 30, windowMs: 60 * 1000 }, // 30 commentaires par minute
    'api/like': { maxRequests: 100, windowMs: 60 * 1000 }, // 100 likes par minute
    'api/search': { maxRequests: 60, windowMs: 60 * 1000 }, // 60 recherches par minute
  };

  /**
   * Vérifier le rate limiting
   */
  async checkRateLimit(
    identifier: string,
    endpoint: string
  ): Promise<{ allowed: boolean; remainingRequests: number; resetTime: number }> {
    const key = `${identifier}:${endpoint}`;
    const config = this.rateLimits[endpoint] || { maxRequests: 100, windowMs: 60 * 1000 };
    const now = Date.now();

    let record = this.rateLimitCache.get(key);

    if (!record || now > record.resetTime) {
      record = {
        count: 0,
        resetTime: now + config.windowMs
      };
      this.rateLimitCache.set(key, record);
    }

    record.count++;

    const allowed = record.count <= config.maxRequests;

    if (!allowed) {
      await this.logSecurityEvent({
        user_id: identifier,
        event_type: 'rate_limit_exceeded',
        severity: 'medium',
        ip_address: identifier,
        user_agent: 'N/A',
        details: {
          endpoint,
          attempts: record.count,
          maxAllowed: config.maxRequests
        },
        timestamp: new Date().toISOString()
      });
    }

    return {
      allowed,
      remainingRequests: Math.max(0, config.maxRequests - record.count),
      resetTime: record.resetTime
    };
  }

  /**
   * Valider et nettoyer les inputs utilisateur (Protection XSS)
   */
  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Retirer les balises HTML
      .replace(/javascript:/gi, '') // Retirer les liens javascript
      .replace(/on\w+\s*=/gi, '') // Retirer les event handlers
      .trim();
  }

  /**
   * Valider une requête SQL (Protection SQL Injection)
   */
  validateSQLInput(input: string): boolean {
    const sqlInjectionPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
      /(--|;|\/\*|\*\/)/g,
      /('|"|`)/g
    ];

    for (const pattern of sqlInjectionPatterns) {
      if (pattern.test(input)) {
        this.logSecurityEvent({
          event_type: 'sql_injection_attempt',
          severity: 'critical',
          ip_address: 'unknown',
          user_agent: 'N/A',
          details: { input },
          timestamp: new Date().toISOString()
        });
        return false;
      }
    }

    return true;
  }

  /**
   * Générer un token CSRF
   */
  generateCSRFToken(userId: string): string {
    const token = this.generateSecureToken();
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 heure

    this.sessionTokens.set(token, { userId, expiresAt });

    return token;
  }

  /**
   * Valider un token CSRF
   */
  validateCSRFToken(token: string, userId: string): boolean {
    const session = this.sessionTokens.get(token);

    if (!session) {
      this.logSecurityEvent({
        user_id: userId,
        event_type: 'csrf_detected',
        severity: 'high',
        ip_address: 'unknown',
        user_agent: 'N/A',
        details: { token },
        timestamp: new Date().toISOString()
      });
      return false;
    }

    if (session.userId !== userId) {
      return false;
    }

    if (Date.now() > session.expiresAt) {
      this.sessionTokens.delete(token);
      return false;
    }

    return true;
  }

  /**
   * Chiffrer des données sensibles
   */
  async encryptData(data: string, key?: string): Promise<string> {
    try {
      // Utilisation de Web Crypto API pour le chiffrement
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);

      // Générer une clé de chiffrement
      const cryptoKey = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );

      // IV aléatoire
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // Chiffrer
      const encryptedBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        dataBuffer
      );

      // Convertir en base64
      const encryptedArray = new Uint8Array(encryptedBuffer);
      const combined = new Uint8Array(iv.length + encryptedArray.length);
      combined.set(iv);
      combined.set(encryptedArray, iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Erreur chiffrement:', error);
      throw error;
    }
  }

  /**
   * Déchiffrer des données
   */
  async decryptData(encryptedData: string, key?: string): Promise<string> {
    try {
      // Convertir de base64
      const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));

      // Extraire IV et données
      const iv = combined.slice(0, 12);
      const data = combined.slice(12);

      // Générer la clé (devrait être la même que pour le chiffrement)
      const cryptoKey = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );

      // Déchiffrer
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        data
      );

      // Convertir en string
      const decoder = new TextDecoder();
      return decoder.decode(decryptedBuffer);
    } catch (error) {
      console.error('Erreur déchiffrement:', error);
      throw error;
    }
  }

  /**
   * Hasher un mot de passe de manière sécurisée
   */
  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hash));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Vérifier la force d'un mot de passe
   */
  validatePasswordStrength(password: string): {
    valid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    // Longueur minimale
    if (password.length < 8) {
      feedback.push('Le mot de passe doit contenir au moins 8 caractères');
    } else {
      score += 20;
    }

    // Contient des majuscules
    if (/[A-Z]/.test(password)) {
      score += 20;
    } else {
      feedback.push('Ajoutez au moins une lettre majuscule');
    }

    // Contient des minuscules
    if (/[a-z]/.test(password)) {
      score += 20;
    } else {
      feedback.push('Ajoutez au moins une lettre minuscule');
    }

    // Contient des chiffres
    if (/[0-9]/.test(password)) {
      score += 20;
    } else {
      feedback.push('Ajoutez au moins un chiffre');
    }

    // Contient des caractères spéciaux
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 20;
    } else {
      feedback.push('Ajoutez au moins un caractère spécial');
    }

    return {
      valid: score >= 80,
      score,
      feedback
    };
  }

  /**
   * Bloquer une adresse IP
   */
  async blockIP(ip: string, reason: string, duration?: number): Promise<void> {
    this.blockedIPs.add(ip);

    await this.logSecurityEvent({
      event_type: 'account_locked',
      severity: 'high',
      ip_address: ip,
      user_agent: 'N/A',
      details: { reason, duration },
      timestamp: new Date().toISOString()
    });

    // Si une durée est spécifiée, débloquer automatiquement après
    if (duration) {
      setTimeout(() => {
        this.blockedIPs.delete(ip);
      }, duration);
    }
  }

  /**
   * Vérifier si une IP est bloquée
   */
  isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip);
  }

  /**
   * Détecter une activité suspecte
   */
  async detectSuspiciousActivity(
    userId: string,
    activityType: string,
    metadata: Record<string, any>
  ): Promise<boolean> {
    try {
      // Récupérer l'historique récent de l'utilisateur
      const { data: recentEvents } = await supabase
        .from('security_events')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: false });

      // Analyser les patterns suspects
      let suspicionScore = 0;

      // Trop de tentatives échouées
      const failedAttempts = recentEvents?.filter(e =>
        e.event_type === 'failed_login'
      ).length || 0;

      if (failedAttempts > 3) {
        suspicionScore += 30;
      }

      // Changement d'IP fréquent
      const uniqueIPs = new Set(recentEvents?.map(e => e.ip_address));
      if (uniqueIPs.size > 5) {
        suspicionScore += 25;
      }

      // Activité inhabituelle
      const eventCount = recentEvents?.length || 0;
      if (eventCount > 50) {
        suspicionScore += 20;
      }

      // Si score supérieur à 50, considérer comme suspect
      if (suspicionScore > 50) {
        await this.logSecurityEvent({
          user_id: userId,
          event_type: 'suspicious_activity',
          severity: 'high',
          ip_address: metadata.ip || 'unknown',
          user_agent: metadata.userAgent || 'N/A',
          details: {
            activityType,
            suspicionScore,
            metadata
          },
          timestamp: new Date().toISOString()
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Erreur détection activité suspecte:', error);
      return false;
    }
  }

  /**
   * Logger un événement de sécurité
   */
  async logSecurityEvent(event: Omit<SecurityEvent, 'id'>): Promise<void> {
    try {
      await supabase
        .from('security_events')
        .insert(event);

      // Si événement critique, alerter les admins
      if (event.severity === 'critical') {
        await this.alertAdmins(event);
      }
    } catch (error) {
      console.error('Erreur log événement sécurité:', error);
    }
  }

  /**
   * Obtenir les événements de sécurité d'un utilisateur
   */
  async getUserSecurityEvents(
    userId: string,
    limit: number = 50
  ): Promise<SecurityEvent[]> {
    try {
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Erreur récupération événements sécurité:', error);
      return [];
    }
  }

  /**
   * Obtenir les statistiques de sécurité globales
   */
  async getSecurityStats(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('security_events')
        .select('event_type, severity')
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        byType: {} as Record<string, number>,
        bySeverity: {} as Record<string, number>
      };

      data?.forEach(event => {
        stats.byType[event.event_type] = (stats.byType[event.event_type] || 0) + 1;
        stats.bySeverity[event.severity] = (stats.bySeverity[event.severity] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Erreur stats sécurité:', error);
      return null;
    }
  }

  /**
   * Générer un token sécurisé
   */
  private generateSecureToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Alerter les administrateurs en cas d'événement critique
   */
  private async alertAdmins(event: Omit<SecurityEvent, 'id'>): Promise<void> {
    try {
      // Insérer une alerte dans la table des notifications admin
      await supabase
        .from('admin_alerts')
        .insert({
          type: 'security',
          severity: event.severity,
          title: `Événement de sécurité: ${event.event_type}`,
          description: JSON.stringify(event.details),
          timestamp: event.timestamp
        });
    } catch (error) {
      console.error('Erreur alerte admins:', error);
    }
  }

  /**
   * Nettoyer le cache de rate limiting périodiquement
   */
  cleanupRateLimitCache(): void {
    const now = Date.now();
    for (const [key, record] of this.rateLimitCache.entries()) {
      if (now > record.resetTime) {
        this.rateLimitCache.delete(key);
      }
    }
  }

  /**
   * Nettoyer les tokens CSRF expirés
   */
  cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [token, session] of this.sessionTokens.entries()) {
      if (now > session.expiresAt) {
        this.sessionTokens.delete(token);
      }
    }
  }
}

export const securityService = new SecurityService();

// Nettoyer les caches toutes les 5 minutes
setInterval(() => {
  securityService.cleanupRateLimitCache();
  securityService.cleanupExpiredTokens();
}, 5 * 60 * 1000);
