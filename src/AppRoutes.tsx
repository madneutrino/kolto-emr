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
import { ProjectPage } from './admin/ProjectPage';
import { PatientsPage } from './admin/PatientsPage';
import { BotsPage } from './admin/BotsPage';
import { ClientsPage } from './admin/ClientsPage';
import { CreateBotPage } from './admin/CreateBotPage';
import { CreateClientPage } from './admin/CreateClientPage';
import { EditMembershipPage } from './admin/EditMembershipPage';
import { InvitePage } from './admin/InvitePage';
import { ProjectDetailsPage } from './admin/ProjectDetailsPage';
import { SecretsPage } from './admin/SecretsPage';
import { SitesPage } from './admin/SitesPage';
import { UsersPage } from './admin/UsersPage';
import { ProjectAdminConfigPage } from './admin/ProjectAdminConfigPage';
import { SuperAdminPage } from './admin/SuperAdminPage';
import { RegisterPage } from './pages/RegisterPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { SecurityPage } from './pages/SecurityPage';
import { SetPasswordPage } from './pages/SetPasswordPage';
import { ChangePasswordPage } from './pages/ChangePasswordPage';

export function AppRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/setpassword/:id/:secret" element={<SetPasswordPage />} />
      <Route path="/changepassword" element={<ChangePasswordPage />} />
      <Route path="/security" element={<SecurityPage />} />
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
      <Route path="/admin/super" element={<SuperAdminPage />} />
      <Route path="/admin/config" element={<ProjectAdminConfigPage />} />
      <Route path="/admin" element={<ProjectPage />}>
        <Route path="patients" element={<PatientsPage />} />
        <Route path="bots/new" element={<CreateBotPage />} />
        <Route path="bots" element={<BotsPage />} />
        <Route path="clients/new" element={<CreateClientPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="details" element={<ProjectDetailsPage />} />
        <Route path="invite" element={<InvitePage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="project" element={<ProjectDetailsPage />} />
        <Route path="secrets" element={<SecretsPage />} />
        <Route path="sites" element={<SitesPage />} />
        <Route path="members/:membershipId" element={<EditMembershipPage />} />
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
    </Routes>
  );
}
