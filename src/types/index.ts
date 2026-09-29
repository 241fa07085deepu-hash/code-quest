export type UserRole = 'student' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  xp: number;
  level: number;
  streakDays: number;
  completedQuests: string[]; // quest IDs
  createdAt: string;
}

export interface TestCase {
  id: string;
  inputDescription: string;
  expectedOutput: string;
  hidden?: boolean;
}

export interface TopicQuest {
  id: string;
  topicId: number;
  title: string;
  gameName: string;
  conceptName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeComplexity: string;
  spaceComplexity: string;
  gameDescription: string;
  problemStatement: string;
  objective: string;
  starterCode: string;
  solutionCode: string;
  solutionExplanation: string[];
  hints: string[];
  testCases: TestCase[];
  initialGameState: any;
}

export interface Topic {
  id: number;
  title: string;
  slug: string;
  category: 'Fundamentals' | 'Linear DSA' | 'Algorithms' | 'Trees & Hashing';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  summary: string;
  theoryExplanation: string;
  pythonSyntaxGuide: string;
  image: string;
  quest: TopicQuest;
}

export interface Submission {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  questId: string;
  topicTitle: string;
  code: string;
  status: 'passed' | 'failed';
  output: string;
  passedCount: number;
  totalCount: number;
  xpEarned: number;
  timestamp: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  role: UserRole;
  xp: number;
  level: number;
  questsCompleted: number;
  streakDays: number;
}
