import React from 'react';

const { width } = window.innerWidth; 
const {height} = window.innerHeight;
const pixelRatio = window.devicePixelRatio;

const deviceWidth = width;
const deviceHeight = height;

function adjust(size) {
  if (pixelRatio >= 2 && pixelRatio < 3) {
    if (deviceWidth < 360) {
      return size * 0.95;
    }
    if (deviceHeight < 667) {
      return size;
    }
    if (deviceHeight >= 667 && deviceHeight <= 735) {
      return size * 1.15;
    }
    return size * 1.25;
  }
  if (pixelRatio >= 3 && pixelRatio < 3.5) {
    if (deviceWidth <= 360) {
      return size;
    }
    if (deviceHeight < 667) {
      return size * 1.15;
    }
    if (deviceHeight >= 667 && deviceHeight <= 735) {
      return size * 1.2;
    }
    return size * 1.27;
  }
  if (pixelRatio >= 3.5) {
    if (deviceWidth <= 360) {
      return size;
    }
    if (deviceHeight < 667) {
      return size * 1.2;
    }
    if (deviceHeight >= 667 && deviceHeight <= 735) {
      return size * 1.25;
    }
    return size * 1.4;
  }
  return size;
}

export const Palette = {
  white: '#ffffff',
  black: '#000000',
  primaryColor: '#972168',
  secondaryColor: '#FFF7FC',
  primaryBackgroundColor: '#FDFDFD',
  borderColor: '#DCDDDE',
  textColor: '#58595B',
  placeholderColor: '#939598',
  errorColor: '#E81219',
  otpView: '#F4FFF4',
  fieldBackgroundColor: '#F6F6F6',
};

export const COLORS = {
  whiteColor: Palette.white,
  blackColor: Palette.black,
  primaryColor: Palette.primaryColor,
  secondaryColor: Palette.secondaryColor,
  primaryBackgroundColor: Palette.primaryBackgroundColor,
  borderColor: Palette.borderColor,
  textColor: Palette.textColor,
  placeholderColor: Palette.placeholderColor,
  errorColor: Palette.errorColor,
  otpViewColor: Palette.otpView,
  fieldBackgroundColor: Palette.fieldBackgroundColor,
};

export const SIZES = {
  base: 8,
  font: 14,
  radius: 40,
  padding: 10,
  padding2: 12,
  icon: 20,
  secondIcon: 15,
  icon_Color: '#273B4A',
  largeTitle: 19,
  h0: 10,
  t0: 13,
  P0: 12,
  f0: 9,
  P1: 18,
  c0: 15,
  h1: 28,
  h2: 20,
  h3: 18,
  h4: 16,
  h5: 13,
  body1: 28,
  body2: 20,
  body3: 14,
  body4: 12,
  body5: 10,
  body6: 7,
  t1: 9,
  t2: 12,
  e1: 6,
  width,
  height,
};

export const Fonts = {
  Bold: 'Poppins-Bold',
  Regular: 'Poppins-Regular',
  Medium: 'Poppins-Medium',
  SemiBold: 'Poppins-SemiBold',
  italic: 'Poppins-Italic',
  MediumItalic: 'Poppins-MediumItalic',
};

