export interface Module {
  id: string;
  status?: 'completed' | 'available' | 'locked'; // Optional - handled by module_progress database
  title: string;
  progress?: number; // 0-100 for completed modules
}

export type ModuleStatus = Module['status'];