import { ProfileResource, getReferenceString } from '@medplum/core';
import {
  AppShell,
  Loading,
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
  IconUser,
} from '@tabler/icons-react';
import { Suspense } from 'react';
import { AppRoutes } from './AppRoutes';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { RegisterPage } from './pages/RegisterPage';
import { SignInPage } from './pages/SignInPage';
import { Logo } from './components/Logo';
import { Footer } from './components/Footer';

export function App(): JSX.Element | null {
  const medplum = useMedplum();
  const profile = useMedplumProfile();
  const navigate = useMedplumNavigate();

  if (medplum.isLoading()) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <AppShell
        logo={<Logo size={32} />}
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
          {profile ? (
            <AppRoutes />
          ) : (
            <Routes>
              <Route path="/signin" element={<SignInPage />} />
              <Route path="*" element={<Navigate to="/signin" replace />} />
              <Route path="/resetpassword" element={<ResetPasswordPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          )}
        </Suspense>
      </AppShell>
      <Footer />
    </div>
  );
}
