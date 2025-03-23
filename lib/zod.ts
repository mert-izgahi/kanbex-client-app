import { z, TypeOf } from "zod";
import { Role } from "./enums";
export const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

export const signUpSchema = signInSchema.extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export const workspaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const acceptWorkspaceInviteSchema = z.object({
  inviteCode: z.string().min(1, "Invite code is required"),
});

export const createInviteSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  role: z.nativeEnum(Role),
  workspaceId: z.string().min(1, "Workspace ID is required"),
  projectId: z.string().min(1, "Project ID is required"),
});

export const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().optional(),
  description: z.string().optional(),
  workspaceId: z.string().min(1, "Workspace ID is required"),
});

export const taskSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    media: z.string().optional(),
    mediaType: z.string().optional(),
    projectId: z.string().min(1, "Project ID is required"),
    workspaceId: z.string().min(1, "Workspace ID is required"),
    assigneeId: z.string().min(1, "Assignee ID is required"),
    status: z.string().min(1, "Status is required"),
    priority: z.string().min(1, "Priority is required"),
    position: z.number().optional(),
    dueDate: z.date().optional(),
  })
  .refine(
    (data) => {
      if (data.dueDate) {
        return data.dueDate >= new Date();
      }
      return true;
    },
    {
      message: "Due date must be in the future",
      path: ["dueDate"],
    }
  )
  .refine(
    (data) => {
      // Check if media type is document and media url is google docs url
      if (data.mediaType) {
        if (data.mediaType === "document" && data.media !== null) {
          return data?.media?.startsWith("https://docs.google.com/document/d/");
        }
      }
      return true;
    },
    {
      message: "Media URL must be a Google Docs URL",
      path: ["media"],
    }
  );

export const commentSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  projectId: z.string().min(1, "Project ID is required"),
  workspaceId: z.string().min(1, "Workspace ID is required"),
  content: z.string().min(1, "Content is required"),
  media: z.string().optional(),
  mediaType: z.string().optional(),
});

export type SignInSchema = TypeOf<typeof signInSchema>;
export type SignUpSchema = TypeOf<typeof signUpSchema>;
export type WorkspaceSchema = TypeOf<typeof workspaceSchema>;
export type AcceptWorkspaceInviteSchema = TypeOf<
  typeof acceptWorkspaceInviteSchema
>;
export type CreateInviteSchema = TypeOf<typeof createInviteSchema>;
export type ProjectSchema = TypeOf<typeof projectSchema>;
export type TaskSchema = TypeOf<typeof taskSchema>;
export type CommentSchema = TypeOf<typeof commentSchema>;
