import clone from 'lodash.clone';
import { COMPONENT_MAP } from '../components/userComponents';

function insertComponents(tree) {
  const copy = clone(tree);
  for (const node of copy) {
    const Component = node?.props?.userSelected?.Component;
    if (Component in COMPONENT_MAP) {
      node.props.userSelected.Component = COMPONENT_MAP[Component].Component;
    }
  }
  return copy;
}

export default insertComponents;
