import Router from "preact-router";
import "./App.css";
import { EditorPage } from "./pages/editor";
import { WelcomePage } from "./pages/welcome";

function App() {
    return (
        <Router>
            <WelcomePage path="/" />
            <EditorPage path="/editor" />
        </Router>
    );
}

export default App;
