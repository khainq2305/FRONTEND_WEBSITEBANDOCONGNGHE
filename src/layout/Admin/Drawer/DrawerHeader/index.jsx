import PropTypes from 'prop-types';

// project imports
import DrawerHeaderStyled from './DrawerHeaderStyled';
import logo from '../../../../assets/Client/images/Logo/logo2.png'; 

export default function DrawerHeader({ open }) {
  return (
    <DrawerHeaderStyled
      open={open}
      sx={{
        minHeight: '60px',
        width: 'initial',
        paddingTop: '8px',
        paddingBottom: '8px',
        paddingLeft: open ? '24px' : 0
      }}
    >
      <img
        src={logo}
        alt="Cyberzone Admin Logo"
        style={{
          width: open ? 'auto' : 145,
          height: 75,
          objectFit: 'cover'
        }}
      />
    </DrawerHeaderStyled>
  );
}

DrawerHeader.propTypes = {
  open: PropTypes.bool
};
