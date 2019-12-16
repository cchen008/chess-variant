import React, { Component } from 'react';
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

class SearchUsersTextField extends Component{

    render(){
        let options = this.props.options
        return (
            <div>
                <TextField
                    variant='outlined'
                    placeholder="Search for Users"
                    onChange={this.props.onChange}
                    style = {{width: this.props.width}}
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Popper
                    open={this.props.open}
                    anchorEl={this.props.anchorEl}
                    role={undefined}
                    style={{ width: this.props.width, marginTop: '10px' }}
                    transition
                    disablePortal
                    placement='bottom-end'
                >
                    {({ TransitionProps, }) => (
                        <Fade {...TransitionProps} timeout={350}>
                            <Paper>
                                <ClickAwayListener onClickAway={this.props.handleToggle}>
                                    <MenuList id="split-button-menu">
                                        {options.map((user, index) => (
                                            <MenuItem
                                                key={user.id}
                                                onClick={event => this.props.handleMenuItemClick(event, user)}
                                            >{user.username}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Fade>
                    )}
                </Popper>
            </div>
        )
    }
}

export default SearchUsersTextField