import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { getPathDisplayName, normalizeErrorString, normalizeOperationOutcome, tryGetDataType } from '@medplum/core';
import { DocumentReference, OperationOutcome, Resource, ResourceType } from '@medplum/fhirtypes';
import {
  Document,
  FormSection,
  ResourceForm,
  ResourcePropertyInput,
  setPropertyValue,
  useMedplum,
  useResource,
} from '@medplum/react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePatient } from '../hooks/usePatient';
import { prependPatientPath } from './patient/PatientPage.utils';

export function CreateDocumentReferencePage(): JSX.Element {
  const medplum = useMedplum();
  const patient = usePatient();
  const navigate = useNavigate();
  const { id } = useParams();
  const resourceType = 'DocumentReference';
  const [outcome, setOutcome] = useState<OperationOutcome | undefined>();

  const defaultResource = {
    resourceType,
    status: 'current',
    subject: {
      reference: `Patient/${patient?.id}`,
    },
  } as Partial<DocumentReference>;

  const existingResource = useResource<DocumentReference>(id ? { reference: `DocumentReference/${id}` } : undefined);
  const defaultValue = useResource<DocumentReference>(id ? undefined : defaultResource);
  const [value, setValue] = useState<DocumentReference>();

  const typeSchema = useMemo(() => tryGetDataType(resourceType), [resourceType]);

  useEffect(() => {
    if (id && existingResource) {
      setValue(existingResource);
    } else if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue, existingResource, id]);

  const handleSubmit = (newResource: Resource): void => {
    if (outcome) {
      setOutcome(undefined);
    }

    const promise = id
      ? medplum.updateResource(newResource)
      : medplum.createResource(newResource);

    promise
      .then((result) => navigate(prependPatientPath(patient, '/' + result.resourceType + '/' + result.id)))
      .catch((err) => {
        if (setOutcome) {
          setOutcome(normalizeOperationOutcome(err));
        }
        showNotification({
          color: 'red',
          message: normalizeErrorString(err),
          autoClose: false,
          styles: { description: { whiteSpace: 'pre-line' } },
        });
      });
  };

  if (!value) {
    return <div>Loading...</div>;
  }

  const displayElements =
    typeSchema?.elements &&
    Object.entries(typeSchema?.elements).filter(([key, element]) =>
      ['content', 'date', 'type', 'category', 'description'].includes(key)
    );

  return (
    <Document shadow="xs">
      <Stack>
        <Text fw={500}>{id ? 'Edit' : 'New'} Document</Text>
        <form
          noValidate
          autoComplete="off"
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            handleSubmit(value as DocumentReference);
          }}
        >
          <Stack mb="xl">
            {displayElements?.map(([key, element]) => (
              <FormSection
                key={key}
                title={getPathDisplayName(key)}
                description={element.description}
                withAsterisk={true}
                htmlFor={key}
                outcome={outcome}
                fhirPath={resourceType + '.' + key}
                readonly={true}
              >
                {element && (
                  <ResourcePropertyInput
                    key={key}
                    property={element}
                    name={key}
                    path={resourceType + '.' + key}
                    defaultValue={value[key as keyof DocumentReference]}
                    onChange={(newValue: any, propName?: string) => {
                      setValue(setPropertyValue({ ...value }, key, propName ?? key, element, newValue));
                    }}
                    outcome={outcome}
                  />
                )}
              </FormSection>
            ))}
          </Stack>
          <Group justify="flex-end" mt="xl" wrap="nowrap" gap={0}>
            <Button type="submit">{id ? 'Update' : 'Create'}</Button>
          </Group>
        </form>
        <hr />
        <hr />
        <center>---------Everything below is for troubleshooting-----</center>
        <hr />
        <hr />
        <ResourceForm
          defaultValue={(id && existingResource) ? existingResource : defaultResource}
          onSubmit={handleSubmit}
          outcome={outcome}
        />
      </Stack>
    </Document>
  );
}
