import { BrowserRouter, Switch, Route } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import UserForm from "./components/UserForm";
import NotFound from "./components/NotFound"


const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route exact path="/userform" component={UserForm} />
      <Route exact path="/userform/:id" component={UserForm} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
)

export default App;
