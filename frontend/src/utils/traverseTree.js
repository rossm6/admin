function* traverseTree(tree) {
  if (Array.isArray(tree)) {
    for (let i = 0; i < tree.length; i++) {
      yield* traverseTree(tree[i]);
    }
  } else if (Array.isArray(tree?.props?.children)) {
    yield tree;
    yield* traverseTree(tree.props.children);
  } else {
    yield tree;
  }
}

export default traverseTree;
