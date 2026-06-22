export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  assignedDate: string | null;
  totalTimeSpent: number;
}

export interface BaseBlock {
  id: string;
  weekId: string;
  x?: number;
  y?: number;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string;
}

export interface TodoBlock extends BaseBlock {
  type: 'todo';
  title: string;
  tasks: Task[];
}

export type CanvasBlock = TextBlock | TodoBlock;
