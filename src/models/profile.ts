export enum TaskType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export class Profile {
  user!: User
  groups!: Array<Group>
}

export class User {
  id!: string
  username!: string
  notes!: Array<UserNote>
  tasks!: Array<Task>
  createdAt!: Date
  updatedAt!: Date
}

export class Group {
  id!: string
  name!: string
  members!: Array<GroupMember>
  notes!: Array<GroupNote>
  createdAt!: Date
  updatedAt!: Date
}

export class Task {
  id!: string
  title!: string
  description?: string
  taskType!: TaskType
  lastCompleted?: Date
  createdAt!: Date
  updatedAt!: Date
}

export class UserNote {
  id!: string
  title!: string
  contents!: string
  createdAt!: Date
  updatedAt!: Date
}

export class GroupNote {
  id!: string
  title!: string
  contents!: string
  author!: GroupMember
  createdAt!: Date
  updatedAt!: Date
}

export class GroupMember {
  id!: string
  username!: string
}