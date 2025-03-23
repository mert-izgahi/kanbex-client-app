import { AuthProvider, NotificationType, Role, UserStatus } from "./enums";

export interface IAccount {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  role: Role;
  provider: AuthProvider;
  status: UserStatus;
  imageUrl?: string;
  accessToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWorkspace {
  _id: string;
  name: string;
  projects: IProject[];
  description?: string;
  imageUrl?: string;
  admin: IAccount;
  currentAccountPermission?: string;
  currentAccountStatus?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotification {
  _id: string;
  user: IAccount;
  type: NotificationType;
  message: string;
  metadata: object;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMember {
  _id: string;
  account: IAccount;
  projects: IProject[];
  workspace: IWorkspace;
  role: Role;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInvite {
  _id: string;
  workspace: IWorkspace;
  project: IProject;
  account: IAccount;
  email: string;
  role: Role;
  inviteCode: string;
  status: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProject {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  workspace: IWorkspace;
  projectMembers: IMember[];
  workspaceMembers: IMember[];
  workspaceAdmin: IMember;
  account: IAccount;
  manager: IMember;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITask {
  _id: string;
  name: string;
  description?: string;
  media?: string;
  mediaType?: string;
  project: IProject;
  workspace: IWorkspace;
  account: IAccount;
  assignee: IMember;
  status: string;
  priority: string;
  position: number;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  _id: string;
  content: string;
  task: ITask;
  project: IProject;
  workspace: IWorkspace;
  media?: string;
  mediaType?: string;
  account: IAccount;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWorkspaceAnalytics {
  workspace:IWorkspace;
  projectsCount: number;
  tasksCount: number;
  unCompleteTasksCount: number;
  membersCount: number;
  lastProjects: IProject[];
  lastTasks: ITask[];
}