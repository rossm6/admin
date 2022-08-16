import { useCallback, useEffect, useState } from 'react';

function TextareaResizeableAuto({
  onChange: outerOnChange, fontSize = 12, maxWidth = 200, value,
}) {
  /**
   * TODO -
   *
   * Each character in the value needs an associated id so we can
   * identify each for the enclosing span tag
   *
   * Enable editign the value at any point (not only at the end
   * which is the only edit we currently support)
   *
   * Enable focus on the div to enable focus on the input
   *
   * Enable highlighting the text for deleting or overwriting
   */

  const [inputValue, setInputValue] = useState('');

  const onChange = useCallback(
    (e) => {
      setInputValue(e.target.value);
    },
    [setInputValue],
  );

  useEffect(() => {
    if (inputValue) {
      outerOnChange(value + inputValue);
      setInputValue('');
    }
  }, [inputValue, outerOnChange, setInputValue, value]);

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
      {value.split('').map((char, index) => (
        <span key={index}>{char}</span>
      ))}
      <input
        name="textarea"
        onChange={onChange}
        value={inputValue}
        style={{
          backgroundColor: 'transparent',
          border: 0,
          fontSize,
          outline: 0,
          width: '10px',
        }}
      />
    </div>
  );
}

export default TextareaResizeableAuto;
