import { ProfileResource, getReferenceString } from '@medplum/core';
import {
  AppShell,
  Loading,
  Logo,
  NotificationIcon,
  useMedplum,
  useMedplumNavigate,
  useMedplumProfile,
} from '@medplum/react';
import {
  IconCalendar,
  IconClipboardCheck,
  IconFileImport,
  IconMail,
  IconPencil,
  IconTimeDuration0,
  IconTimeDuration15,
  IconUpload,
  IconUser,
} from '@tabler/icons-react';
import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CreateResourcePage } from './pages/CreateResourcePage';
import { HomePage } from './pages/HomePage';
import { OnboardingPage } from './pages/OnboardingPage';
import { ResourcePage } from './pages/ResourcePage';
import { SearchPage } from './pages/SearchPage';
import { SignInPage } from './pages/SignInPage';
import { EditTab } from './pages/patient/EditTab';
import { DeleteTab } from './pages/patient/DeleteTab';
import { EncounterTab } from './pages/patient/EncounterTab';
import { LabsTab } from './pages/patient/LabsTab';
import { MedsTab } from './pages/patient/MedsTab';
import { PatientPage } from './pages/patient/PatientPage';
import { PatientSearchPage } from './pages/patient/PatientSearchPage';
import { TasksTab } from './pages/patient/TasksTab';
import { TimelineTab } from './pages/patient/TimelineTab';
import { HealthRecord } from './pages/health-record';
import { LabResults } from './pages/health-record/LabResults';
import { LabResult } from './pages/health-record/LabResult';
import { Medication } from './pages/health-record/Medication';
import { Vaccine } from './pages/health-record/Vaccine';
import { Vaccines } from './pages/health-record/Vaccines';
import { Vitals } from './pages/health-record/Vitals';
import { Measurement } from './pages/health-record/Measurement';
import { Medications } from './pages/health-record/Medications';
import { BatchPage } from './pages/BatchPage';
import { EditPage } from './pages/resource/EditPage';
import { DeletePage } from './pages/resource/DeletePage';
import { TimelinePage } from './pages/resource/TimelinePage';
import { ReportPage } from './pages/resource/ReportPage';

export function App(): JSX.Element | null {
  const medplum = useMedplum();
  const profile = useMedplumProfile();
  const navigate = useMedplumNavigate();

  if (medplum.isLoading()) {
    return null;
  }

  return (
    <AppShell
      logo={<Logo size={24} />}
      menus={[
        {
          title: 'Charts',
          links: [{ icon: <IconUser />, label: 'Patients', href: '/' }],
        },
        {
          title: 'Scheduling',
          links: [
            { icon: <IconTimeDuration0 />, label: 'New Appointment', href: '/Appointment/new' },
            {
              icon: <IconTimeDuration15 />,
              label: 'Appointment Requests',
              href: '/Appointment?_count=20&_fields=_lastUpdated,patient,practitioner,start,end,serviceType&_offset=0&_sort=-_lastUpdated&status=proposed',
            },
            {
              icon: <IconCalendar />,
              label: 'Upcoming Appointments',
              href: '/Appointment?_count=20&_fields=_lastUpdated,patient,practitioner,start,end,serviceType&_offset=0&_sort=-_lastUpdated&status=booked',
            },
          ],
        },
        {
          title: 'Onboarding',
          links: [
            { icon: <IconPencil />, label: 'New Patient', href: '/onboarding' },
            { icon: <IconFileImport />, label: 'Batch Import', href: '/batch' },
          ],
        },
      ]}
      resourceTypeSearchDisabled={true}
      notifications={
        profile && (
          <>
            <NotificationIcon
              label="Mail"
              resourceType="Communication"
              countCriteria={`recipient=${getReferenceString(
                profile as ProfileResource
              )}&status:not=completed&_summary=count`}
              subscriptionCriteria={`Communication?recipient=${getReferenceString(profile as ProfileResource)}`}
              iconComponent={<IconMail />}
              onClick={() =>
                navigate(
                  `/Communication?recipient=${getReferenceString(
                    profile as ProfileResource
                  )}&status:not=completed&_fields=sender,recipient,subject,status,_lastUpdated`
                )
              }
            />
            <NotificationIcon
              label="Tasks"
              resourceType="Task"
              countCriteria={`owner=${getReferenceString(
                profile as ProfileResource
              )}&status:not=completed&_summary=count`}
              subscriptionCriteria={`Task?owner=${getReferenceString(profile as ProfileResource)}`}
              iconComponent={<IconClipboardCheck />}
              onClick={() =>
                navigate(
                  `/Task?owner=${getReferenceString(
                    profile as ProfileResource
                  )}&status:not=completed&_fields=subject,code,description,status,_lastUpdated`
                )
              }
            />
          </>
        )
      }
    >
      <Suspense fallback={<Loading />}>
        <Routes>
          {profile ? (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/Patient/:patientId" element={<PatientPage />}>
                <Route path="edit" element={<EditTab />} />
                <Route path="delete" element={<DeleteTab />} />
                <Route path="encounter" element={<EncounterTab />} />
                <Route path="labs" element={<LabsTab />} />
                <Route path="meds" element={<MedsTab />} />
                <Route path="tasks" element={<TasksTab />} />
                <Route path="timeline" element={<TimelineTab />} />
                <Route path="health-record/*" element={<HealthRecord />}>
                  <Route index element={<Navigate replace to="health-record/lab-results" />} />
                  <Route path="lab-results/*" element={<LabResults />} />
                  <Route path="lab-results/:resultId" element={<LabResult />} />
                  <Route path="medications" element={<Medications />} />
                  <Route path="medications/:medicationId" element={<Medication />} />
                  <Route path="vaccines" element={<Vaccines />} />
                  <Route path="vaccines/:vaccineId" element={<Vaccine />} />
                  <Route path="vitals" element={<Vitals />} />
                  <Route path="vitals/:measurementId" element={<Measurement />} />
                </Route>
                <Route path=":resourceType/new" element={<CreateResourcePage />} />
                <Route path=":resourceType/:id" element={<ResourcePage />} />
                <Route path=":reourceType/report" element={<ReportPage />} />
                <Route path=":resourceType/:id/edit" element={<EditPage />} />
                <Route path=":resourceType/:id/delete" element={<DeletePage />} />
                <Route path=":reourceType/:id/timeline" element={<TimelinePage />} />
                <Route path=":resourceType" element={<PatientSearchPage />} />
                <Route path="" element={<TimelineTab />} />
              </Route>
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/batch" element={<BatchPage />} />
              <Route path="/:resourceType/new" element={<CreateResourcePage />} />
              <Route path="/:resourceType/:id" element={<ResourcePage />} />
              <Route path=":resourceType/:id/edit" element={<EditPage />} />
              <Route path=":resourceType/:id/delete" element={<DeletePage />} />
              <Route path=":reourceType/:id/timeline" element={<TimelinePage />} />
              <Route path="/:resourceType/:id/_history/:versionId" element={<ResourcePage />} />
              <Route path="/:resourceType" element={<SearchPage />} />
            </>
          ) : (
            <>
              <Route path="/signin" element={<SignInPage />} />
              <Route path="*" element={<Navigate to="/signin" replace />} />
            </>
          )}
        </Routes>
      </Suspense>
    </AppShell>
  );
}
