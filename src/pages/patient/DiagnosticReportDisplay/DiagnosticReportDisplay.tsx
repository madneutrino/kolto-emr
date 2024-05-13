import { Group, List, Stack, Text, Title } from '@mantine/core';
import { capitalize, formatCodeableConcept, formatDateTime, formatObservationValue, isReference } from '@medplum/core';
import {
  Annotation,
  DiagnosticReport,
  Observation,
  ObservationComponent,
  ObservationReferenceRange,
  Reference,
  Specimen,
} from '@medplum/fhirtypes';

import cx from 'clsx';
import { useEffect, useState } from 'react';
import {
  CodeableConceptDisplay,
  MedplumLink,
  NoteDisplay,
  ObservationTable,
  RangeDisplay,
  ReferenceDisplay,
  ResourceBadge,
  StatusBadge,
  useMedplum,
  useResource,
} from '@medplum/react';
import classes from './DiagnosticReportDisplay.module.css';
import { DiagnosticReportSuggestions } from './DiagnosticReportSuggestions';

export interface DiagnosticReportDisplayProps {
  readonly value?: DiagnosticReport | Reference<DiagnosticReport>;
  readonly hideObservationNotes?: boolean;
  readonly hideSpecimenInfo?: boolean;
}

DiagnosticReportDisplay.defaultProps = {
  hideObservationNotes: false,
  hideSpecimenInfo: false,
} as DiagnosticReportDisplayProps;

export function DiagnosticReportDisplay(props: DiagnosticReportDisplayProps): JSX.Element | null {
  const medplum = useMedplum();
  const diagnosticReport = useResource(props.value);
  const [specimens, setSpecimens] = useState<Specimen[]>();

  useEffect(() => {
    if (diagnosticReport?.specimen) {
      Promise.allSettled(diagnosticReport.specimen.map((ref) => medplum.readReference(ref)))
        .then((outcomes) =>
          outcomes
            .filter((outcome) => outcome.status === 'fulfilled')
            .map((outcome) => (outcome as PromiseFulfilledResult<Specimen>).value)
        )
        .then(setSpecimens)
        .catch(console.error);
    }
  }, [medplum, diagnosticReport]);

  if (!diagnosticReport) {
    return null;
  }

  const specimenNotes: Annotation[] = specimens?.flatMap((spec) => spec.note || []) || [];

  if (diagnosticReport.presentedForm && diagnosticReport.presentedForm.length > 0) {
    const pf = diagnosticReport.presentedForm[0];
    if (pf.contentType?.startsWith('text/plain') && pf.data) {
      specimenNotes.push({ text: window.atob(pf.data) });
    }
  }

  return (
    <Stack>
      <Title>Diagnostic Report</Title>
      <DiagnosticReportHeader value={diagnosticReport} />
      {specimens && !props.hideSpecimenInfo && SpecimenInfo(specimens)}
      {diagnosticReport.result && (
        <ObservationTable hideObservationNotes={props.hideObservationNotes} value={diagnosticReport.result} />
      )}
      {specimenNotes.length > 0 && <NoteDisplay value={specimenNotes} />}
      <DiagnosticReportSuggestions />
    </Stack>
  );
}

interface DiagnosticReportHeaderProps {
  readonly value: DiagnosticReport;
}

function DiagnosticReportHeader({ value }: DiagnosticReportHeaderProps): JSX.Element {
  return (
    <Group mt="md" gap={30}>
      {value.subject && (
        <div>
          <Text size="xs" tt="uppercase" c="dimmed">
            Subject
          </Text>
          <ResourceBadge value={value.subject} link={true} />
        </div>
      )}
      {value.resultsInterpreter?.map((interpreter) => (
        <div key={interpreter.reference}>
          <Text size="xs" tt="uppercase" c="dimmed">
            Interpreter
          </Text>
          <ResourceBadge value={interpreter} link={true} />
        </div>
      ))}
      {value.performer?.map((performer) => (
        <div key={performer.reference}>
          <Text size="xs" tt="uppercase" c="dimmed">
            Performer
          </Text>
          <ResourceBadge value={performer} link={true} />
        </div>
      ))}
      {value.issued && (
        <div>
          <Text size="xs" tt="uppercase" c="dimmed">
            Issued
          </Text>
          <Text>{formatDateTime(value.issued)}</Text>
        </div>
      )}
      {value.status && (
        <div>
          <Text size="xs" tt="uppercase" c="dimmed">
            Status
          </Text>
          <Text>{capitalize(value.status)}</Text>
        </div>
      )}
    </Group>
  );
}

function SpecimenInfo(specimens: Specimen[] | undefined): JSX.Element {
  return (
    <Stack gap="xs">
      <Title order={2} size="h6">
        Specimens
      </Title>

      <List type="ordered">
        {specimens?.map((specimen) => (
          <List.Item ml="sm" key={`specimen-${specimen.id}`}>
            <Group gap={20}>
              <Group gap={5}>
                <Text fw={500}>Collected:</Text> {formatDateTime(specimen.collection?.collectedDateTime)}
              </Group>
              <Group gap={5}>
                <Text fw={500}>Received:</Text> {formatDateTime(specimen.receivedTime)}
              </Group>
            </Group>
          </List.Item>
        ))}
      </List>
    </Stack>
  );
}
