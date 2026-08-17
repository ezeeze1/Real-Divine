'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  SchoolProfile,
  SchoolClass,
  Subject,
  Student,
  Teacher,
  CBTExam,
  CBTAttempt,
  CAAndExamScore,
  StudentReportCard,
  CurriculumSubject,
  AttendanceRecord,
  TimetableSlot,
  Announcement,
  LessonPlanWeek,
} from '@/lib/types';
import {
  initialSchoolProfile,
  initialUsers,
  initialClasses,
  initialSubjects,
  initialTeachers,
  initialStudents,
  initialCBTExams,
  initialCBTAttempts,
  initialScores,
  initialReportCards,
  initialCurriculum,
  initialAttendanceRecords,
  initialTimetable,
  initialAnnouncements,
} from '@/lib/initialData';

interface SchoolContextType {
  // Current session & auth state
  currentUser: User;
  switchUserRole: (role: UserRole) => void;
  setCurrentUser: (user: User) => void;

  // School Profile
  schoolProfile: SchoolProfile;
  updateSchoolProfile: (profile: Partial<SchoolProfile>) => void;

  // Data Collections
  classes: SchoolClass[];
  subjects: Subject[];
  teachers: Teacher[];
  students: Student[];
  cbtExams: CBTExam[];
  cbtAttempts: CBTAttempt[];
  scores: CAAndExamScore[];
  reportCards: StudentReportCard[];
  curriculum: CurriculumSubject[];
  attendance: AttendanceRecord[];
  timetable: TimetableSlot[];
  announcements: Announcement[];

