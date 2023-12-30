import Router from "preact-router";
import "./App.css";
import { EditorPage } from "./pages/editor";
import { RecentsPage } from "./pages/recents";
import { WelcomePage } from "./pages/welcome";

function App() {
    return (
        <Router>
            <WelcomePage path="/" />
            <RecentsPage path="/recents" />
            <EditorPage path="/editor" />
        </Router>
    );
}

export default App;
