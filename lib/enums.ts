export enum Role {
  ADMIN = "admin",
  MANAGER = "manager",
  MEMBER = "member",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BANNED = "banned",
}

export enum AuthProvider {
  GOOGLE = "google",
  CREDENTIALS = "credentials",
}

export enum NotificationType {
  INVITE = "invite",
  WORKSPACE = "workspace",
  MESSAGE = "message",
  ASSIGNMENT = "assignment",
  COMMENT = "comment",
}

export enum InviteStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
}

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  IN_REVIEW = "in_review",
  DONE = "done",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
  DOCUMENT = "document",
}