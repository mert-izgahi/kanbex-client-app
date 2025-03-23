import { TaskPriority, TaskStatus } from "@/lib/enums"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"

const badgeProps: Record<TaskStatus, { color: string, label: string }> = {
    [TaskStatus.TODO]: {
        color: "bg-red-500",
        label: "To Do"
    },
    [TaskStatus.IN_PROGRESS]: {
        color: "bg-yellow-500",
        label: "In Progress"
    },
    [TaskStatus.DONE]: {
        color: "bg-green-500",
        label: "Done"
    },
    [TaskStatus.IN_REVIEW]: {
        color: "bg-blue-500",
        label: "In Review"
    },
}

const priorityProps: Record<TaskPriority, { color: string, label: string }> = {
    [TaskPriority.LOW]: {
        color: "bg-green-500",
        label: "Low"
    },
    [TaskPriority.MEDIUM]: {
        color: "bg-yellow-500",
        label: "Medium"
    },
    [TaskPriority.HIGH]: {
        color: "bg-red-500",
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