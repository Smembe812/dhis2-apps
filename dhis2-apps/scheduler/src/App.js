import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import HeaderBar from '@dhis2/d2-ui-header-bar'
import { App as D2UIApp, mui3theme as dhis2theme } from '@dhis2/d2-ui-core'
import Sidebar from './components/ui/drawer';
import "storm-react-diagrams/dist/style.min.css" 
import './App.css'
import OrgUnitSelect from './components/org-unit-select';
import DataContainer from './components/data-container'

import {
	DiagramEngine,
	DiagramModel,
	DefaultNodeModel,
	DiagramWidget
} from "storm-react-diagrams";
import { link } from 'fs';

const styles = theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    paddingTop: '3em',
    marginLeft: '20em'
  },
  toolbar: theme.mixins.toolbar,
});

class App extends Component{
  constructor(props) {
      super(props);

      this.state = {
          d2: props.d2,
          programIndicator: {},
          dataElement: {},
          orgUnits: [],
          engine: new DiagramEngine(),
          model: new DiagramModel(),
          nodesAndEdges: []
      };

      this.state.engine.installDefaultFactories();

      this.handleDataElementSelection = this.handleDataElementSelection.bind(this)
      this.handleIndicatorSelection = this.handleIndicatorSelection.bind(this)
      this.handleOrgUnitSelect = this.handleOrgUnitSelect.bind(this)
      this.fireAnalytics = this.fireAnalytics.bind(this)
      this.getIndicatorDELink = this.getIndicatorDELink.bind(this)
  }

  getChildContext() {
    return { d2: this.state.d2 };
  }

  createPort(node, options){
      if (options === 'in'){
          return node.addInPort("In");
      }
      else if (options === 'out') {
          return node.addOutPort("Out");
      }
  }

  handleIndicatorSelection(indicator){
    const {displayName, id} = indicator
    this.setState({programIndicator: indicator})

    const node = this.createNode({
        name: displayName,
        color: 'rgb(0, 192, 255)',
        x: 100,
        y: 100
    },
    {
        name: displayName,
        id
    })

    this.createPort(node, 'out');

    this.state.nodesAndEdges.push(node)
    this.addNodeToModel(this.state.model, node)
    this.loadEngine()
  }

  handleDataElementSelection(dataElement){
    const {displayName, id} = dataElement
    this.setState({onSelectDataElement: {displayName}})

    const node = this.createNode({
          name: displayName,
          color: 'rgb(192, 255, 0)',
          x: 400,
          y: 100
      },
      {
        name: displayName,
        id
      })

      this.createPort(node, 'in');

      this.state.nodesAndEdges.push(node)
      this.addNodeToModel(this.state.model, node)
      this.loadEngine()
      
  }

  handleOrgUnitSelect(orgUnit){
    this.setState({orgUnits: [...this.state.orgUnits, orgUnit.id]}, () => this.fireAnalytics())
    
  }

  createNode(options, extras = null){
      const { name, color, x, y} = options
      const node = new DefaultNodeModel(name, color);

      if (extras !== null)
          Object.assign(node, {extras})

      node.setPosition(x, y)
      return node
  }

  addNodeToModel(model, node){
    console.log(node)
    this.state.model.addAll(node)
    console.log(this.state.model)

  }

  loadEngine(){
    this.state.engine.setDiagramModel(this.state.model)
  }


  createSecondNode(){
    const node2 = this.createNode({
      name: 'Node 2',
      color: 'rgb(192, 255, 0)',
      x: 400,
      y: 100
    })

  this.createPort(node2, 'in');
  this.state.model.addAll(node2);
  }

  fireAnalytics(){
    return this.getIndicatorDELink()
    const req = new this.state.d2.analytics.request()
    .addDataDimension([this.state.programIndicator.id])
    .addPeriodDimension('THIS_MONTH')
    .addOrgUnitDimension(this.state.orgUnits);

    this.state.d2.analytics.aggregate.fetch(req).then(data => console.log(data))
  }

  getIndicatorDELink(){
    const links = []
    Object.entries(this.state.model.links).forEach((link) => {
      const {sourcePort, targetPort} = link[1]
      const map = {}
      if (sourcePort !== undefined) { 
        const indicator = {
          programIndicator: sourcePort.parent.extras
        }
        Object.assign(map, indicator)
      }

      if (targetPort !== undefined){
        const dataElement = {
          dataElement: targetPort.parent.extras
        }
        Object.assign(map, dataElement)
      }

      links.push(map)
    })
    console.log(links)
  }

  render(){
    const {classes} = this.props
  
    if (!this.state.d2) {
        console.warn('d2 not loaded');
        return null;
    }
   
    
    return (
      <D2UIApp>
        <MuiThemeProvider theme={createMuiTheme(dhis2theme)}>
          <HeaderBar d2={this.props.d2}/>
            <Sidebar>
                <OrgUnitSelect 
                  d2={this.props.d2}
                  onSelectOrgUnit={this.handleOrgUnitSelect}/>
            </Sidebar>
            <main className={classes.content}>
              <div className={classes.toolbar}>
              <Card className={classes.card}>
                <CardContent>
                  <DiagramWidget className="srd-demo-canvas" diagramEngine={this.state.engine} />  
                 
                </CardContent>
              </Card>
              <DataContainer 
                d2={this.props.d2} 
                onIndicatorSelection={this.handleIndicatorSelection} 
                onDataElementSelection={this.handleDataElementSelection}/>
              
              </div>
            </main>
        </MuiThemeProvider>
        
      </D2UIApp>
    );
  }
}

App.childContextTypes = {
  d2: PropTypes.object,
};

App.propTypes = {
  d2: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
