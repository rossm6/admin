import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import clone from 'lodash.clone';
import isNumber from 'lodash.isnumber';
import '../css/resizableTextarea.css';
import classNames from 'classnames';
import { isElement, isEqual } from 'lodash';
import usePrevious from '../hooks/usePrevious';

function charObjsToString(charObjs) {
  return charObjs.map((charObj) => charObj.char).join('');
}

function stringToCharObjs(val, baseIndex = 0) {
  return val.split('').map((char, index) => ({ id: baseIndex + index, char }));
}

function getNextId(ids) {
  if (!ids.length) return 1;
  return Math.max(...ids) + 1;
}

function createCharObj(val, charObjs) {
  const id = getNextId(charObjs.map((char) => char.id));
  return {
    char: val,
    id,
  };
}

function getNotBeginningInputClasses(atBeginning, movingCursor) {
  if (atBeginning) {
    return [null];
  }
  if (movingCursor) {
    return ['borderRight'];
  }
  return ['borderRight', 'borderBlink'];
}

function TextareaResizeableAuto({
  autoFocus,
  onBlur,
  color,
  fontSize = 12,
  maxWidth = 200,
  onFocus,
  value: initialValue,
}) {
  /**
   * TODO -
   *
   * Up and down arrow support for navigating across multiple rows.
   *
   * Enable highlighting the text for deleting or overwriting.  This will involve
   * mouse down and mouse over to track the range of spans which have been highlighted.
   * A click (what else?) destroys the highlight so will need to empty the tracked range.
   * A backspace means mass delete.
   */

  const focus = !!autoFocus;

  const [value, setValue] = useState(stringToCharObjs(initialValue));
  const [atBeginning, setAtBeginning] = useState(!initialValue?.length);
  const [focused, setFocused] = useState(focus);
  const [movingCursor, setMovingCursor] = useState(false);
  const editInputRef = useRef();

  const previousValue = usePrevious(value);
  const valueAsStr = charObjsToString(value);
  const previousValueAsStr = usePrevious(valueAsStr);

  const previousFocusProp = usePrevious(focus);
  const previousFocused = usePrevious(focused);
  const internalOnBlurFired = useRef(false);
  const isEditable = value.find((val) => val.edit);

  const focusedFromInside = useCallback(() => {
    if (!focused) {
      setFocused(true);
    }
    if (onFocus) {
      onFocus();
    }
  }, [focused, setFocused, onFocus]);

  useEffect(() => {
    /**
     * We cannot just declare the React Component to be in a unfocused state
     * because onBlur has been triggered, because onBlur is triggered when
     * moving from one char to another.  So we none are in edit mode.
     */
    if (!isEditable) {
      if (internalOnBlurFired.current) {
        internalOnBlurFired.current = false;
        if (focused) {
          setFocused(false);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  useEffect(() => {
    if (previousFocusProp === focus && previousFocused === true && focused === false) {
      // focus was lost on either of the two elements
      if (onBlur) {
        onBlur(valueAsStr);
      }
    } else if (
      previousFocusProp !== undefined
      && previousFocusProp !== focus
      && focus !== focused
    ) {
      setFocused(focus);
      // autoFocus prop has changed
      // because this internal change has been caused from outside i.e. a prop changed
      // we do not call onFocus
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused, valueAsStr, onBlur, previousFocused, previousFocusProp, focus]);

  useEffect(() => {
    if (!valueAsStr) {
      if (!atBeginning) {
        setAtBeginning(true);
      }
    } else if (atBeginning && previousValueAsStr !== valueAsStr) {
      setAtBeginning(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atBeginning, focused, setAtBeginning, valueAsStr]);

  const insertAtBeginning = useCallback(
    (e) => {
      e.stopPropagation();
      const copy = clone(value);
      const id = getNextId(copy.map((v) => v.id));
      const newCharObj = stringToCharObjs(e.target.value, id);
      const newValue = [...newCharObj, ...copy];
      const nextCharObj = newValue[0];
      nextCharObj.edit = true;
      setValue(newValue);
    },
    [value, setValue],
  );

  const getCharacterClickHandler = useCallback(
    (charObj) => (e) => {
      e.stopPropagation();
      const copy = clone(value);
      for (let i = 0; i < copy.length; i++) {
        if (copy[i].id === charObj.id) {
          copy[i].edit = true;
        } else {
          copy[i].edit = false;
        }
      }
      focusedFromInside();
      setValue(copy);
    },
    [focusedFromInside, setValue, value],
  );

  const insertNewCharObjAfter = useCallback(
    (value, charObj, newCharObj, editID) => {
      const copy = clone(value);
      const charObjToInsert = newCharObj;
      const newValue = [];
      const edit = isNumber(editID);
      for (let i = 0; i < copy.length; i++) {
        newValue.push(copy[i]);
        if (edit) {
          if (editID === copy[i].id) {
            copy[i].edit = true;
          } else {
            copy[i].edit = false;
          }
        }
        if (copy[i].id === charObj.id) {
          newValue.push(charObjToInsert);
          if (edit) {
            if (editID === charObjToInsert.id) {
              charObjToInsert.edit = true;
            } else {
              charObjToInsert.edit = false;
            }
          }
        }
      }
      setValue(newValue);
    },
    [setValue],
  );

  const backspace = useCallback(
    (value, charObj) => {
      const newValue = [];
      for (let i = 0; i < value.length; i++) {
        if (value[i].id !== charObj.id) {
          const char = { ...value[i] };
          if (value[i + 1]?.id === charObj.id) {
            // this iteration is therefore previous to the charObj
            char.edit = true;
          }
          newValue.push(char);
        }
      }
      setValue(newValue);
    },
    [setValue],
  );

  const getEditCharHandler = useCallback(
    (charObj) => (e) => {
      if (e.target.value) {
        // char has been added

        // It seems that on firefox anyway the default cursor position is 0
        // after we've focused onto the element (although oddly only when we hit
        // left arrow key and not the right arrow key)

        // Anyway, on change, we only ever have two chars, or nothing
        // So if we have two chars, we check which is different to the first we had
        // before and this is considered the new

        const originalChar = charObj.char;
        const charPair = e.target.value.split('');
        const newChar = charPair.filter((char) => char !== originalChar)?.[0] || originalChar;

        const newCharObj = createCharObj(newChar, value);
        insertNewCharObjAfter(value, charObj, newCharObj, newCharObj.id);
      } else {
        // char has been deleted so we have none
        backspace(value, charObj);
      }
    },
    [backspace, insertNewCharObjAfter, value],
  );

  useEffect(() => {
    if (editInputRef.current && focused) {
      const input = editInputRef.current;
      input.focus();
    }
  });

  const removeEdit = useCallback(
    (charObj) => () => {
      const copy = clone(value);
      for (let i = 0; i < copy.length; i++) {
        if (charObj.id === copy[i].id) {
          copy[i].edit = false;
          break;
        }
      }
      setValue(copy);
      internalOnBlurFired.current = true;
    },
    [value, setValue],
  );

  const goBack = useCallback(
    (value, charObj) => {
      const copy = clone(value);
      for (let i = 0; i < copy.length; i++) {
        if (copy[i + 1]?.id === charObj.id) {
          copy[i].edit = true;
        } else {
          copy[i].edit = false;
        }
      }
      setValue(copy);
    },
    [setValue],
  );

  const goForward = useCallback(
    (value, charObj) => {
      // no charObj means we are going forward from the initial input
      // so we move to the first char in the value if there is one
      const copy = clone(value);
      for (let i = 0; i < copy.length; i++) {
        if (charObj) {
          if (copy[i - 1]?.id === charObj.id) {
            copy[i].edit = true;
          } else {
            copy[i].edit = false;
          }
        } else if (i === 0) {
          copy[i].edit = true;
        } else {
          copy[i].edit = false;
        }
      }
      setValue(copy);
    },
    [setValue],
  );

  const backToBeginning = useCallback(() => {
    const copy = clone(value);
    if (copy.length > 0) {
      // should always be greater than 1
      copy[0].edit = false;
      setValue(copy);
      setAtBeginning(true);
    }
  }, [value, setValue, setAtBeginning]);

  const inputClickHandler = useCallback(
    (charObj) => (e) => {
      e.stopPropagation();
      if (e.target.selectionStart === 0) {
        if (value[0]?.id !== charObj.id) {
          goBack(value, charObj);
        } else {
          backToBeginning();
        }
      }
    },
    [backToBeginning, goBack, value],
  );

  const inputKeyDownHandler = useCallback(
    (charObj) => (e) => {
      if (e.keyCode === 37 && charObj) {
        // left arrow key i.e. going backwards
        if (value[0]?.id !== charObj.id) {
          if (!movingCursor) {
            setMovingCursor(true);
          }
          goBack(value, charObj);
        } else {
          backToBeginning();
        }
      } else if (e.keyCode === 39) {
        // right arrow key i.e. going forwards
        if (!charObj) {
          if (value.length) {
            // we are currently at the initial input but do have other chars to move to
            if (!movingCursor) {
              setMovingCursor(true);
            }
            goForward(value);
          }
        } else if (value[value.length - 1]?.id !== charObj.id) {
          if (!movingCursor) {
            setMovingCursor(true);
          }
          goForward(value, charObj);
        }
      }
    },
    [backToBeginning, goBack, goForward, movingCursor, setMovingCursor, value],
  );

  useEffect(() => {
    const movingCursorStopped = () => {
      if (movingCursor) {
        setMovingCursor(false);
      }
    };
    document.addEventListener('keyup', movingCursorStopped);
    return () => {
      document.removeEventListener('keyup', movingCursorStopped);
    };
  }, [movingCursor, setMovingCursor]);

  const whiteSpaceClicked = useCallback(
    (e) => {
      e.stopPropagation();
      if (value.length) {
        const copy = clone(value);
        for (let i = 0; i < copy.length; i++) {
          copy[i].edit = false;
          if (i === copy.length - 1) {
            copy[i].edit = true;
          }
        }
        setAtBeginning(false);
        setValue(copy);
      } else {
        setAtBeginning(true);
      }
      focusedFromInside();
    },
    [focusedFromInside, value],
  );

  return (
    <div
      onClick={whiteSpaceClicked}
      style={{
        background: 'white',
        border: focused && '1px black dotted',
        display: 'inline-block',
        fontSize,
        maxWidth,
        wordWrap: 'anywhere',
      }}
    >
      {atBeginning && (
        <span
          className={classNames(focused && 'borderLeft', focused && 'borderBlink')}
          style={{
            position: 'relative',
            width: '5px',
            display: focused ? 'inline' : 'inline-block',
          }}
        >
          {focused && (
            <input
              name="textarea_initial"
              onChange={insertAtBeginning}
              onKeyDown={inputKeyDownHandler()}
              onBlur={() => {
                internalOnBlurFired.current = true;
                setAtBeginning(false);
              }}
              value=""
              style={{
                backgroundColor: 'transparent',
                fontSize,
                position: 'absolute',
                top: 0,
                left: 0,
                padding: 0,
                border: 0,
                outline: 0,
                width: '5px',
                caretColor: 'transparent',
                fontWeight: 'normal',
                color: 'transparent',
              }}
              ref={editInputRef}
            />
          )}
        </span>
      )}
      {value.map((charObj) => (
        <span
          key={charObj.id}
          onClick={getCharacterClickHandler(charObj)}
          style={{
            color,
            position: charObj.edit ? 'relative' : null,
            whiteSpace: 'break-spaces',
          }}
        >
          {charObj.edit ? (
            <>
              <span style={{ color, whiteSpace: 'break-spaces' }}>{charObj.char}</span>
              <span
                className={classNames(...getNotBeginningInputClasses(atBeginning, movingCursor))}
              >
                <input
                  name="textarea_subsequent"
                  onChange={getEditCharHandler(charObj)}
                  onClick={inputClickHandler(charObj)}
                  onBlur={removeEdit(charObj)}
                  onKeyDown={inputKeyDownHandler(charObj)}
                  value={charObj.char}
                  style={{
                    backgroundColor: 'transparent',
                    border: 0,
                    fontSize,
                    outline: 0,
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    padding: 0,
                    caretColor: 'transparent',
                    color: 'transparent',
                  }}
                  ref={editInputRef}
                />
              </span>
            </>
          ) : (
            charObj.char
          )}
        </span>
      ))}
    </div>
  );
}

export default TextareaResizeableAuto;
