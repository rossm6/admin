import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import clone from 'lodash.clone';
import isNumber from 'lodash.isnumber';
import '../css/resizableTextarea.css';
import classNames from 'classnames';
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
  onChange: outerOnChange,
  fontSize = 12,
  maxWidth = 200,
  value: initialValue,
}) {
  /**
   * TODO -
   *
   * What about the first and last chars?
   *
   * Enable focus on the div - i.e. the white space outside any child spans -
   * to put focus on the last char.
   *
   * Enable highlighting the text for deleting or overwriting.  This will involve
   * mouse down and mouse over to track the range of spans which have been highlighted.
   * A click (what else?) destroys the highlight so will need to empty the tracked range.
   * A backspace means mass delete.
   */

  const [value, setValue] = useState(stringToCharObjs(initialValue));
  const [inputValue, setInputValue] = useState('');
  const [atBeginning, setAtBeginning] = useState(!initialValue?.length);

  const valueAsStr = charObjsToString(value);

  const previousValueAsStr = usePrevious(valueAsStr);

  useEffect(() => {
    if (!valueAsStr) {
      if (!atBeginning) {
        setAtBeginning(true);
      }
    } else if (atBeginning && previousValueAsStr !== valueAsStr) {
      setAtBeginning(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atBeginning, setAtBeginning, valueAsStr]);

  const insertAtBeginning = useCallback(
    (e) => {
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
    (charObj) => () => {
      const copy = clone(value);
      for (let i = 0; i < copy.length; i++) {
        if (copy[i].id === charObj.id) {
          copy[i].edit = true;
        } else {
          copy[i].edit = false;
        }
      }
      setValue(copy);
    },
    [setValue, value],
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
        // after we've focussed onto the element (although oddly only when we hit
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

  const editInputRef = useRef();

  useEffect(() => {
    if (editInputRef.current) {
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
      const copy = clone(value);
      for (let i = 0; i < copy.length; i++) {
        if (copy[i - 1]?.id === charObj.id) {
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

  const [movingCursor, setMovingCursor] = useState(false);

  const inputKeyDownHandler = useCallback(
    (charObj) => (e) => {
      if (e.keyCode === 37) {
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
        if (value[value.length - 1]?.id !== charObj.id) {
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

  return (
    <div
      style={{
        background: 'white',
        border: '1px black dotted',
        display: 'inline-block',
        fontSize,
        maxWidth,
        wordWrap: 'anywhere',
      }}
    >
      {atBeginning && (
        <span className={classNames('borderLeft', 'borderBlink')}>
          <input
            name="textarea_initial"
            onChange={insertAtBeginning}
            value=""
            style={{
              backgroundColor: 'transparent',
              fontSize,
              border: 0,
              outline: 0,
              width: '5px',
              caretColor: 'transparent',
            }}
            ref={editInputRef}
          />
        </span>
      )}
      {value.map((charObj) => (
        <span
          key={charObj.id}
          onClick={getCharacterClickHandler(charObj)}
          style={{
            position: charObj.edit ? 'relative' : null,
          }}
        >
          {charObj.edit ? (
            <>
              <span style={{ visibility: 'hidden' }}>{charObj.char}</span>
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
