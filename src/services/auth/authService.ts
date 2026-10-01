/**
 * @file authService.ts
 * @description User profile and role management for consumer, machine operator, and laboratory engineer modes.
 */

export type UserRole = 'CONSUMER' | 'OPERATOR' | 'ENGINEER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
  activeLaboratory: string;
  preferredSkinType: string;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_lab_091',
  name: 'Elena Rostova',
  email: 'elena@soapify.engineering',
  role: 'CONSUMER',
  avatarInitials: 'ER',
  activeLaboratory: 'Bio-Automation Lab 4, Campus Engineering',
  preferredSkinType: 'Sensitive / Combination',
};

export class AuthService {
  private static currentUser: UserProfile = DEFAULT_USER;

  public static getUser(): UserProfile {
    return this.currentUser;
  }

  public static setRole(role: UserRole): void {
    this.currentUser = { ...this.currentUser, role };
  }
}
