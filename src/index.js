import messages_en from "./translations/en.json";
import MyModuleMainMenu from "./menu/MyModuleMainMenu";
import NoticesPage
 from "./pages/NoticesPage";
const ROUTE_TO_NOTICE = "my_module/notices";
const ADD_NOTICE = "my_module/add_notices";
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
  "core.Router": [
    { path: ROUTE_TO_NOTICE, component: NoticesPage },
    { path: ADD_NOTICE, component: NoticePage },
    { path: PAYMENTS_PAGE, component: PaymentsPage },
    { path: FEEDBACK_PAGE, component: FeedbackPage },
    
  ],
}
export const MyModuleModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
}