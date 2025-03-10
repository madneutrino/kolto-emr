import { Modal, Paper, Title, Text } from '@mantine/core';
import {
  DEFAULT_SEARCH_COUNT,
  formatSearchQuery,
  getDisplayString,
  getReferenceString,
  parseSearchRequest,
  SearchRequest,
} from '@medplum/core';
import { Patient, Resource } from '@medplum/fhirtypes';
import {
  AttachmentDisplay,
  Container,
  Document,
  Loading,
  Panel,
  ResourcePropertyDisplay,
  ResourceTable,
  SearchControl,
  useMedplum,
} from '@medplum/react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePatient } from '../../hooks/usePatient';
import { prependPatientPath } from './PatientPage.utils';
import { useDisclosure } from '@mantine/hooks';
import { ResourceViewer } from './ResourceViewer';
import styles from './PatientSearchPage.module.css';

export function PatientSearchPage(): JSX.Element {
  const medplum = useMedplum();
  const patient = usePatient();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState<SearchRequest>();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedResource, setSelectedResource] = useState<Resource>();

  useEffect(() => {
    if (!patient) {
      return;
    }

    const parsedSearch = parseSearchRequest(location.pathname + location.search);
    const populatedSearch = addSearchValues(patient, parsedSearch);

    if (
      location.pathname === `/Patient/${patient.id}/${populatedSearch.resourceType}` &&
      location.search === formatSearchQuery(populatedSearch)
    ) {
      setSearch(populatedSearch);
    } else {
      navigate(`/Patient/${patient.id}/${populatedSearch.resourceType}${formatSearchQuery(populatedSearch)}`);
    }
  }, [medplum, patient, navigate, location]);

  if (!patient || !search?.resourceType || !search.fields || search.fields.length === 0) {
    return <Loading />;
  }

  return (
    <>
      <Paper shadow="xs" m="md" p="xs">
        <SearchControl
          checkboxesEnabled={true}
          search={search}
          onClick={(e) => {
            setSelectedResource(e.resource);
            open();
          }}
          onAuxClick={(e) =>
            window.open(`/Patient/${patient.id}/${e.resource.resourceType}/${e.resource.id}`, '_blank')
          }
          onNew={() => {
            navigate(prependPatientPath(patient, `/${search.resourceType}/new`));
          }}
          onChange={(e) => {
            navigate(`/Patient/${patient.id}/${search.resourceType}${formatSearchQuery(e.definition)}`);
          }}
        />
      </Paper>
      <Modal
        opened={opened}
        onClose={close}
        size="100%"
        styles={{
          body: {
            maxWidth: '100%',
            height: '90vh',
          }
        }}
      >
          {selectedResource && <ResourceViewer resource={selectedResource} />}
      </Modal>
    </>
  );
}

function addSearchValues(patient: Patient, search: SearchRequest): SearchRequest {
  const resourceType = search.resourceType;
  const fields = search.fields ?? ['_id', '_lastUpdated'];
  const filters = search.filters ?? [];
  const sortRules = search.sortRules;
  const offset = search.offset ?? 0;
  const count = search.count ?? DEFAULT_SEARCH_COUNT;
  return {
    ...search,
    resourceType,
    fields,
    filters,
    sortRules,
    offset,
    count,
  };
}
