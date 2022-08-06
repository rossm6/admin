import { Box } from 'theme-ui';
import PropTypes from 'prop-types';
import propTypes from '../propTypes';

function Ui({ sx }) {
  return <Box sx={{ flex: 1, ...sx }}>ui</Box>;
}

export default Ui;

Ui.propTypes = {
  sx: PropTypes.shape({
    order: propTypes.flex.order,
  }),
};

Ui.defaultProps = {
  sx: undefined,
};
