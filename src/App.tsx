import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home";
import OnboardingPage from "./components/onboardingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <OnboardingPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
export default App;
