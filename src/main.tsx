import { createElement, mount } from "./jsx-runtime";
import { Dashboard } from "./dashboard";
import "./style.css";

const App = () => {
  return <Dashboard />;
};

const appRoot = document.getElementById("root");
if (appRoot) {
  mount(<App />, appRoot);
}