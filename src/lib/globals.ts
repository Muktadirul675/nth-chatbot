export const VISITOR_KEY = "visitors"
export const TRANSCRIPT_RECIEVERS = ['muktadirul.04@gmail.com']

export type ChatbotSetting = {
    key: string
    value: string
}

export const SETTINGS_USERNAME_KEY = "settings:auth:username"
export const SETTINGS_PASSWORD_KEY = "settings:auth:password"
export const SETTINGS_TRANSCRIPT_RECEIVERS_KEY = "settings:transcript-recievers"
export const SETTINGS_MAIL_HOST = "settings:mail:host"
export const SETTINGS_MAIL_USER = "settings:mail:user"
export const SETTINGS_MAIL_PASSWORD = "settings:mail:password"
export const SETTINGS_MODERATOR_PASS_PREFIX = "settings:auth:moderator:password:"

export const MODERATOR_ROLE = 'moderator'
export const ADMIN_ROLE = 'admin'
export const ROLES = [ADMIN_ROLE, MODERATOR_ROLE]
