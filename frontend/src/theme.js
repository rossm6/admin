const commonButtonProps = {
  '&:disabled': {
    opacity: 0.5,
  },
};

const theme = {
  breakpoints: ['900px'],
  fonts: {
    body: 'system-ui, sans-serif',
    heading: '"Avenir Next", sans-serif',
    monospace: 'Menlo, monospace',
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64],
  alerts: {
    todo: {
      borderRadius: 0,
      justifyContent: 'center',
    },
  },
  forms: {
    bootstrap: {
      borderColor: '#ced4da',
      fontSize: 'inherit',
      bg: 'white',
      '&:focus': {
        boxShadow: '0 0 0 .25rem rgba(13,110,253,.25)',
        borderColor: '#86b7fe',
        transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out',
        outline: 0,
      },
    },
    todo: {
      borderColor: '#ced4da',
      fontSize: 'inherit',
      '&:focus': {
        boxShadow: '0 0 0 .25rem rgba(13,110,253,.25)',
        borderColor: '#86b7fe',
        transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out',
        outline: 0,
      },
    },
    todoLabel: {
      mb: 2,
    },
    queryBuilder: {
      bg: 'white',
      fontSize: 12,
    },
  },
  cards: {
    dropdown: {
      py: 4,
      borderRadius: 10,
      boxShadow: '0 0 8px rgba(0, 0, 0, 0.125)',
      cursor: 'pointer',
      fontWeight: 'normal',
    },
    compact: {
      padding: 1,
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'muted',
    },
    primary: {
      padding: 4,
      borderRadius: 30,
      boxShadow: '0 0 8px rgba(0, 0, 0, 0.125)',
      cursor: 'pointer',
    },
    todo: {
      padding: 4,
      borderRadius: 5,
      boxShadow: '0 0 8px rgba(0, 0, 0, 0.125)',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
    },
  },
  colors: {
    text: '#000',
    background: '#fff',
    primary: '#0b5ed7',
    danger: '#dc3545',
    success: '#198754',
    haze: 'rgb(237, 238, 240)',
    slate: 'rgb(112, 128, 144)',
    hazeHover: 'rgb(182, 183, 185)',
  },
  space: [0, 5, 10, 15, 20, 30, 40],
  buttons: {
    icon: {
      '&:hover': {
        background: 'haze',
      },
      cursor: 'pointer',
      p: 1,
      background: 'white',
      color: 'black',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 40,
      height: 40,
      borderRadius: '50%',
      // ...commonButtonProps,
      // color: "haze",
      // background: "white",
      // borderColor: "haze",
      // borderStyle: "solid",
      // borderWidth: 1,
      // "&:focus": {
      //   outlineColor: "transparent",
      // },
      // "&:focus-visible": {
      //   outline: 0,
      // },
      // cursor: "pointer",
      // p: 1,
      // borderRadius: "50%",
    },
    link: {
      ...commonButtonProps,
      color: 'blue',
      background: 'white',
      borderColor: 'primary',
      borderStyle: 'solid',
      borderWidth: 1,
      '&:focus': {
        outlineColor: 'transparent',
        boxShadow: '0 0 0 .25rem rgba(49,132,253,.5)',
      },
      '&:focus-visible': {
        outline: 0,
      },
      cursor: 'pointer',
    },
    primary: {
      ...commonButtonProps,
      color: 'white',
      borderColor: 'primary',
      borderStyle: 'solid',
      borderWidth: 1,
      '&:focus': {
        outlineColor: 'transparent',
        boxShadow: '0 0 0 .25rem rgba(49,132,253,.5)',
      },
      '&:focus-visible': {
        outline: 0,
      },
      cursor: 'pointer',
    },
    info: {
      ...commonButtonProps,
      color: 'black',
      bg: '#3dd5f3',
      borderColor: '#0dcaf0',
      borderStyle: 'solid',
      borderWidth: 1,
      '&:focus': {
        outlineColor: 'transparent',
        boxShadow: '0 0 0 .25rem rgba(11,172,204,.5)',
      },
      '&:focus-visible': {
        outline: 0,
      },
      cursor: 'pointer',
    },
    success: {
      ...commonButtonProps,
      color: 'white',
      bg: 'success',
      borderColor: 'success',
      borderStyle: 'solid',
      borderWidth: 1,
      '&:focus': {
        outlineColor: 'transparent',
        boxShadow: '0 0 0 .25rem rgba(60,153,110,.5)',
      },
      '&:focus-visible': {
        outline: 0,
      },
      cursor: 'pointer',
    },
    danger: {
      ...commonButtonProps,
      color: 'white',
      borderColor: 'danger',
      borderStyle: 'solid',
      bg: 'danger',
      cursor: 'pointer',
      '&:focus': {
        outlineColor: 'transparent',
        boxShadow: '0 0 0 .25rem rgba(225,83,97,.5)',
      },
      '&:focus-visible': {
        outline: 0,
      },
    },
    'white-primary-hover': {
      ...commonButtonProps,
      color: 'primary',
      bg: 'white',
      '&:hover': {
        bg: 'aliceBlue',
      },
      '&:focus': {
        outlineColor: 'transparent',
      },
      '&:focus-visible': {
        outline: 0,
      },
      cursor: 'pointer',
      fontSize: 13,
      letterSpacing: 2,
      fontWeight: 700,
      p: 1,
    },
    queryBuilderAddRule: {
      p: 1,
      px: 2,
      fontSize: 12,
      cursor: 'pointer',
      bg: 'success',
    },
    queryBuilder: {
      p: 1,
      px: 2,
      fontSize: 12,
      cursor: 'pointer',
      bg: 'haze',
    },
    queryBuilderActive: {
      p: 1,
      px: 2,
      fontSize: 12,
      cursor: 'pointer',
      bg: 'blue',
    },
    queryBuilderAddGroup: {
      p: 1,
      px: 2,
      fontSize: 12,
      cursor: 'pointer',
      bg: 'purple',
    },
    tile: {
      color: 'black',
      p: 4,
      fontSize: 12,
      cursor: 'pointer',
      bg: 'haze',
      '&:hover': {
        bg: 'hazeHover',
      },
    },
  },
  styles: {
    root: {
      fontFamily: 'body',
      fontSize: 16,
      lineHeight: 'body',
      fontWeight: 'body',
    },
  },
};

/**
 * Re buttons -
 * According to this answer we should set outline-styled: transparent, https://stackoverflow.com/questions/52589391/css-box-shadow-vs-outline
 * The boxShadow is taken from bootstrap 5
 */

export default theme;