  // Actions
  addStudent: (student: Omit<Student, 'id' | 'admissionNo' | 'enrolledDate'>) => void;
  updateStudent: (id: string, updated: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  promoteStudents: (fromClassId: string, toClassId: string) => void;

  addTeacher: (teacher: Omit<Teacher, 'id' | 'staffNo' | 'joinedDate'>) => void;
  updateTeacher: (id: string, updated: Partial<Teacher>) => void;

  addClass: (cls: Omit<SchoolClass, 'id' | 'studentCount'>) => void;
  addSubject: (sub: Omit<Subject, 'id'>) => void;

  // CBT Actions
  createCBTExam: (exam: Omit<CBTExam, 'id' | 'createdAt'>) => void;
  updateCBTExam: (id: string, updated: Partial<CBTExam>) => void;
  submitCBTAttempt: (attempt: Omit<CBTAttempt, 'id'>) => CBTAttempt;

  // Score & Report Card Actions
  upsertScore: (scoreData: Omit<CAAndExamScore, 'id' | 'totalScore' | 'grade' | 'remark'>) => void;
  bulkUpsertScores: (scoreList: CAAndExamScore[]) => void;
  generateReportCard: (studentId: string, session: string, term: '1st Term' | '2nd Term' | '3rd Term') => StudentReportCard;
  updateReportCardComments: (reportCardId: string, teacherComment: string, principalComment: string) => void;

  // Curriculum Actions
  updateLessonPlan: (
    level: 'JSS1' | 'JSS2' | 'JSS3' | 'SS1' | 'SS2' | 'SS3',
    subjectName: string,
    term: '1st Term' | '2nd Term' | '3rd Term',
    weekPlan: LessonPlanWeek
  ) => void;

  // Attendance Actions
  markAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;

  // Announcement Actions
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;

  // Reset to default
  resetDataToDefaults: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'divine_academy_portal_data_v1';

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]); // Default Admin
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(initialSchoolProfile);
  const [classes, setClasses] = useState<SchoolClass[]>(initialClasses);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [cbtExams, setCbtExams] = useState<CBTExam[]>(initialCBTExams);
  const [cbtAttempts, setCbtAttempts] = useState<CBTAttempt[]>(initialCBTAttempts);
  const [scores, setScores] = useState<CAAndExamScore[]>(initialScores);
  const [reportCards, setReportCards] = useState<StudentReportCard[]>(initialReportCards);
  const [curriculum, setCurriculum] = useState<CurriculumSubject[]>(initialCurriculum);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  const [timetable, setTimetable] = useState<TimetableSlot[]>(initialTimetable);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);

  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.schoolProfile) setSchoolProfile(parsed.schoolProfile);
          if (parsed.classes) setClasses(parsed.classes);
          if (parsed.subjects) setSubjects(parsed.subjects);
          if (parsed.teachers) setTeachers(parsed.teachers);
          if (parsed.students) setStudents(parsed.students);
          if (parsed.cbtExams) setCbtExams(parsed.cbtExams);
          if (parsed.cbtAttempts) setCbtAttempts(parsed.cbtAttempts);
          if (parsed.scores) setScores(parsed.scores);
          if (parsed.reportCards) setReportCards(parsed.reportCards);
          if (parsed.curriculum) setCurriculum(parsed.curriculum);
          if (parsed.attendance) setAttendance(parsed.attendance);
          if (parsed.timetable) setTimetable(parsed.timetable);
          if (parsed.announcements) setAnnouncements(parsed.announcements);
          if (parsed.currentUser) setCurrentUser(parsed.currentUser);
        }
      } catch (e) {
        console.error('Error loading saved portal data:', e);
      } finally {
        setIsInitialized(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Save state updates to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      const stateToSave = {
        schoolProfile,
        classes,
        subjects,
        teachers,
        students,
        cbtExams,
        cbtAttempts,
        scores,
        reportCards,
        curriculum,
        attendance,
        timetable,
        announcements,
        currentUser,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save portal state to localStorage:', e);
    }
  }, [
    isInitialized,
    schoolProfile,
    classes,
    subjects,
    teachers,
    students,
    cbtExams,
    cbtAttempts,
    scores,
    reportCards,
    curriculum,
    attendance,
    timetable,
    announcements,
    currentUser,
  ]);

  const switchUserRole = (role: UserRole) => {
    const foundUser = initialUsers.find((u) => u.role === role);
    if (foundUser) {
      setCurrentUser(foundUser);
    } else {
      setCurrentUser({
        id: `user-${role.toLowerCase()}`,
        name: `${role} User`,
        email: `${role.toLowerCase()}@divineacademy.edu.ng`,
        role,
      });
    }
  };

  const updateSchoolProfile = (profile: Partial<SchoolProfile>) => {
    setSchoolProfile((prev) => ({ ...prev, ...profile }));
  };

  // Helper calculation for grade & remark
  const calculateGradeAndRemark = (total: number) => {
    if (total >= 70) return { grade: 'A' as const, remark: 'Distinction' };
    if (total >= 60) return { grade: 'B' as const, remark: 'Very Good' };
    if (total >= 50) return { grade: 'C' as const, remark: 'Credit' };
    if (total >= 45) return { grade: 'D' as const, remark: 'Pass' };
    if (total >= 40) return { grade: 'E' as const, remark: 'Fair Pass' };
    return { grade: 'F' as const, remark: 'Fail' };
  };

  // Students
  const addStudent = (studentData: Omit<Student, 'id' | 'admissionNo' | 'enrolledDate'>) => {
    const id = `student-${Date.now()}`;
    const year = new Date().getFullYear();
    const countStr = String(students.length + 1).padStart(3, '0');
    const admissionNo = `DA/${year}/${countStr}`;
    const newStudent: Student = {
      ...studentData,
      id,
      admissionNo,
      enrolledDate: new Date().toISOString().split('T')[0],
    };
    setStudents((prev) => [newStudent, ...prev]);

    // Update class student count
    setClasses((prev) =>
      prev.map((c) => (c.id === studentData.classId ? { ...c, studentCount: c.studentCount + 1 } : c))
    );
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteStudent = (id: string) => {
    const st = students.find((s) => s.id === id);
    if (st) {
      setClasses((prev) =>
        prev.map((c) => (c.id === st.classId ? { ...c, studentCount: Math.max(0, c.studentCount - 1) } : c))
      );
    }
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const promoteStudents = (fromClassId: string, toClassId: string) => {
    const targetClass = classes.find((c) => c.id === toClassId);
    if (!targetClass) return;

    setStudents((prev) =>
      prev.map((s) =>
        s.classId === fromClassId ? { ...s, classId: toClassId, className: targetClass.name } : s
      )
    );
  };

  // Teachers
  const addTeacher = (teacherData: Omit<Teacher, 'id' | 'staffNo' | 'joinedDate'>) => {
    const id = `teacher-${Date.now()}`;
    const year = new Date().getFullYear();
    const countStr = String(teachers.length + 1).padStart(3, '0');
    const staffNo = `DAT/${year}/${countStr}`;
    const newTeacher: Teacher = {
      ...teacherData,
      id,
      staffNo,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setTeachers((prev) => [newTeacher, ...prev]);
  };

  const updateTeacher = (id: string, updated: Partial<Teacher>) => {
    setTeachers((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
  };

  // Classes & Subjects
  const addClass = (clsData: Omit<SchoolClass, 'id' | 'studentCount'>) => {
    const id = `class-${clsData.name.toLowerCase().replace(/\s+/g, '-')}`;
    const newClass: SchoolClass = { ...clsData, id, studentCount: 0 };
    setClasses((prev) => [...prev, newClass]);
  };

  const addSubject = (subData: Omit<Subject, 'id'>) => {
    const id = `sub-${subData.code.toLowerCase()}`;
    const newSub: Subject = { ...subData, id };
    setSubjects((prev) => [...prev, newSub]);
  };

  // CBT
  const createCBTExam = (examData: Omit<CBTExam, 'id' | 'createdAt'>) => {
    const id = `exam-${Date.now()}`;
    const newExam: CBTExam = {
      ...examData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCbtExams((prev) => [newExam, ...prev]);
  };

  const updateCBTExam = (id: string, updated: Partial<CBTExam>) => {
    setCbtExams((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
  };

  const submitCBTAttempt = (attemptData: Omit<CBTAttempt, 'id'>) => {
    const id = `attempt-${Date.now()}`;
    const attempt: CBTAttempt = { ...attemptData, id };
    setCbtAttempts((prev) => [attempt, ...prev]);
    return attempt;
  };

  // Score Management
  const upsertScore = (scoreData: Omit<CAAndExamScore, 'id' | 'totalScore' | 'grade' | 'remark'>) => {
    const totalScore = scoreData.ca1 + scoreData.ca2 + scoreData.examScore;
    const { grade, remark } = calculateGradeAndRemark(totalScore);

    const existingIndex = scores.findIndex(
      (s) =>
        s.studentId === scoreData.studentId &&
        s.subjectId === scoreData.subjectId &&
        s.session === scoreData.session &&
        s.term === scoreData.term
    );

    if (existingIndex >= 0) {
      const updatedList = [...scores];
      updatedList[existingIndex] = {
        ...updatedList[existingIndex],
        ...scoreData,
        totalScore,
        grade,
        remark,
      };
      setScores(updatedList);
    } else {
      const newScore: CAAndExamScore = {
        ...scoreData,
        id: `sc-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        totalScore,
        grade,
        remark,
      };
      setScores((prev) => [...prev, newScore]);
    }
  };

  const bulkUpsertScores = (scoreList: CAAndExamScore[]) => {
    setScores(scoreList);
  };

  // Generate Report Card
  const generateReportCard = (
    studentId: string,
    session: string,
    term: '1st Term' | '2nd Term' | '3rd Term'
  ): StudentReportCard => {
    const student = students.find((s) => s.id === studentId);
    if (!student) throw new Error('Student not found');

    const studentScores = scores.filter(
      (s) => s.studentId === studentId && s.session === session && s.term === term
    );

    const totalSum = studentScores.reduce((acc, curr) => acc + curr.totalScore, 0);
    const avgScore = studentScores.length ? Number((totalSum / studentScores.length).toFixed(1)) : 0;

    // Calculate class ranking
    const classStudents = students.filter((s) => s.classId === student.classId);
    const studentAverages = classStudents.map((st) => {
      const stScores = scores.filter(
        (s) => s.studentId === st.id && s.session === session && s.term === term
      );
      const sum = stScores.reduce((a, b) => a + b.totalScore, 0);
      return {
        studentId: st.id,
        avg: stScores.length ? sum / stScores.length : 0,
      };
    });

    studentAverages.sort((a, b) => b.avg - a.avg);
    const pos = studentAverages.findIndex((s) => s.studentId === studentId) + 1;

    const existingRc = reportCards.find(
      (rc) => rc.studentId === studentId && rc.session === session && rc.term === term
    );

    if (existingRc) {
      const updatedRc: StudentReportCard = {
        ...existingRc,
        academicScores: studentScores,
        totalScoreSum: totalSum,
        averageScore: avgScore,
        positionInClass: pos || 1,
        classSize: classStudents.length || 1,
      };
      setReportCards((prev) => prev.map((rc) => (rc.id === existingRc.id ? updatedRc : rc)));
      return updatedRc;
    }

    const newRc: StudentReportCard = {
      id: `rc-${studentId}-${session.replace('/', '-')}-${term.replace(/\s+/g, '-')}`,
      studentId,
      studentName: student.fullName,
      admissionNo: student.admissionNo,
      classId: student.classId,
      className: student.className,
      session,
      term,
      academicScores: studentScores,
      totalScoreSum: totalSum,
      averageScore: avgScore,
      positionInClass: pos || 1,
      classSize: classStudents.length || 1,
      affectiveDomain: {
        punctuality: 5,
        neatness: 5,
        politeness: 5,
        honesty: 5,
        leadership: 4,
        cooperation: 5,
        attentiveness: 4,
      },
      psychomotorDomain: {
        handwriting: 4,
        sportsAndGames: 4,
        verbalFluency: 5,
        handlingTools: 4,
        craftsAndArts: 4,
      },
      teacherComment: 'Good effort demonstrated across subjects. Encouraged to aim higher next term.',
      principalComment: 'Praiseworthy results. Keep up the disciplined attitude to studies.',
      nextTermBegins: '2026-01-12',
      status: 'Published',
    };

    setReportCards((prev) => [...prev, newRc]);
    return newRc;
  };

  const updateReportCardComments = (reportCardId: string, teacherComment: string, principalComment: string) => {
    setReportCards((prev) =>
      prev.map((rc) => (rc.id === reportCardId ? { ...rc, teacherComment, principalComment } : rc))
    );
  };

  // Curriculum
  const updateLessonPlan = (
    level: 'JSS1' | 'JSS2' | 'JSS3' | 'SS1' | 'SS2' | 'SS3',
    subjectName: string,
    term: '1st Term' | '2nd Term' | '3rd Term',
    weekPlan: LessonPlanWeek
  ) => {
    setCurriculum((prev) => {
      const existingSubIndex = prev.findIndex(
        (c) => c.level === level && c.subjectName === subjectName && c.term === term
      );

      if (existingSubIndex >= 0) {
        const updatedCur = [...prev];
        const sub = { ...updatedCur[existingSubIndex] };
        const weekIndex = sub.weeks.findIndex((w) => w.weekNumber === weekPlan.weekNumber);

        if (weekIndex >= 0) {
          sub.weeks[weekIndex] = weekPlan;
        } else {
          sub.weeks.push(weekPlan);
          sub.weeks.sort((a, b) => a.weekNumber - b.weekNumber);
        }

        updatedCur[existingSubIndex] = sub;
        return updatedCur;
      } else {
        const newCur: CurriculumSubject = {
          id: `cur-${level.toLowerCase()}-${subjectName.toLowerCase().replace(/\s+/g, '-')}-${term.replace(/\s+/g, '')}`,
          level,
          subjectName,
          term,
          weeks: [weekPlan],
        };
        return [...prev, newCur];
      }
    });
  };

  // Attendance
  const markAttendance = (records: Omit<AttendanceRecord, 'id'>[]) => {
    const newRecordsWithIds: AttendanceRecord[] = records.map((r, i) => ({
      ...r,
      id: `att-${Date.now()}-${i}`,
    }));
    setAttendance((prev) => [...newRecordsWithIds, ...prev]);
  };

  // Announcement
  const addAnnouncement = (ancData: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnc: Announcement = {
      ...ancData,
      id: `anc-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAnnouncements((prev) => [newAnc, ...prev]);
  };

  const resetDataToDefaults = () => {
    setSchoolProfile(initialSchoolProfile);
    setClasses(initialClasses);
    setSubjects(initialSubjects);
    setTeachers(initialTeachers);
    setStudents(initialStudents);
    setCbtExams(initialCBTExams);
    setCbtAttempts(initialCBTAttempts);
    setScores(initialScores);
    setReportCards(initialReportCards);
    setCurriculum(initialCurriculum);
    setAttendance(initialAttendanceRecords);
    setTimetable(initialTimetable);
    setAnnouncements(initialAnnouncements);
    setCurrentUser(initialUsers[0]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <SchoolContext.Provider
      value={{
        currentUser,
        switchUserRole,
        setCurrentUser,
        schoolProfile,
        updateSchoolProfile,
        classes,
        subjects,
        teachers,
        students,
        cbtExams,
        cbtAttempts,
        scores,
        reportCards,
        curriculum,
        attendance,
        timetable,
        announcements,
        addStudent,
        updateStudent,
        deleteStudent,
        promoteStudents,
        addTeacher,
        updateTeacher,
        addClass,
        addSubject,
        createCBTExam,
        updateCBTExam,
        submitCBTAttempt,
        upsertScore,
        bulkUpsertScores,
        generateReportCard,
        updateReportCardComments,
        updateLessonPlan,
        markAttendance,
        addAnnouncement,
        resetDataToDefaults,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
