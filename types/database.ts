export type UserRole = "member" | "admin" | "super_admin";
export type UserTier = "free" | "pro";
export type AccountStatus =
  | "email_unverified"
  | "active"
  | "past_due"
  | "canceled";
export type SupportPriority = "none" | "standard";
export type TicketStatus =
  | "open"
  | "awaiting_response"
  | "in_progress"
  | "resolved";
export type OsType = "windows11" | "macos";
export type SenderRole = "user" | "agent" | "system";
export type DeletionStatus = "pending" | "approved" | "denied";

export interface Profile {
  user_id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  tier: UserTier;
  account_status: AccountStatus;
  support_priority: SupportPriority;
  stripe_customer_id: string | null;
  trial_expires_at: string | null;
  onboarding_completed: boolean;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_price_id: string;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  assigned_admin_id: string | null;
  title: string;
  description: string;
  os_type: OsType | null;
  issue_category: string | null;
  priority: SupportPriority;
  status: TicketStatus;
  last_admin_reply_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupportTicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  sender_role: SenderRole;
  body: string;
  created_at: string;
}

export interface SupportTicketAttachment {
  id: string;
  ticket_id: string;
  message_id: string | null;
  user_id: string;
  storage_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
}

export interface UserSavedGuide {
  user_id: string;
  guide_slug: string;
  created_at: string;
}

export interface UserRecentGuide {
  user_id: string;
  guide_slug: string;
  viewed_at: string;
}

export interface AccountDeletionRequest {
  id: string;
  user_id: string;
  reason: string | null;
  status: DeletionStatus;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLogEntry {
  id: string;
  user_id: string | null;
  action: string;
  metadata: Record<string, unknown>;
  created_at: string;
}
