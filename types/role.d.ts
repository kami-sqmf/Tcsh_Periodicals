import { MemberRole } from "@/utils/role"

export type MemberRoleKey = keyof typeof MemberRole

export type MemberRole = {
  [key in MemberRoleKey]: {
    id: key
    name: string
  }
}