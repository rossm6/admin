const CSS = {
  userSelect: (value = 'none') => ({
    webkitTouchCallout: value /* iOS Safari */,
    webkitUserSelect: value /* Safari */,
    khtmlUserSelect: value /* Konqueror HTML */,
    mozUserSelect: value /* Old versions of Firefox */,
    msUserSelect: value /* Internet Explorer/Edge */,
    userSelect: value /* Non-prefixed version, currently
                                    supported by Chrome, Edge, Opera and Firefox */,
  }),
};

export default CSS;
