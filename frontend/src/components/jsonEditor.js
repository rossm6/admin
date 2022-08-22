import {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import PropTypes, { element } from 'prop-types';
import isObject from 'lodash.isobject';
import clone from 'lodash.clone';
import { isEqual, isString } from 'lodash';
import get from 'lodash.get';
import { Box, Button, IconButton } from 'theme-ui';
import CaretRight from '../icons/caretRight.svg';
import PlusCircleFill from '../icons/plusCircleFill.svg';
import TextareaResizeableAuto from './resizableTextarea';

const KEY_COLOR = '#25aef1';
const VALUE_COLOR = '#f515b2';

function CollapseButton({ expandNode, path, tree }) {
  const sx = {
    cursor: 'pointer',
  };
  if (tree.expand) {
    sx.transform = 'rotate(90deg)';
  }
  return <CaretRight onClick={() => expandNode(path, !tree.expand)} style={sx} />;
}

function getNodeAtPath(treeData, path, childrenKey = 'value') {
  const point = path[0];
  if (path.length > 1) {
    return getNodeAtPath(treeData[point[1]][childrenKey], path.slice(1, undefined));
  }
  return treeData[point[1]];
}

function CollaspableNode({
  expandNode,
  path,
  tree,
  wholeTree,
  onChange,
  edit,
  parentCollapsableNodeIsExpanded,
  addPropToValue,
}) {
  let showButton = true;
  if (path.length > 1) {
    const node = getNodeAtPath(wholeTree, path.slice(-2, -1));
    if (!node.expand) {
      showButton = false;
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: tree.expand ? 'column' : 'row' }}>
      <Box sx={{ display: 'flex', whiteSpace: 'pre-wrap' }}>
        {showButton && <CollapseButton expandNode={expandNode} tree={tree} path={path} />}
        <JsonEditorField
          editable={tree.edit}
          onChange={onChange}
          path={path}
          value={tree.key}
          edit={edit}
          editKey="edit"
          valueKey="key"
          parentCollapsableNodeIsExpanded={parentCollapsableNodeIsExpanded}
          color={KEY_COLOR}
        />
        :
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: tree.expand ? 'column' : 'row',
          ml: tree.expand ? 4 : 0,
        }}
      >
        <JSONEditorComponent
          expandNode={expandNode}
          path={path}
          tree={tree.value}
          wholeTree={wholeTree}
          onChange={onChange}
          edit={edit}
          parentCollapsableNodeIsExpanded={parentCollapsableNodeIsExpanded && !!tree.expand}
          addPropToValue={addPropToValue}
          color={VALUE_COLOR}
        />
      </Box>
    </Box>
  );
}

function* traverseTree(tree) {
  if (Array.isArray(tree)) {
    for (let i = 0; i < tree.length; i++) {
      yield* traverseTree(tree[i]);
    }
  } else if (Array.isArray(tree?.value)) {
    yield tree;
    yield* traverseTree(tree.value);
  } else if (tree?.value !== undefined) {
    yield tree;
  } else {
    yield tree;
  }
}

function JsonEditorField({
  editable,
  onChange,
  path,
  value,
  edit,
  pathToProp,
  editKey,
  valueKey,
  parentCollapsableNodeIsExpanded,
  color,
}) {
  const onFocus = useCallback(() => {
    if (parentCollapsableNodeIsExpanded) {
      edit(path, pathToProp, editKey);
    }
  }, [edit, parentCollapsableNodeIsExpanded, path, pathToProp, editKey]);

  // onBlur must change the edit flag

  return (
    <div>
      <TextareaResizeableAuto
        color={color}
        autoFocus={!!editable}
        onBlur={(val) => onChange(path, val, pathToProp, valueKey, editKey)}
        onFocus={onFocus}
        value={value}
      />
    </div>
  );
}

