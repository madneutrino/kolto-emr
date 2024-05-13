import { Anchor, Button, Card, Group, List, ListItem, Stack, Text, Title } from '@mantine/core';
import { ResourceArray, getReferenceString } from '@medplum/core';
import { DiagnosticReport, Patient, Reference, ServiceRequest } from '@medplum/fhirtypes';

import { CodeableConceptDisplay, ResourceTable, useMedplum, useResource } from '@medplum/react';
import { usePatient } from '../../../hooks/usePatient';

export interface DiagnosticReportSuggestionsProps {
  readonly value?: DiagnosticReport | Reference<DiagnosticReport>;
}

export function DiagnosticReportSuggestions(props: DiagnosticReportSuggestionsProps): JSX.Element | null {
  const medplum = useMedplum();
  const diagnosticReport = useResource(props.value);

  const patient = usePatient() as Patient;
  const serviceRequests: ResourceArray<ServiceRequest> = medplum
    .searchResources('ServiceRequest', 'patient=' + getReferenceString(patient))
    .read();

  return (
    <Group>
      <Stack>
        <Title>Guideline-Based Recommendations</Title>

        {serviceRequests
          .filter((request) => request.instantiatesUri?.[0] === 'https://example.com/guidelines')
          .map((r) => (
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text size="lg" fw="500">
                <CodeableConceptDisplay value={r.code} />
                {/* <CodeableConceptDisplay value={r.category?.[0]} /> */}
              </Text>
              <Text>
                <CodeableConceptDisplay value={r.orderDetail?.[0]} />
              </Text>
              <List>
                {r.instantiatesUri?.slice(1).map((link) => (
                  <ListItem>
                    <Anchor href={link} target="_blank">
                      {link}
                    </Anchor>
                  </ListItem>
                ))}
              </List>
              <Button color="blue" mt="md" radius="md">
                Accept
              </Button>
            </Card>
          ))}
      </Stack>
      <Stack>
        <Title>Research-Based Recommendations</Title>

        {serviceRequests
          .filter((request) => request.instantiatesUri?.[0] === 'https://example.com/research')
          .map((r) => (
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text size="lg" fw="500">
                <CodeableConceptDisplay value={r.code} />
                {/* <CodeableConceptDisplay value={r.category?.[0]} /> */}
              </Text>
              <Text>
                <CodeableConceptDisplay value={r.orderDetail?.[0]} />
              </Text>
              <List>
                {r.instantiatesUri?.slice(1).map((link) => (
                  <ListItem>
                    <Anchor href={link} target="_blank">
                      {link}
                    </Anchor>
                  </ListItem>
                ))}
              </List>

              <Button color="blue" mt="md" radius="md">
                Accept
              </Button>
            </Card>
          ))}
      </Stack>
    </Group>
  );
}
