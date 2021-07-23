import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { historyPush, withModulesManager, withHistory, withTooltip, formatMessage } from "@openimis/fe-core";
import NoticeSearcher from "../components/NoticeSearcher";

import { RIGHT_NOTICE_ADD } from "../constants";

const styles = theme => ({
    page: theme.page,
    fab: theme.fab
});

class NoticesPage extends Component {

    onDoubleClick = (i, newTab = false) => {
        historyPush(this.props.modulesManager, this.props.history, "webapp.route.notice", [i.id], newTab)
    }

    onAdd = () => {
        historyPush(this.props.modulesManager, this.props.history, "webapp.route.notice");
    }

    render() {
        const { intl, classes, rights } = this.props;
        return (
            <div className={classes.page}>
                <NoticeSearcher
                    cacheFiltersKey="webappNoticePageFiltersCache"
                    onDoubleClick={this.onDoubleClick}
                />
                {rights.includes(RIGHT_NOTICE_ADD) &&
                    withTooltip(
                        <div className={classes.fab} >
                            <Fab color="primary" onClick={this.onAdd}>
                                <AddIcon />
                            </Fab>
                        </div>,
                        formatMessage(intl, "webapp", "addNewNoticeTooltip")
                    )
                }
            </div >
        )
    }
}

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
})

export default injectIntl(withModulesManager(withHistory(connect(mapStateToProps)(withTheme(withStyles(styles)(NoticesPage))))));