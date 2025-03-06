import { Title, Text, ActionIcon, Group } from '@mantine/core';
import { getDisplayString, getReferenceString } from '@medplum/core';
import { Resource } from '@medplum/fhirtypes';
import {
  AttachmentDisplay,
  Container,
  Document,
  Panel,
  ResourcePropertyDisplay,
  ResourceTable,
} from '@medplum/react';
import { IconEdit } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import styles from './ResourceViewer.module.css';
import { usePatient } from '../../hooks/usePatient';

interface ResourceViewerProps {
  resource: Resource;
}

export function ResourceViewer({ resource }: ResourceViewerProps): JSX.Element {
  const navigate = useNavigate();
  const patient = usePatient();

  const handleEdit = () => {
    navigate(`/Patient/${patient?.id}/${resource.resourceType}/${resource.id}/edit`);
  };

  if (resource.resourceType === 'DocumentReference') {
    const category = resource.category?.[0]?.coding?.[0]?.display || 'Uncategorized';
    const type = resource.type?.coding?.[0]?.display || 'Unknown Type';

    return (
      <Container size={"100%"}>
        <Panel key={`${getReferenceString(resource)}`} className={styles.documentReferenceViewer}>
          <Group justify="space-between" mb="md">
            <Title>{`${category} - ${type}`}</Title>
            <ActionIcon onClick={handleEdit} size="lg" variant="subtle">
              <IconEdit size="1.25rem" />
            </ActionIcon>
          </Group>
          {resource.content?.map((content, index) => (
          <div key={index}>
              <ResourcePropertyDisplay value={resource.date} propertyType={'dateTime'} />
            {content.attachment && <AttachmentDisplay value={content.attachment} />}
              <Text>{resource.description}</Text>
            </div>
          ))}
        </Panel>
      </Container>
    );
  }

  return (
    <Document key={getReferenceString(resource)}>
      <Group justify="space-between" mb="md">
        <Title>{getDisplayString(resource)}</Title>
        <ActionIcon onClick={handleEdit} size="lg" variant="subtle">
          <IconEdit size="1.25rem" />
        </ActionIcon>
      </Group>
      <ResourceTable key={`${resource.resourceType}/${resource.id}`} value={resource} />
    </Document>
  );
}