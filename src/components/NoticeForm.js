import React, { Component, Fragment } from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { bindActionCreators } from "redux";
import AlertDialog from "./dialog";

import {
    formatMessageWithValues, withModulesManager, withHistory, historyPush, journalize,
    Form, ProgressOrError
} from "@openimis/fe-core";

import NoticeMasterPanel from "../components/NoticeMasterPanel";

import { createNotice, updateNotice, getNotice } from "../actions";

const styles = theme => ({
    page: theme.page,
});

const WEBAPP_NOTICE_FORM_CONTRIBUTION_KEY = "webapp.NoticeForm"

class NoticeForm extends Component {

    state = {
        lockNew: false,
        reset: 0,
        notice: this._newNotice(),
        newNotice: true,
    }

    _newNotice() {
        let notice = {};
        notice.jsonExt = {};
        return notice;
    }

    componentDidMount() {
        document.title = formatMessageWithValues(
            this.props.intl, "webapp", "webapp.notice.title", { label: "webapp.notice.title" }
        )
        if (!!this.props.notice_id) {
            this.setState(
                (state, props) => ({ notice_id: props.notice_id }),
                e => this.props.getNotice(
                    // this.props.modulesManager,
                    this.props.notice_id
                )
            )
        } 
    }

    back = e => {
        const { modulesManager, history, notice_id } = this.props;
        if (notice_id) {
            historyPush(modulesManager,
                history,
                "webapp.route.notice",
            );
        } else {
            historyPush(modulesManager,
                history,
                "webapp.route.notices"
            );
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.fetchedNotices !== this.props.fetchedNotices && !!this.props.fetchedNotices) {
            var notice = this.props.notice || {};
            notice.ext = !!notice.jsonExt ? JSON.parse(notice.jsonExt) : {};
            this.setState(
                { notice, notice_id: notice.id, lockNew: false, newNotice: false });
        } else if (prevProps.notice_id && !this.props.notice_id) {
            document.title = formatMessageWithValues(this.props.intl, "webapp", "noticeForm.title", { label: 'WebApp Notice'}) //insureeLabel(this.state.insuree) })
            this.setState({ notice: this._newNotice(), newNotice: true, lockNew: false, notice_id: null });
        } else if (prevProps.submittingMutation && !this.props.submittingMutation) {
            // this.props.journalize(this.props.mutation);
            this.setState({ reset: this.state.reset + 1 });
            // AlertDialog()
            window.location.reload();
        }
    }

    _add = () => {
        this.setState((state) => ({
            notice: this._newNotice(),
            newNotice: true,
            lockNew: false,
            reset: state.reset + 1,
        }),
            e => {
                this.props.add();
                this.forceUpdate();
            }
        )
    }

    reload = () => {
        this.props.fetchNotices(
            this.props.modulesManager,
            this.state.notice_id
        );
    }

    canSave = () => {
        if (!this.state.notice.title) return false;
        if (!this.state.notice.description) return false;
        return true;
    }

    _save = (notice) => {
        this.setState(
            { lockNew: ! notice.id }, // avoid duplicates
            e => this.props.save(notice))
    }

    onEditedChanged = notice => {
        this.setState({ notice, newNotice: false })
    }

    render() {
        const {
            notice_id, fetchingNotices, fetchedNotices, errorNotices, submittingMutation,
            add, save,
        } = this.props;
        const { notice } = this.state;

        return (
            <Fragment>
                <ProgressOrError progress={submittingMutation} error={errorNotices} />
                {((!!fetchedNotices && !!notice && notice.id === notice_id) || !notice_id) &&
                    (
                        <Form
                            module="webapp"
                            title="Notice" // noticeForm.title
                            titleParams={{ label: "NoticeTitle"}} // insureeLabel(this.state.insuree) }}
                            edited_id={notice_id}
                            edited={this.state.notice}
                            reset={this.state.reset}
                            back={this.back}
                            add={!!add && !this.state.newNotice ? this._add : null}
                            // readOnly={readOnly || !!insuree.validityTo}
                            // actions={actions}
                            // HeadPanel={FamilyDisplayPanel}
                            Panels={[NoticeMasterPanel]}
                            contributedPanelsKey={WEBAPP_NOTICE_FORM_CONTRIBUTION_KEY}
                            notice={this.state.notice}
                            onEditedChanged={this.onEditedChanged}
                            canSave={this.canSave}
                            save={!!save ? this._save : null}
                        />
                    )}
            </Fragment>
        )
    }
}

const mapStateToProps = (state, props) => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    fetchingNotices: state.webapp.fetchingNotices,
    errorNotices: state.webapp.errorNotices,
    fetchedNotices: state.webapp.fetchedNotices,
    notice: state.webapp.notice,
    submittingMutation: state.webapp.submittingMutation,
    mutation: state.webapp.mutation,
    
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({createNotice, updateNotice, getNotice}, dispatch);
}


export default withHistory(withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(
        withStyles(styles)(NoticeForm)
    ))))
);
// export default withHistory(withModulesManager(connect(mapStateToProps,mapDispatchToProps, { fetchNotices})(
//     injectIntl(withTheme(withStyles(styles)(NoticeForm))
//     ))));