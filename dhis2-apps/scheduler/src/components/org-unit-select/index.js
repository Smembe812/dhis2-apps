import React, {Component} from 'react'

import { OrgUnitTree } from '@dhis2/d2-ui-org-unit-tree'
import Drawer from '@material-ui/core/Drawer'
import { withStyles } from '@material-ui/core/styles';
import { mergeChildren, incrementMemberCount, decrementMemberCount } from '@dhis2/d2-ui-org-unit-tree';

const drawerWidth = '20em';

const styles = theme => ({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      paddingTop: '3em'
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing.unit * 3,
    },
    toolbar: theme.mixins.toolbar,
  });

class OrgUnitSelect extends Component {
    constructor(props){
        super(props)
        this.state = {
            d2: props.d2
        }

        Promise.all([
            props.d2.models.organisationUnitLevels.list({
                paging: false,
                fields: 'id,lecel,displayName',
                order: 'level:asc',
            }),
            props.d2.models.organisationUnitGroups.list({
                paging: false,
                fields: 'id,displayName',
            }),
            props.d2.models.organisationUnits.list({
                paging: false,
                level: 1,
                fields: 'id,displayName,path,children::isNotEmpty,memberCount',
                memberCollection: 'dataSets',
                memberObject: 'TuL8IOPzpHh',
            }),
            props.d2.models.dataSets.get('TuL8IOPzpHh', {
                paging: false,
                fields: 'organisationUnits[id,path]',
            }),
        ])
        .then(([levels, groups, rootWithDataSetMembers, dataSetMembers]) => {
            const rootWithMembers = rootWithDataSetMembers.toArray()[0];
            const selected = dataSetMembers.organisationUnits.toArray().map(ou => ou.path);

            this.setState({
                levels,
                rootWithMembers,
                selected,
                groups
            })
        })

        this.handleOrgUnitClick = this.handleOrgUnitClick.bind(this);

        this.handleChildrenLoaded = this.handleChildrenLoaded.bind(this);
    }

    getChildContext() {
        return {
            d2: this.props.d2,
        };
    }

    handleOrgUnitClick(event, orgUnit) {
        if (this.state.selected.includes(orgUnit.path)) {
            this.state.selected.splice(this.state.selected.indexOf(orgUnit.path), 1);
            decrementMemberCount(this.state.rootWithMembers, orgUnit);
            this.setState({ selected: this.state.selected });
        } else {
            incrementMemberCount(this.state.rootWithMembers, orgUnit);
            this.setState({ selected: this.state.selected.concat(orgUnit.path) });
        }
    }

    handleChildrenLoaded(children) {
        this.setState(state => ({
            rootWithMembers: mergeChildren(state.rootWithMembers, children)
        }));
    }

    render(){
        console.log(this.state)

        const changeRoot = (currentRoot) => {
            this.setState({ currentRoot });
        };

        const state = this.state;
        if (!state.levels || !state.selected) {
            return null;
        }

        const {classes} = this.props;
        return (
            <>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    
                    <OrgUnitTree
                        root={this.state.rootWithMembers}
                        selected={this.state.selected}
                        currentRoot={this.state.currentRoot}
                        initiallyExpanded={[`/${this.state.rootWithMembers.id}`]}
                        onSelectClick={this.handleOrgUnitClick}
                        onChangeCurrentRoot={changeRoot}
                        memberCollection="dataSets"
                        memberObject="TuL8IOPzpHh"
                        onChildrenLoaded={this.handleChildrenLoaded}
                    />
                </Drawer>
            </>
        )
    }
}

export default withStyles(styles)(OrgUnitSelect)