import React, { Component, Fragment } from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { withTheme, withStyles } from "@material-ui/core/styles";

import {
    formatMessageWithValues, withModulesManager, withHistory,
    Form, ProgressOrError
} from "@openimis/fe-core";

import FeedbackMasterPanel from "../components/FeedbackMasterPanel";

import { fetchFeedbacks } from "../actions";

const styles = theme => ({
    page: theme.page,
});

const WEBAPP_FEEDBACK_FORM_CONTRIBUTION_KEY = "webapp.FeedbackForm"

class FeedbackForm extends Component {

    state = {
        lockNew: false,
        reset: 0,
        feedback: this._newFeedback(),
        newFeedback: true,
    }

    _newFeedback() {
        let feedback = {};
        feedback.jsonExt = {};
        return feedback;
    }

    componentDidMount() {
        document.title = formatMessageWithValues(this.props.intl, "webapp", "feedbackForm.title", { label: "FeedbackLabel" })
        if (!!this.props.feedback_id) {
            this.setState(
                (state, props) => ({ feedback_id: props.feedback_id }),
                e => this.props.fetchFeedbacks(
                    this.props.modulesManager,
                    this.props.feedback_id
                )
            )
        } 
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.fetchedFeedbacks !== this.props.fetchedFeedbacks && !!this.props.fetchedFeedbacks) {
            var feedback = this.props.feedback || {};
            feedback.ext = !!feedback.jsonExt ? JSON.parse(feedback.jsonExt) : {};
            this.setState(
                { feedback, feedback_id: feedback.id, lockNew: false, newFeedback: false });
        } else if (prevProps.feedback_id && !this.props.feedback_id) {
            document.title = formatMessageWithValues(this.props.intl, "webapp", "feedbackForm.title", { label: 'WebApp Feedback'}) //insureeLabel(this.state.insuree) })
            this.setState({ feedback: this._newFeedback(), newFeedback: true, lockNew: false, feedback_id: null });
        } else if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
            this.setState({ reset: this.state.reset + 1 });
        }
    }

    _add = () => {
        this.setState((state) => ({
            feedback: this._newFeedback(),
            newFeedback: true,
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
        this.props.fetchFeedbacks(
            this.props.modulesManager,
            this.state.id
        );
    }

    canSave = () => {
        if (!this.state.feedback.name) return false;
        if (!this.state.feedback.email) return false;
        return true;
    }

    _save = (notice) => {
        this.setState(
            { lockNew: !feedback.id }, // avoid duplicates
            e => this.props.save(feedback))
    }

    onEditedChanged = feedback => {
        this.setState({ feedback, newFeedback: false })
    }

    render() {
        const {
            id, fetchingFeedbacks, fetchedFeedbacks, errorFeedbacks,
            readOnly = false,
            add, save,
        } = this.props;
        const { feedback } = this.state;

        return (
            <Fragment>
                <ProgressOrError progress={fetchingFeedbacks} error={errorFeedbacks} />
                <Form
                    module="webapp"
                    title="FeedbackTitle" // title 
                    titleParams={{ label: 'WebApp Feedback'}} //insureeLabel(this.state.insuree) }}
                    edited_id={id}
                    edited={this.state.feedback}
                    reset={this.state.reset}
                    back={this.back}
                    add={!!add && !this.state.newFeedback ? this._add : null}
                    Panels={[FeedbackMasterPanel]}
                    contributedPanelsKey={WEBAPP_FEEDBACK_FORM_CONTRIBUTION_KEY}
                    notice={this.state.feedback}
                    onEditedChanged={this.onEditedChanged}
                    canSave={this.canSave}
                    save={!!save ? this._save : null}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = (state, props) => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    fetchingFeedbacks: state.webapp.fetchingFeedbacks,
    errorFeedbacks: state.webapp.errorFeedbacks,
    fetchedFeedbacks: state.webapp.fetchedFeedbacks,
    feedback: state.webapp.feedback,
    submittingMutation: state.webapp.submittingMutation,
    mutation: state.webapp.mutation,
})

export default withHistory(withModulesManager(connect(mapStateToProps, { fetchFeedbacks})(
    injectIntl(withTheme(withStyles(styles)(FeedbackForm))
    ))));