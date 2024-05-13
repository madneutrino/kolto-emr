import { Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { normalizeErrorString } from '@medplum/core';
import { ResourceType } from '@medplum/fhirtypes';
import { Document, useMedplum } from '@medplum/react';
import { useNavigate, useParams } from 'react-router-dom';

export function DeleteTab(): JSX.Element {
  const medplum = useMedplum();
  const { patientId } = useParams() as { patientId: string };
  const resourceType = 'Patient';
  const navigate = useNavigate();

  return (
    <Document>
      <p>Are you sure you want to delete this {resourceType}?</p>
      <Button
        color="red"
        onClick={() => {
          medplum
            .deleteResource(resourceType, patientId)
            .then(() => navigate(`/${resourceType}`))
            .catch((err) => showNotification({ color: 'red', message: normalizeErrorString(err), autoClose: false }));
        }}
      >
        Delete
      </Button>
    </Document>
  );
}
