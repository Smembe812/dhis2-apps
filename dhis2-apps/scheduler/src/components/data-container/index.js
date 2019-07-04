import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import ProgramIndicators from '../program-indicators'

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    width: '25%'
  },
})

function SimpleTabs(props) {
  const {classes, d2} = props;
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  function onIndicatorSelection(e){
    props.onIndicatorSelection(e)
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Program Indicators" />
          <Tab label="Data elejments" />
        </Tabs>
      </AppBar>
      {value === 0 && <TabContainer><ProgramIndicators d2={d2} onIndicatorSelection={onIndicatorSelection}/></TabContainer>}
      {value === 1 && <TabContainer>Item Two</TabContainer>}
    </div>
  );
}

export default withStyles(styles)(SimpleTabs);
