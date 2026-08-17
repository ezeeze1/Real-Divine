export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phoneNumber?: string;
  studentId?: string; // Link to student record if STUDENT or PARENT
  teacherId?: string; // Link to teacher record if TEACHER
}

export interface SchoolProfile {
  name: string;
  motto: string;
  address: string;
  state: string;
  email: string;
  phone: string;
  logoUrl: string;
  currentSession: string; // e.g. "2025/2026"
  currentTerm: '1st Term' | '2nd Term' | '3rd Term';
  principalName: string;
  principalSignatureUrl?: string;
}

export interface SchoolClass {
  id: string;
  name: string; // e.g., "JSS1", "JSS2", "JSS3", "SS1 Science", "SS2 Arts", etc.
  level: 'JSS1' | 'JSS2' | 'JSS3' | 'SS1' | 'SS2' | 'SS3';
  arm: 'A' | 'B' | 'Science' | 'Arts' | 'Commercial';
  formTeacherId?: string;
  studentCount: number;
}

export interface Subject {
  id: string;
  code: string; // e.g., "MTH101"
  name: string; // e.g., "Mathematics"
  category: 'Core' | 'Science' | 'Arts' | 'Commercial' | 'General';
  levelGroup: 'JSS' | 'SSS' | 'ALL';
}

export interface Student {
  id: string;
  admissionNo: string; // e.g., "DA/2024/001"
  fullName: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  classId: string;
  className: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  address: string;
  passportUrl?: string;
  status: 'Active' | 'Graduated' | 'Suspended';
  enrolledDate: string;
  password?: string;
}

export interface Teacher {
  id: string;
  staffNo: string; // e.g., "DAT/2022/012"
  fullName: string;
  gender: 'Male' | 'Female';
  qualification: string; // e.g. "B.Sc Ed. Mathematics"
  email: string;
  phone: string;
  subjectsTaught: { subjectId: string; subjectName: string; classId: string; className: string }[];
  isFormTeacherOf?: string; // className
  status: 'Active' | 'On Leave';
  joinedDate: string;
}

// CBT System Types
export interface CBTQuestionOption {
  id: string;
  text: string;
}

export interface CBTQuestion {
  id: string;
  questionText: string;
  options: CBTQuestionOption[];
  correctOptionId: string;
  explanation?: string;
  marks: number;
  topic?: string;
}

export interface CBTExam {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  teacherId: string;
  durationMinutes: number;
  totalMarks: number;
  passPercentage: number;
  maxAttempts: number; // e.g., 1 or 2
  shuffleQuestions: boolean;
  status: 'Draft' | 'Published' | 'Closed';
  createdAt: string;
  startDateTime?: string; // e.g., "2026-08-17T09:00"
  questions: CBTQuestion[];
}

export interface CBTAttempt {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  answers: { questionId: string; selectedOptionId: string; isCorrect: boolean; marksObtained: number }[];
  scoreObtained: number;
  totalPossibleMarks: number;
  percentageScore: number;
  passed: boolean;
  startedAt: string;
  completedAt: string;
  timeTakenSeconds: number;
}

// Result Management Types
export interface CAAndExamScore {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  session: string;
  term: '1st Term' | '2nd Term' | '3rd Term';
  ca1: number; // Max 20
  ca2: number; // Max 20
  examScore: number; // Max 60
  totalScore: number; // 100
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  remark: string; // e.g. "Excellent", "Very Good", "Credit", "Pass", "Fail"
  positionInClass?: number;
}

export interface AffectiveDomainRating {
  punctuality: number; // 1 to 5
  neatness: number;
  politeness: number;
  honesty: number;
  leadership: number;
  cooperation: number;
  attentiveness: number;
}

export interface PsychomotorDomainRating {
  handwriting: number; // 1 to 5
  sportsAndGames: number;
  verbalFluency: number;
  handlingTools: number;
  craftsAndArts: number;
}

export interface StudentReportCard {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classId: string;
  className: string;
  session: string;
  term: '1st Term' | '2nd Term' | '3rd Term';
  academicScores: CAAndExamScore[];
  totalScoreSum: number;
  averageScore: number;
  positionInClass: number;
  classSize: number;
  affectiveDomain: AffectiveDomainRating;
  psychomotorDomain: PsychomotorDomainRating;
  teacherComment: string;
  principalComment: string;
  nextTermBegins: string;
  status: 'Draft' | 'Approved' | 'Published';
}

// Curriculum Centre Types
export interface LessonPlanWeek {
  weekNumber: number; // 1 to 13
  topic: string;
  subTopics: string[];
  objectives: string[];
  instructionalMaterials: string[];
  previousKnowledge: string;
  teacherActivities: string;
  learnerActivities: string;
  boardSummary: string;
  evaluationQuestions: string[];
  homework: string;
  linkedCbtQuestions?: CBTQuestion[];
}

export interface CurriculumSubject {
  id: string;
  level: 'JSS1' | 'JSS2' | 'JSS3' | 'SS1' | 'SS2' | 'SS3';
  subjectName: string;
  term: '1st Term' | '2nd Term' | '3rd Term';
  weeks: LessonPlanWeek[];
}

// Attendance Types
export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  classId: string;
  className: string;
  studentId: string;
  studentName: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  remark?: string;
}

// Timetable Types
export interface TimetableSlot {
  id: string;
  classId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  periodNumber: number; // 1 to 8
  timeRange: string; // e.g. "08:00 AM - 08:40 AM"
  subjectName: string;
  teacherName: string;
}

// Announcements
export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'General' | 'Academic' | 'Exam' | 'PTA' | 'Urgent';
  targetRole: 'ALL' | 'STUDENT' | 'TEACHER' | 'PARENT';
  author: string;
  createdAt: string;
}
