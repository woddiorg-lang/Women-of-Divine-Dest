import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  rootingProgress: {
    completedModules: string[];
    completed: boolean;
  };
  blueprintProgress: {
    completedLessons: string[];
    completed: boolean;
  };
  courseHubUnlocked: boolean;
  completedSkills: string[];
  markRootingModule: (moduleId: string) => void;
  markBlueprintLesson: (lessonId: string) => void;
  completeSkill: (skillId: string) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      rootingProgress: { completedModules: [], completed: false },
      blueprintProgress: { completedLessons: [], completed: false },
      courseHubUnlocked: false,
      completedSkills: [],
      
      markRootingModule: (moduleId) => set((state) => {
        const mods = new Set(state.rootingProgress.completedModules);
        mods.add(moduleId);
        const completed = mods.size >= 8; // 8 Rooting modules total
        return {
          rootingProgress: { completedModules: Array.from(mods), completed },
          courseHubUnlocked: completed && state.blueprintProgress.completed
        };
      }),
      
      markBlueprintLesson: (lessonId) => set((state) => {
        const lessons = new Set(state.blueprintProgress.completedLessons);
        lessons.add(lessonId);
        const completed = lessons.size >= 13; // 13 Blueprint lessons total
        return {
          blueprintProgress: { completedLessons: Array.from(lessons), completed },
          courseHubUnlocked: state.rootingProgress.completed && completed
        };
      }),
      
      completeSkill: (skillId) => set((state) => {
        const skills = new Set(state.completedSkills);
        skills.add(skillId);
        return { completedSkills: Array.from(skills) };
      }),
    }),
    { name: 'woddi-progress-storage' }
  )
);
