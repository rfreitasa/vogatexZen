/*eslint-disable*/
import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
// @material-ui/core components
import Person from '@material-ui/icons/Person';
import WebAssetIcon from '@material-ui/icons/WebAsset';
import BusinessIcon from '@material-ui/icons/Business';
import SettingsIcon from '@material-ui/icons/Settings';
import IconExpandLess from '@material-ui/icons/ExpandLess';
import IconExpandMore from '@material-ui/icons/ExpandMore';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import ArrowRight from '@material-ui/icons/ArrowRight';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import Collapse from '@material-ui/core/Collapse';
// core components
import AdminNavbarLinks from 'components/Navbars/AdminNavbarLinks.js';
import RTLNavbarLinks from 'components/Navbars/RTLNavbarLinks.js';

import styles from 'assets/jss/material-dashboard-react/components/sidebarStyle.js';
import { Container } from './styles.js';
const useStyles = makeStyles(styles);

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})(props => (
  <Menu
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function Sidebar(props) {
  const perfil = sessionStorage.getItem('perfil');

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleLoc = () => {
    setAnchorEl(null);
    localStorage.setItem('menu', false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const classes = useStyles();

  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return window.location.href.indexOf(routeName) > -1 ? true : false;
  }
  const { color, logo, image, logoText, routes } = props;
  const [open, setOpen] = React.useState(false);

  function handleClicksubmenu(data) {
    console.log(data.submenu);
    if (data.submenu != undefined) {
      console.log('entrou');
      setOpen(!open);
    }
  }

  var links = (
    <List className={classes.list}>
      {routes.map(prop => {
        var activePro = ' ';
        var whiteFontClasses = ' ';
        var listItemClasses;

        listItemClasses = classNames({
          [' ' + classes[color]]: activeRoute(prop.layout + prop.path),
        });

        whiteFontClasses = classNames({
          [' ' + classes.whiteFont]: activeRoute(prop.layout + prop.path),
        });

        return (
          <>
            {// MAPEANDO OS SUBMENUS E EXIBINDO-OS
            prop.submenu ? (
              <>
                {' '}
                <NavLink
                  to={prop.layout + prop.path}
                  className={activePro + classes.item}
                  activeClassName="active"
                  key={prop.key}
                >
                  <ListItem
                    button
                    onClick={() => {
                      handleClicksubmenu(prop);
                    }}
                    className={classes.itemLink + listItemClasses}
                  >
                    {typeof prop.icon === 'string' ? (
                      <Icon
                        className={classNames(
                          classes.itemIcon,
                          whiteFontClasses,
                          {
                            [classes.itemIconRTL]: props.rtlActive,
                          },
                        )}
                      >
                        {prop.icon}
                      </Icon>
                    ) : (
                      <prop.icon
                        className={classNames(
                          classes.itemIcon,
                          whiteFontClasses,
                          {
                            [classes.itemIconRTL]: props.rtlActive,
                          },
                        )}
                      />
                    )}
                    <ListItemText
                      primary={prop.name}
                      className={classNames(
                        classes.itemText,
                        whiteFontClasses,
                        {
                          [classes.itemTextRTL]: props.rtlActive,
                        },
                      )}
                      disableTypography={false}
                    />
                    {/* (prop.submenu)?        open ? <IconExpandLess /> : <IconExpandMore />:''*/}
                  </ListItem>
                </NavLink>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  {prop.submenu.map(prop2 => (
                    <>
                      <NavLink
                        to={prop2.layout + prop2.path}
                        className={activePro + classes.item}
                        activeClassName="active"
                        key={prop2.key}
                      >
                        <ListItem
                          button
                          onClick={handleClicksubmenu}
                          className={
                            classes.itemLink +
                            classNames({
                              [' ' + classes[color]]: activeRoute(
                                prop2.layout + prop2.path,
                              ),
                            })
                          }
                        >
                          {typeof prop2.icon === 'string' ? (
                            <Icon
                              className={classNames(
                                classes.itemIcon,
                                classNames({
                                  [' ' + classes.whiteFont]: activeRoute(
                                    prop2.layout + prop2.path,
                                  ),
                                }),
                                {
                                  [classes.itemIconRTL]: props.rtlActive,
                                },
                              )}
                            >
                              {prop2.icon}
                            </Icon>
                          ) : (
                            <prop2.icon
                              className={classNames(
                                classes.itemIcon,
                                classNames({
                                  [' ' + classes.whiteFont]: activeRoute(
                                    prop2.layout + prop2.path,
                                  ),
                                }),
                                {
                                  [classes.itemIconRTL]: props.rtlActive,
                                },
                              )}
                            />
                          )}
                          <ListItemText
                            onClick={() => localStorage.setItem('menu', false)}
                            primary={prop2.name}
                            key={prop2.key}
                            className={classNames(
                              classes.itemText,
                              classNames({
                                [' ' + classes.whiteFont]: activeRoute(
                                  prop2.layout + prop2.path,
                                ),
                              }),
                              {
                                [classes.itemTextRTL]: props.rtlActive,
                              },
                            )}
                            disableTypography={true}
                          />
                        </ListItem>
                      </NavLink>
                    </>
                  ))}
                </Collapse>
              </>
            ) : (
              <NavLink
                to={prop.layout + prop.path}
                className={activePro + classes.item}
                activeClassName="active"
                key={prop.key}
              >
                <ListItem
                  button
                  onClick={() => {
                    handleClicksubmenu(prop);
                  }}
                  className={classes.itemLink + listItemClasses}
                >
                  {typeof prop.icon === 'string' ? (
                    <Icon
                      className={classNames(
                        classes.itemIcon,
                        whiteFontClasses,
                        {
                          [classes.itemIconRTL]: props.rtlActive,
                        },
                      )}
                    >
                      {prop.icon}
                    </Icon>
                  ) : (
                    <prop.icon
                      className={classNames(
                        classes.itemIcon,
                        whiteFontClasses,
                        {
                          [classes.itemIconRTL]: props.rtlActive,
                        },
                      )}
                    />
                  )}
                  <ListItemText
                    onClick={() => localStorage.setItem('menu', false)}
                    primary={prop.name}
                    className={classNames(classes.itemText, whiteFontClasses, {
                      [classes.itemTextRTL]: props.rtlActive,
                    })}
                    disableTypography={false}
                  />
                  {/* (prop.submenu)?        open ? <IconExpandLess /> : <IconExpandMore />:''*/}
                </ListItem>
              </NavLink>
            )}
          </>
        );
      })}

      <Container>
        {(perfil === 'vendedor' || perfil === 'operador' || perfil === 'supervisor') ? (
          ''
        ) : (
          <Button
            aria-controls="customized-menu"
            aria-haspopup="true"
            variant="contained"
            color="secondary"
            onClick={handleClick}
          >
            <SettingsIcon />
            Configurações
          </Button>
        )}
        <StyledMenu
          id="customized-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <StyledMenuItem>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <NavLink onClick={() => handleLoc()} to={'/admin/usuarios'}>
                Usuários
              </NavLink>
            </ListItemText>
          </StyledMenuItem>
          <StyledMenuItem>
            <ListItemIcon>
              <WebAssetIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <NavLink onClick={() => handleLoc()} to={'/admin/organizacao'}>
                Organização
              </NavLink>
            </ListItemText>
          </StyledMenuItem>
          <StyledMenuItem>
            <ListItemIcon>
              <BusinessIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <NavLink onClick={() => handleLoc()} to={'/admin/empresa'}>
                Empresa
              </NavLink>
            </ListItemText>
          </StyledMenuItem>
          <StyledMenuItem>
            <ListItemIcon>
              <BusinessIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <NavLink onClick={() => handleLoc()} to={'/admin/galeria'}>
                Galeria de Imagens
              </NavLink>
            </ListItemText>
          </StyledMenuItem>

          {perfil !== 'admin_global' ? (
            ''
          ) : (
            <>
              <StyledMenuItem>
                <ListItemIcon>
                  <AttachMoneyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  <NavLink onClick={() => handleLoc()} to={'/admin/precos'}>
                    Lista de preços
                  </NavLink>
                </ListItemText>
              </StyledMenuItem>
              <StyledMenuItem>
                <ListItemIcon>
                  <BusinessCenterIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  <NavLink onClick={() => handleLoc()} to={'/admin/regras'}>
                    Regras de negócio
                  </NavLink>
                </ListItemText>
              </StyledMenuItem>
            </>
          )}
        </StyledMenu>
      </Container>
    </List>
  );

  //console.log(links);
  var brand = (
    <div className={classes.logo}>
      <div className={classes.logoImage}>
        <img
          src={logo}
          alt="logo"
          height="42"
          width="100"
          className={classes.img}
        />
      </div>
    </div>
  );

  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={props.rtlActive ? 'left' : 'right'}
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive,
            }),
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            {props.rtlActive ? <RTLNavbarLinks /> : <AdminNavbarLinks />}
            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: 'url(' + image + ')' }}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor={props.rtlActive ? 'right' : 'left'}
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive,
            }),
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>{links}</div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: 'url(' + image + ')' }}
            />
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
}

Sidebar.propTypes = {
  rtlActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  bgColor: PropTypes.oneOf(['purple', 'blue', 'green', 'orange', 'red']),
  logo: PropTypes.string,
  image: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
};
