import React, { useState, useEffect } from 'react';
import { ActivePage, SubjectId, Lecture } from './types';
import { StorageService } from './services/storage';
import { NotificationService } from './services/notifications';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingHero } from './components/LandingHero';
import { MainDashboard } from './components/MainDashboard';
import { CollegeInfoSection } from './components/CollegeInfoSection';
import { SubjectsSection } from './components/SubjectsSection';
import { ScheduleSection } from './components/ScheduleSection';
import { StudyResourcesSection } from './components/StudyResourcesSection';
import { GpaCalculatorModal } from './components/GpaCalculatorModal';
import { PomodoroTimerModal } from './components/PomodoroTimerModal';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('landing');
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId | undefined>(undefined);
  const [isDark, setIsDark] = useState<boolean>(true);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  
  // Modals
  const [isGpaOpen, setIsGpaOpen] = useState(false);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [openScheduleAddModal, setOpenScheduleAddModal] = useState(false);

  // Load Settings & Theme on Mount
  useEffect(() => {
    const savedSettings = StorageService.getSettings();
    setIsDark(savedSettings.theme === 'dark');
    if (savedSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Refresh lectures count
    const lecs = StorageService.getLectures();
    setLectures(lecs);

    // Start background notification scheduler
    NotificationService.startScheduler(() => StorageService.getLectures());

    return () => {
      NotificationService.stopScheduler();
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    StorageService.saveSettings({ theme: nextTheme ? 'dark' : 'light' });
  };

  const handleNavigate = (page: ActivePage, subjectId?: SubjectId) => {
    setActivePage(page);
    if (subjectId) {
      setSelectedSubjectId(subjectId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingCount = lectures.filter(l => l.date >= todayStr && !l.completed).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-cairo" dir="rtl">
      
      {/* Header Bar */}
      <Header
        activePage={activePage}
        setActivePage={(p) => handleNavigate(p)}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onOpenGpa={() => setIsGpaOpen(true)}
        onOpenPomodoro={() => setIsPomodoroOpen(true)}
        onOpenAddLecture={() => {
          setOpenScheduleAddModal(true);
          handleNavigate('schedule');
        }}
      />

      {/* Main Content Render */}
      <main className="flex-1">
        {activePage === 'landing' && (
          <LandingHero onEnter={() => handleNavigate('main')} />
        )}

        {activePage === 'main' && (
          <MainDashboard
            onNavigate={(p) => handleNavigate(p)}
            lectureCount={lectures.length}
            upcomingCount={upcomingCount}
          />
        )}

        {activePage === 'college' && (
          <CollegeInfoSection
            onBack={() => handleNavigate('main')}
            onNavigateToSubjects={() => handleNavigate('subjects')}
          />
        )}

        {(activePage === 'subjects' || activePage === 'subject-detail') && (
          <SubjectsSection
            onBack={() => handleNavigate('main')}
            initialSelectedId={selectedSubjectId}
          />
        )}

        {activePage === 'schedule' && (
          <ScheduleSection
            onBack={() => handleNavigate('main')}
            openAddModalInitially={openScheduleAddModal}
          />
        )}

        {activePage === 'resources' && (
          <StudyResourcesSection
            onBack={() => handleNavigate('main')}
            onNavigateToSubject={(subId) => handleNavigate('subjects', subId as SubjectId)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={(p) => handleNavigate(p)} />

      {/* Modals & Tools */}
      <GpaCalculatorModal isOpen={isGpaOpen} onClose={() => setIsGpaOpen(false)} />
      <PomodoroTimerModal isOpen={isPomodoroOpen} onClose={() => setIsPomodoroOpen(false)} />
      
      {/* PWA Install Prompt */}
      <PwaInstallPrompt />

    </div>
  );
}
