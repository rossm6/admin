import { Box as BaseBox } from 'theme-ui';

function Box(props) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <BaseBox {...props} />;
}

Box.displayName = 'Box';

export default Box;
