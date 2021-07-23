import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { historyPush, withModulesManager, withHistory, withTooltip, formatMessage } from "@openimis/fe-core";
import FeedbackSearcher from "../components/FeedbackSearcher";


const styles = theme => ({
    page: theme.page,
    fab: theme.fab
});

class FeedbackPage extends Component {

    // onDoubleClick = (i, newTab = false) => {
    //     historyPush(this.props.modulesManager, this.props.history, "webapp.route.notice", [i.id], newTab)
    // }

    // onAdd = () => {
    //     historyPush(this.props.modulesManager, this.props.history, "webapp.route.notice");
    // }

    render() {
        const { intl, classes, rights } = this.props;
        return (
            <div className={classes.page}>
                <FeedbackSearcher
                    cacheFiltersKey="webappFeedbackPageFiltersCache"
                    onDoubleClick={this.onDoubleClick}
                />
            </div >
        )
    }
}

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
})

export default injectIntl(withModulesManager(withHistory(connect(mapStateToProps)(withTheme(withStyles(styles)(FeedbackPage))))));