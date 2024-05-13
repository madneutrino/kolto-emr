import { Loader } from '@mantine/core';
import { PatientTimeline } from './PatientTimeline';
import { usePatient } from '../../hooks/usePatient';

export function TimelineTab(): JSX.Element {
  const patient = usePatient();
  if (!patient) {
    return <Loader />;
  }
  return <PatientTimeline patient={patient} />;
}
