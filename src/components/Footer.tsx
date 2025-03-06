import { Text, Container } from '@mantine/core';
import packageInfo from '../../package.json';

export function Footer(): JSX.Element {
  return (
    <Container fluid py="md" style={{ borderTop: '1px solid #eee', marginTop: 'auto' }}>
      <Text size="sm" c="dimmed" ta="center">
        Elyx EMR v{packageInfo.version}
      </Text>
    </Container>
  );
}