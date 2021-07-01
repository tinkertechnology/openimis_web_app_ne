import messages_en from "./translations/en.json";
import MyModuleMainMenu from "./menu/MyModuleMainMenu";
import NoticesPage
 from "./pages/NoticesPage";
const ROUTE_TO_NOTICE = "my_module/notices";
const ADD_NOTICE = "my_module/notice";
const EDIT_NOTICE = "my_module/edit_notice";
const PAYMENTS_PAGE = "my_module/payments";
const FEEDBACK_PAGE = "my_module/feedbacks";

import reducer from "./reducers";
import NoticePage from "./pages/NoticePage";
import PaymentsPage from "./pages/PaymentsPage";
import FeedbackPage from "./pages/FeedbackPage";



const DEFAULT_CONFIG = {
  "translations": [{ key: 'en', messages: messages_en }],
  "reducers": [{ key: 'my_module', reducer }],
  "core.MainMenu" : [MyModuleMainMenu],
  "refs": [
    { key: "my_module.route.notice_edit", ref: ADD_NOTICE },
  ],
  "core.Router": [
    { path: ROUTE_TO_NOTICE, component: NoticesPage },
    { path: ADD_NOTICE+"/:notice_id?", component: NoticePage },
    // { path: EDIT_NOTICE +"/:notice_id", component: NoticePage },
    { path: PAYMENTS_PAGE, component: PaymentsPage },
    { path: FEEDBACK_PAGE, component: FeedbackPage },
    
  ],
}
export const MyModuleModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
}