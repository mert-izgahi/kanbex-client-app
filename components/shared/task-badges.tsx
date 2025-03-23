import { TaskPriority, TaskStatus } from "@/lib/enums"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"

const badgeProps: Record<TaskStatus, { color: string, label: string }> = {
    [TaskStatus.TODO]: {
        color: "bg-destructive",
        label: "To Do"
    },
    [TaskStatus.IN_PROGRESS]: {
        color: "bg-warning",
        label: "In Progress"
    },
    [TaskStatus.DONE]: {
        color: "bg-success",
        label: "Done"
    },
    [TaskStatus.IN_REVIEW]: {
        color: "bg-netural",
        label: "In Review"
    },
}

const priorityProps: Record<TaskPriority, { color: string, label: string }> = {
    [TaskPriority.LOW]: {
        color: "bg-warning",
        label: "Low"
    },
    [TaskPriority.MEDIUM]: {
        color: "bg-info",
        label: "Medium"
    },
    [TaskPriority.HIGH]: {
        color: "bg-destructive",
        label: "High"
    }
}

export const TaskStatusBadge = ({ status }: { status: TaskStatus }) => {
    return <Badge className={cn("max-w-20 w-full", badgeProps[status].color)}>
        {badgeProps[status].label}
    </Badge>
}

export const TaskPriorityBadge = ({ priority }: { priority: TaskPriority }) => {
    return <Badge className={cn("max-w-20 w-full", priorityProps[priority].color)}>
        {priorityProps[priority].label}
    </Badge>
}