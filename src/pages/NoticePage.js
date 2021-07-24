import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
    formatMessageWithValues, withModulesManager, withHistory, historyPush,
} from "@openimis/fe-core";
import NoticeForm from "../components/NoticeForm";
import { createNotice, updateNotice } from "../actions";
import { RIGHT_NOTICE_ADD, RIGHT_NOTICE_EDIT } from "../constants";

const styles = theme => ({
    page: theme.page,
});

class NoticePage extends Component {

    add = () => {
        historyPush(this.props.modulesManager, this.props.history, "webapp.route.notice")
    }

    save = (notice) => {
        if (!notice.id) {
            this.props.createNotice(
                this.props.modulesManager,
                notice,
                formatMessageWithValues(
                    this.props.intl,
                    "notice",
                    "CreateNotice.mutationLabel",
                    { label: !!notice.title ? notice.title : "" }
                )
            );
        } else {
            this.props.updateNotice(
                this.props.modulesManager,
                notice,
                formatMessageWithValues(
                    this.props.intl,
                    "notice",
                    "UpdateNotice.mutationLabel",
                    { label: !!notice.id ? notice.id : "" }
                )
            );

        }
    }

    // save = e => {
    //     if(!this.props.notice_id){
    //         this.props.createNotice(this.state.edited)
    //         return
    //     }

    //     this.props.updateNotice(this.state.edited, this.props.notice_id)

    //     console.log("SAVEED");
    // }

    setStateEdited =(e)=> {
        console.log('notice-page')
        console.log(this.props.notice_id);
        this.props.getNotice(this.props.notice_id);
    }

    render() {
        const { classes, modulesManager, history, rights, notice_id } = this.props;
        if (!rights.includes(RIGHT_NOTICE_EDIT)) return null;
        return (
            <div className={classes.page}>
                <NoticeForm
                    notice_id={notice_id !== '_NEW_' ? notice_id :  null}
                    back={e => historyPush(modulesManager, history, "webapp.route.notices")}
                    add={rights.includes(RIGHT_NOTICE_ADD) ? this.add : null}
                    save={rights.includes(RIGHT_NOTICE_EDIT) ? this.save : null}
                />
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    notice_id: props.match.params.notice_id,
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ createNotice, updateNotice }, dispatch);
};

export default withHistory(withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(withStyles(styles)(NoticePage))
    ))));