function JSONEditorComponent({
  expandNode,
  path = [],
  tree,
  wholeTree,
  onChange,
  edit,
  parentCollapsableNodeIsExpanded = true,
  addPropToValue,
}) {
  const parentLevel = path.length ? path[path.length - 1][0] : -1;

  if (Array.isArray(tree)) {
    return (
      <>
        {tree.map((node, index) => (
          <JSONEditorComponent
            expandNode={expandNode}
            key={JSON.stringify([...path, [parentLevel + 1, index]])}
            path={[...path, [parentLevel + 1, index]]}
            tree={node}
            wholeTree={wholeTree}
            onChange={onChange}
            edit={edit}
            parentCollapsableNodeIsExpanded={parentCollapsableNodeIsExpanded}
            addPropToValue={addPropToValue}
          />
        ))}
        {parentCollapsableNodeIsExpanded && (
          <IconButton
            onClick={() => addPropToValue(path)}
            sx={{ color: 'blue', cursor: 'pointer' }}
            type="button"
          >
            <PlusCircleFill />
          </IconButton>
        )}
      </>
    );
  }

  if (Array.isArray(tree?.value)) {
    return (
      <CollaspableNode
        expandNode={expandNode}
        path={path}
        tree={tree}
        wholeTree={wholeTree}
        onChange={onChange}
        edit={edit}
        parentCollapsableNodeIsExpanded={parentCollapsableNodeIsExpanded}
        addPropToValue={addPropToValue}
      />
    );
  }

  if (!tree?.cssValue) {
    return (
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ display: 'flex', whiteSpace: 'pre-wrap' }}>
          <JsonEditorField
            editable={tree?.edit}
            value={tree.key}
            onChange={onChange}
            path={path}
            edit={edit}
            editKey="edit"
            valueKey="key"
            parentCollapsableNodeIsExpanded={parentCollapsableNodeIsExpanded}
            color={KEY_COLOR}
          />
          :
        </Box>
        <JsonEditorField
          editable={tree.value.edit}
          value={tree.value.value}
          onChange={onChange}
          edit={edit}
          path={path}
          pathToProp="value"
          editKey="edit"
          valueKey="value"
          parentCollapsableNodeIsExpanded={parentCollapsableNodeIsExpanded}
          color={VALUE_COLOR}
        />
        {parentCollapsableNodeIsExpanded && (
          <IconButton
            onClick={() => addPropToValue(path)}
            sx={{ color: 'blue', cursor: 'pointer' }}
            type="button"
          >
            <PlusCircleFill />
          </IconButton>
        )}
      </Box>
    );
  }

  return (
    <JsonEditorField
      editable={tree?.edit}
      onChange={onChange}
      path={path}
      value={tree?.value}
      edit={edit}
      editKey="edit"
      valueKey="value"
      parentCollapsableNodeIsExpanded={parentCollapsableNodeIsExpanded}
      color={VALUE_COLOR}
    />
  );
}

function removeAllInputs(tree) {
  const copy = clone(tree);
  for (const childNode of traverseTree(copy)) {
    if (childNode.edit) {
      childNode.edit = false;
    }
    if (isObject(childNode.value)) {
      if (childNode.value.edit) {
        childNode.value.edit = false;
      }
    }
  }
  return copy;
}

function JSONEditor({ treeData, setTreeData }) {
  useEffect(() => {
    const setAllFieldsToUneditable = () => {
      const editedTree = removeAllInputs(treeData);
      if (!isEqual(editedTree, treeData)) {
        setTreeData(editedTree);
      }
    };
    window.addEventListener('click', setAllFieldsToUneditable);
    return () => {
      window.removeEventListener('click', setAllFieldsToUneditable);
    };
  }, [setTreeData, treeData]);

  const expandNode = useCallback(
    (path, expand) => {
      const copy = clone(treeData);
      // traverse the tree
      const node = getNodeAtPath(copy, path);
      node.expand = expand;
      for (const childNode of traverseTree(node.value)) {
        if (childNode.expand) {
          childNode.expand = false;
        }
      }
      setTreeData(copy);
    },
    [treeData, setTreeData],
  );

  const onChange = useCallback(
    (path, value, pathToProp, key = 'value', editKey = 'edit') => {
      const copy = clone(treeData);
      let node = getNodeAtPath(copy, path);
      if (pathToProp) {
        node = get(node, pathToProp);
      }
      node[key] = value;
      node[editKey] = false;
      setTreeData(copy);
    },
    [treeData, setTreeData],
  );

  const edit = useCallback(
    (path, pathToProp, key = 'edit') => {
      const editedTree = removeAllInputs(treeData);
      let node = getNodeAtPath(editedTree, path);
      if (pathToProp) {
        node = get(node, pathToProp);
      }
      node[key] = true;
      setTreeData(editedTree);
    },
    [treeData, setTreeData],
  );

  const addPropToValue = useCallback(
    (path) => {
      if (path.length) {
        const copy = clone(treeData);
        const node = getNodeAtPath(copy, path);
        if (node?.value?.cssValue) {
          node.value = [
            node.value,
            {
              cssValue: true,
              value: '',
              edit: false,
            },
          ];
        } else if (Array.isArray(node.value)) {
          node.value = [
            ...node.value,
            {
              cssValue: true,
              value: '',
              edit: false,
            },
          ];
        }
        setTreeData(copy);
      } else {
        setTreeData([
          ...treeData,
          {
            key: '',
            value: {
              cssValue: true,
              value: '',
              edit: false,
            },
          },
        ]);
      }
    },
    [treeData, setTreeData],
  );

  return (
    <JSONEditorComponent
      edit={edit}
      expandNode={expandNode}
      onChange={onChange}
      tree={treeData}
      wholeTree={treeData}
      addPropToValue={addPropToValue}
    />
  );
}

export default JSONEditor;

export function toJSON(tree) {
  const jsonObj = {};
  for (const prop of tree) {
    jsonObj[prop.key] = Array.isArray(prop.value)
      ? prop.value.map((v) => v.value)
      : prop.value.value;
  }
  return jsonObj;
}
