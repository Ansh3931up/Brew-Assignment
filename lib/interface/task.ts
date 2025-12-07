export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'active' | 'completed'
  dueDate?: string
  priority: 'low' | 'medium' | 'high'
  flagged: boolean
  assignedBy?: string // Friend's ID who assigned this task
  assignedByEmail?: string // Friend's email
  createdAt: string
  updatedAt: string
}

export interface Friend {
  id: string
  name: string
  email: string
  avatar?: string
}

