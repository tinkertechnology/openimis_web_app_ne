import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { withModulesManager, withHistory } from "@openimis/fe-core";
import PaymentSearcher from "../components/PaymentSearcher";


const styles = theme => ({
    page: theme.page,
    fab: theme.fab
});

class PaymentsPage extends Component {

    render() {
        const { intl, classes, rights } = this.props;
        return (
            <div className={classes.page}>
                <PaymentSearcher
                    cacheFiltersKey="webappPaymentsPageFiltersCache"
                    onDoubleClick={this.onDoubleClick}
                />
            </div >
        )
    }
}

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
})

export default injectIntl(withModulesManager(withHistory(connect(mapStateToProps)(withTheme(withStyles(styles)(PaymentsPage))))));