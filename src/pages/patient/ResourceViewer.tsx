import { Title, Text } from '@mantine/core';
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
import styles from './ResourceViewer.module.css';

interface ResourceViewerProps {
  resource: Resource;
}

export function ResourceViewer({ resource }: ResourceViewerProps): JSX.Element {
  if (resource.resourceType === 'DocumentReference') {
    const category = resource.category?.[0]?.coding?.[0]?.display || 'Uncategorized';
    const type = resource.type?.coding?.[0]?.display || 'Unknown Type';

    return (
      <Container size={"100%"}>
        <Panel key={`${getReferenceString(resource)}`} className={styles.documentReferenceViewer}>
          <Title mb="md">{`${category} - ${type}`}</Title>
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
      <Title>{getDisplayString(resource)}</Title>
        <ResourceTable key={`${resource.resourceType}/${resource.id}`} value={resource} />
    </Document>
  );
}