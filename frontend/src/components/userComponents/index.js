import Box from './Box';
import Table from './Table';

const COMPONENT_MAP = {
  Box: {
    Component: Box,
    props: ['sx'],
  },
  Table: {
    Component: Table,
    props: ['backgroundColor'],
  },
};

export { Box, Table, COMPONENT_MAP };
