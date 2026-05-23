import type { StaffMember, ActivityLog } from "../types/staff";

let staffData: StaffMember[] = [
  { id: "1", username: "schen", email: "sarah.chen@museum.ph", firstName: "Sarah", middleName: "Mae", lastName: "Chen", name: "Sarah Mae Chen", role: "Administrator", department: "Curatorial", status: "Active", joinedDate: "2023-01-15", lastActive: new Date().toISOString(), permissions: [] },
  { id: "2", username: "jdelacruz", email: "juan.delacruz@museum.ph", firstName: "Juan", middleName: "Santos", lastName: "Dela Cruz", name: "Juan Santos Dela Cruz", role: "Staff", department: "Collections", status: "Active", joinedDate: "2023-03-20", lastActive: new Date().toISOString(), permissions: [] },
  { id: "3", username: "mreyes", email: "maria.reyes@museum.ph", firstName: "Maria", middleName: "Luna", lastName: "Reyes", name: "Maria Luna Reyes", role: "Staff", department: "Conservation", status: "Active", joinedDate: "2023-06-10", lastActive: new Date(Date.now() - 7200000).toISOString(), permissions: [] },
  { id: "4", username: "atorres", email: "antonio.torres@museum.ph", firstName: "Antonio", middleName: "", lastName: "Torres", name: "Antonio Torres", role: "Assistant", department: "Education", status: "On Leave", joinedDate: "2024-01-05", lastActive: new Date(Date.now() - 86400000 * 3).toISOString(), permissions: [] },
  { id: "5", username: "lsantos", email: "luz.santos@museum.ph", firstName: "Luz", middleName: "Garcia", lastName: "Santos", name: "Luz Garcia Santos", role: "Staff", department: "Volunteer", status: "Active", joinedDate: "2024-02-14", lastActive: new Date().toISOString(), permissions: [] },
];

export function getAllStaff(): StaffMember[] {
  return staffData;
}

export function addStaff(data: Omit<StaffMember, "id">): void {
  const id = String(staffData.length + 1);
  staffData = [...staffData, { ...data, id }];
}

export function updateStaff(id: string, data: StaffMember): void {
  staffData = staffData.map(s => s.id === id ? data : s);
}

const mockActivityLogs: Record<string, ActivityLog[]> = {
  "1": [
    { id: "a1", action: "Approved artifact transfer", timestamp: new Date(Date.now() - 3600000).toISOString(), details: "Approved transfer of 5 artifacts to Exhibit Hall B" },
    { id: "a2", action: "Updated collection metadata", timestamp: new Date(Date.now() - 86400000).toISOString(), details: "Updated metadata for 12 items in pre-colonial collection" },
  ],
  "2": [
    { id: "a3", action: "Catalogued new acquisition", timestamp: new Date(Date.now() - 7200000).toISOString(), details: "Catalogued pottery fragments from Bicol excavation" },
    { id: "a4", action: "Performed condition check", timestamp: new Date(Date.now() - 172800000).toISOString(), details: "Routine condition check on Gallery 3 exhibits" },
  ],
};

export function getStaffActivityLog(staffId: string): ActivityLog[] {
  return mockActivityLogs[staffId] ?? [];
}
