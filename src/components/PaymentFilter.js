import React, { Component } from "react";
import _debounce from "lodash/debounce";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import { Grid } from "@material-ui/core";
import {
    withModulesManager,
    Contributions, ControlledField, TextInput
} from "@openimis/fe-core";

const styles = theme => ({
    dialogTitle: theme.dialog.title,
    dialogContent: theme.dialog.content,
    form: {
        padding: 0
    },
    item: {
        padding: theme.spacing(1)
    },
    paperDivider: theme.paper.divider,
});

const PAYMENT_FILTER_CONTRIBUTION_KEY = "payment.Filter";

class PaymentFilter extends Component {

    state = {
        showHistory: false,
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            prevProps.filters['showHistory'] !== this.props.filters['showHistory'] &&
            !!this.props.filters['showHistory'] &&
            this.state.showHistory !== this.props.filters['showHistory']['value']
        ) {
            this.setState((state, props) => ({ showHistory: props.filters['showHistory']['value'] }))
        }
    }

    debouncedOnChangeFilter = _debounce(
        this.props.onChangeFilters,
        this.props.modulesManager.getConf("fe-webapp", "debounceTime", 800)
    )

    _filterValue = k => {
        const { filters } = this.props;
        // console.log(this.props);
        return !!filters && !!filters[k] ? filters[k].value : null
    }

    _onChangeShowHistory = () => {
        let filters = [
            {
                id: 'showHistory',
                value: !this.state.showHistory,
                filter: `showHistory: ${!this.state.showHistory}`
            }
        ];
        this.props.onChangeFilters(filters);
        this.setState((state) => ({
            showHistory: !state.showHistory
        }));
    }

    render() {
        const { intl, classes, filters, onChangeFilters } = this.props;
        return (
            <Grid container className={classes.form}>
                <ControlledField module="webapp" id="paymentFilter.chfid" field={
                    <Grid item xs={3} className={classes.item}>
                        <TextInput
                            module="webapp" label="paymentForm.chfid"
                            name="chfid"
                            value={this._filterValue('chfid')}
                            onChange={v => this.debouncedOnChangeFilter([
                                {
                                    id: 'chfid',
                                    value: v,
                                    filter: `chfid_Icontains: "${v}"`
                                }
                            ])}
                        />
                    </Grid>
                } />

                <ControlledField module="webapp" id="paymentFilter.name" field={
                    <Grid item xs={3} className={classes.item}>
                        <TextInput
                            module="webapp" label="paymentForm.name"
                            name="name"
                            value={this._filterValue('name')}
                            onChange={v => this.debouncedOnChangeFilter([
                                {
                                    id: 'name',
                                    value: v,
                                    filter: `name_Icontains: "${v}"`
                                }
                            ])}
                        />
                    </Grid>
                } />
                <Contributions filters={filters} onChangeFilters={onChangeFilters} contributionKey={PAYMENT_FILTER_CONTRIBUTION_KEY} />
            </Grid>
        )
    }
}

export default withModulesManager(injectIntl((withTheme(withStyles(styles)(PaymentFilter)))));