import React, {Component} from "react";
import {Keyboard, ScreenShare} from "@material-ui/icons";
import {MainMenuContribution, withModulesManager} from "@openimis/fe-core";

class MyModuleMainMenu extends Component {
    render(){
        const {rights} = this.props;
        const {intl} = this.props;
        let entries = []
        entries.push(
            {
                text: "Notices",
                icon: <Keyboard />,
                route: "/my_module/notices"
            },
            {
                text: "Add Notice",
                icon: <Keyboard />,
                route: "/my_module/add_notices"
            }            
        );
        if(!entries.length) return null;
        return(
            <MainMenuContribution
            {...this.props}
            header="APP"
            icon={<ScreenShare />}
            entries={entries}
            />
        )
    }
}

export default withModulesManager(MyModuleMainMenu);