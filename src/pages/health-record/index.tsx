import { Container, Group } from '@mantine/core';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Loading } from '../../components/Loading';
import { SideMenu } from '../../components/SideMenu';
import { measurementsMeta } from './Measurement.data';

const sideMenu = {
  title: 'Health Record',
  menu: [
    // { name: 'Lab Results', href: 'lab-results' },
    // { name: 'Medications', href: 'medications' },
    // { name: 'Vaccines', href: 'vaccines' },
    {
      name: 'Vitals',
      href: 'vitals',
      subMenu: Object.values(measurementsMeta).map(({ title, id }) => ({
        name: title,
        href: `vitals/${id}`,
      })),
    },
  ],
};

export function HealthRecord(): JSX.Element {
  return (
    <Container>
      <Group align="top">
        <SideMenu {...sideMenu} />
        <div style={{ width: 800, flex: 800 }}>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </div>
      </Group>
    </Container>
  );
}
