export interface StaffMember {
  id: string;
  username: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  name: string;
  role: "Administrator" | "Staff" | "Assistant";
  department: string;
  status: "Active" | "On Leave" | "Inactive";
  joinedDate: string;
  lastActive: string;
  permissions: any[];
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}
