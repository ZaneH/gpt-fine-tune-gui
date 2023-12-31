import Router from "preact-router";
import "./App.css";
import { OpenAIEditorPage } from "./pages/OpenAIEditor";
import { WelcomePage } from "./pages/WelcomePage";
import { AlpacaEditorPage } from "./pages/AlpacaEditor";

function App() {
    return (
        <Router>
            <WelcomePage path="/" />
            <OpenAIEditorPage path="/editor/openai" />
            <AlpacaEditorPage path="/editor/alpaca" />
        </Router>
    );
}

export default App;
