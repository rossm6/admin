function getComponentTreeProps(path, index, parentLevel) {
  const newPath = [...path, [parentLevel + 1, index]];
  return {
    path: newPath,
    key: JSON.stringify(newPath),
  };
}

function ComponentTree({
  path = [], renderCount, tree, refs,
}) {
  const parentLevel = path.length ? path[path.length - 1][0] : -1;

  if (Array.isArray(tree)) {
    return tree.map((node, index) => (
      <ComponentTree
        {...getComponentTreeProps(path, index, parentLevel)}
        tree={node}
        refs={refs}
        renderCount={renderCount}
      />
    ));
  }

  let devmodeRef;

  for (let i = 0; i < refs.length; i++) {
    if (!refs[i].renderCount || refs[i].renderCount !== renderCount) {
      devmodeRef = refs[i];
      devmodeRef.renderCount = renderCount;
      break;
    }
  }

  if (tree?.props?.children?.length) {
    return (
      <tree.Component {...tree.props} devmodeRef={devmodeRef.ref}>
        <ComponentTree
          path={path}
          tree={tree.props.children}
          refs={refs}
          renderCount={renderCount}
        />
      </tree.Component>
    );
  }

  if (tree?.Component) {
    return <tree.Component {...tree.props} devmodeRef={devmodeRef.ref} renderCount={renderCount} />;
  }

  return tree; // e.g. text
}

export default ComponentTree;
