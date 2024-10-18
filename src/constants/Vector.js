
import React from 'react';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import BackIcon from '@material-ui/icons/ChevronLeft';
import DotIcon from '@material-ui/icons/FiberManualRecord';
import SearchCloseIcon from '@material-ui/icons/Cancel';
import SearchIcon from '@material-ui/icons/Search';
import ClockIcon from '@material-ui/icons/AccessTime';
import RadioOnIcon from '@material-ui/icons/RadioButtonChecked';
import RadioOffIcon from '@material-ui/icons/RadioButtonUnchecked';
import { COLORS } from './Theme';
import { dimen_size_width } from '../utils/helpers';

const CheckedIcon = (
  <CheckBoxIcon
    style={{ color: COLORS.primaryColor, fontSize: 20 }}
    fontSize="large"
  />
);

const UnCheckedIcon = (
  <CheckBoxIcon
    style={{ color: COLORS.primaryColor, fontSize: 20 }}
    fontSize="large"
  />
);

const Back = (
  <BackIcon style={{ color: COLORS.primaryColor, fontSize: 27 }} fontSize="large" />
);

const Right = (
  <BackIcon style={{ color: COLORS.primaryColor, fontSize: 18 }} fontSize="large" />
);
const RightBlack = (
  <BackIcon style={{ color: COLORS.textColor, fontSize: 17 }} fontSize="large" />
);

const CalenderRight = (
  <BackIcon style={{ color: COLORS.primaryColor, fontSize: 25, marginLeft: 10 }} fontSize="large" />
);

const Left = (
  <BackIcon style={{ color: COLORS.primaryColor, fontSize: 18 }} fontSize="large" />
);

const CalenderLeft = (
  <BackIcon style={{ color: COLORS.primaryColor, fontSize: 25, marginRight: 10 }} fontSize="large" />
);

const Down = (
  <BackIcon style={{ color: COLORS.primaryColor, fontSize: 20 }} fontSize="large" />
);
const DownSmall = (
  <BackIcon style={{ color: COLORS.primaryColor, fontSize: 17 }} fontSize="large" />
);

const UpSmall = (
  <BackIcon style={{ color: COLORS.primaryColor, fontSize: 17 }} fontSize="large" />
);

const DownBlack = (
  <BackIcon style={{ color: COLORS.textColor, fontSize: 13.5 }} fontSize="large" />
);


const Dot = <DotIcon style={{ color: COLORS.textColor, fontSize: 18 }} fontSize="large" />;

const Search = <SearchIcon style={{ color: COLORS.primaryColor, fontSize: dimen_size_width(6.5) }} fontSize="large" />;

const SearchClose = (
  <SearchCloseIcon
    style={{ color: COLORS.primaryColor, fontSize: 28 }}
    fontSize="large"
  />
);
const Clock = (
  <ClockIcon
    style={{ color: '#58595B', fontSize: 15 }}
    fontSize="large"
  />
);

const RadioOnicon = (
  <RadioOnIcon style={{ color: COLORS.primaryColor, fontSize: 19 }} fontSize="large" />
);

const RadioOfficon = (
  <RadioOffIcon style={{ color: COLORS.primaryColor, fontSize: 19 }} fontSize="large" />
);

export default {
  CheckedIcon,
  UnCheckedIcon,
  Back,
  Right,
  Left,
  Dot,
  Down,
  SearchClose,
  Search,
  RightBlack,
  DownBlack,
  CalenderRight,
  CalenderLeft,
  DownSmall,
  UpSmall,
  Clock,
  RadioOnicon,
  RadioOfficon,
};