export const FONTS = {
  largeTitle: {
    fontFamily: Fonts.Medium,
    fontSize: adjust(SIZES.largeTitle),
  },
  h0: {
    fontFamily: Fonts.Medium,
    fontSize: adjust(SIZES.h0),
  },
  t0: {
    fontFamily: Fonts.Medium,
    fontSize: adjust(SIZES.t0),
  },
  P0: {
    fontFamily: Fonts.Medium,
    fontSize: adjust(SIZES.P0),
  },
  f0: {
    fontFamily: Fonts.Medium,
    fontSize: adjust(SIZES.f0),
  },
  P1: {
    fontFamily: Fonts.Medium,
    fontSize: adjust(SIZES.P1),
  },
  c0: {
    fontFamily: Fonts.Medium,
    fontSize: adjust(SIZES.c0),
  },
  i: {
    fontFamily: Fonts.italic,
    fontSize: adjust(SIZES.body5),
  },
  i0: {
    fontFamily: Fonts.MediumItalic,
    fontSize: adjust(SIZES.body5),
  },
  h1: {
    fontFamily: Fonts.Bold,
    fontSize: adjust(SIZES.h1),
  },
  h2: {
    fontFamily: Fonts.Regular,
    fontSize: adjust(SIZES.h2),
  },
  h3: {
    fontFamily: Fonts.Bold,
    fontSize: adjust(SIZES.h3),
  },
  h4: {
    fontFamily: Fonts.Medium,
    fontSize: adjust(SIZES.h4),
  },
  h5: {
    fontFamily: Fonts.Medium,
    fontSize: adjust(SIZES.h5),
  },
  h6: {
    fontFamily: Fonts.Bold,
    fontSize: adjust(SIZES.body5),
  },
  body1: {
    fontFamily: Fonts.Medium,
    fontSize: adjust(SIZES.body1),
  },
  body2: {
    fontFamily: Fonts.Medium,
    fontSize: adjust(SIZES.body2),
  },
  body3: {
    fontFamily: Fonts.Regular,
    fontSize: adjust(SIZES.body3),
  },
  body4: {
    fontFamily: Fonts.Regular,
    fontSize: adjust(SIZES.body4),
  },
  body5: {
    fontFamily: Fonts.Regular,
    fontSize: adjust(SIZES.body5),
  },
  body6: {
    fontFamily: Fonts.Regular,
    fontSize: adjust(SIZES.body6),
  },
  heading: {
    fontSize: adjust(SIZES.largeTitle),
    lineHeight: adjust(SIZES.largeTitle) * 1.4,
    fontFamily: Fonts.Medium,
    fontWeight: '700',
  },
  introDescription: {
    fontSize: adjust(SIZES.body2),
    lineHeight: adjust(SIZES.body2) * 1.45,
    fontFamily: Fonts.Regular,
  },
  paragraph: {
    fontSize: adjust(SIZES.body3),
    lineHeight: adjust(SIZES.body3) * 1.4,
    fontFamily: Fonts.Regular,
  },
  fieldTitle: {
    fontSize: adjust(SIZES.t2),
    lineHeight: adjust(SIZES.t2) * 1.4,
    fontFamily: Fonts.Medium,
  },
  descriptionMedium: {
    fontSize: adjust(SIZES.body4),
    lineHeight: adjust(SIZES.body4) * 1.4,
    fontFamily: Fonts.Medium,
  },
  helperText: {
    fontSize: adjust(SIZES.body6),
    lineHeight: adjust(SIZES.body6) * 1.4,
    fontFamily: Fonts.Medium,
  },
  title: {
    fontSize: adjust(SIZES.largeTitle),
    lineHeight: adjust(SIZES.largeTitle) * 1.6,
    fontFamily: Fonts.Medium,
  },
  headerTitle: {
    fontSize: adjust(SIZES.h1),
    lineHeight: adjust(SIZES.h1) * 1.4,
    fontFamily: Fonts.Medium,
  },
  modalTitle: {
    fontSize: adjust(SIZES.h2),
    lineHeight: adjust(SIZES.h2) * 1.4,
    fontFamily: Fonts.Medium,
  },
  homeTitle: {
    fontSize: adjust(SIZES.h3),
    lineHeight: adjust(SIZES.h3) * 1.4,
    fontFamily: Fonts.Medium,
  },
  buttonTitle: {
    fontSize: adjust(SIZES.h4),
    lineHeight: adjust(SIZES.h4) * 1.4,
    fontFamily: Fonts.Medium,
  },
  cardTitle: {
    fontSize: adjust(SIZES.body1),
    lineHeight: adjust(SIZES.body1) * 1.4,
    fontFamily: Fonts.Medium,
  },
  bodyMedium: {
    fontSize: adjust(SIZES.body2),
    lineHeight: adjust(SIZES.body2) * 1.5,
    fontFamily: Fonts.Medium,
  },
  otp: {
    fontSize: adjust(SIZES.largeTitle),
    lineHeight: adjust(SIZES.largeTitle) * 1.4,
    fontFamily: Fonts.Medium,
  },
  bodyRegular: {
    fontSize: adjust(SIZES.body3),
    lineHeight: adjust(SIZES.body3) * 1.4,
    fontFamily: Fonts.Regular,
  },
  largerTitle: {
    fontSize: adjust(SIZES.h0),
    lineHeight: adjust(SIZES.h0) * 1.4,
    fontFamily: Fonts.Medium,
    fontWeight: '500',
  },
  subTitle: {
    fontSize: adjust(SIZES.h5),
    lineHeight: adjust(SIZES.h5) * 1.4,
    fontFamily: Fonts.Regular,
  },
  dateLargeTitle: {
    fontSize: adjust(SIZES.h1),
    lineHeight: adjust(SIZES.h1) * 1.4,
    fontFamily: Fonts.Medium,
  },
  signupText: {
    fontSize: adjust(SIZES.P1),
    fontFamily: Fonts.Regular,
  },
  iconText: {
    fontSize: adjust(SIZES.body4),
    lineHeight: adjust(SIZES.body4) * 1.4,
    fontFamily: Fonts.Regular,
  },
};

// function isIphoneWithNotch() {
//   const dimen = { width, height };
//   return (
//     Platform.OS === 'ios' &&
//     !Platform.isPad &&
//     !Platform.isTV &&
//     (dimen.height === 780 ||
//       dimen.width === 780 ||
//       dimen.height === 812 ||
//       dimen.width === 812 ||
//       dimen.height === 844 ||
//       dimen.width === 844 ||
//       dimen.height === 896 ||
//       dimen.width === 896 ||
//       dimen.height === 926 ||
//       dimen.width === 926)
//   );
// }

const appTheme = { adjust, COLORS, SIZES, FONTS };

function App() {
  return (
    <div>
      <h1 style={{ color: appTheme.COLORS.primaryColor }}>Hello, React Web!</h1>
      {/* Add your React components and structure here */}
    </div>
  );
}

export default App;
